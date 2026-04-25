import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import {
  Billboard,
  Cloud,
  Clouds,
  Text,
  useAnimations,
  useFBX,
} from "@react-three/drei"
import * as THREE from "three"
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js"
import {
  DMX_FIXTURES,
  DmxFixture,
  STRUCTURE_PANELS,
  STRUCTURE_EDGES_RESOLVED,
  STRUCTURE_VERTICES_METERS,
  getPanelInsetPositions,
} from "../../data/carStructure"
import {
  HUMAN_MODEL_URL,
  HUMAN_PLACEMENTS,
  HumanPlacement,
} from "../../data/humans"
import { DmxRenderMode, useAbyssStore } from "../../hooks/useAbyssStore"

const Y_AXIS = new THREE.Vector3(0, 1, 0)
const NEGATIVE_Y_AXIS = new THREE.Vector3(0, -1, 0)
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const FAKE_BEAM_LENGTH_METERS = 8
const REAL_BEAM_DISTANCE_METERS = 18
const CLOUD_FADE_SECONDS = 5

useFBX.preload(HUMAN_MODEL_URL)

function getStableUnitValue(value: string) {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0) / 0xffffffff
}

function smoothstep(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1)

  return clamped * clamped * (3 - 2 * clamped)
}

function getFixtureBeamDirection(fixture: DmxFixture) {
  const position = new THREE.Vector3(...fixture.position)
  const target = new THREE.Vector3(...fixture.baseTarget)
  const baseDirection = target.sub(position)

  if (baseDirection.lengthSq() < 1e-8) {
    baseDirection.set(0, 0, -1)
  }

  const direction = baseDirection.normalize()
  const yawRadians = THREE.MathUtils.degToRad(fixture.rotation.yDeg)
  const pitchRadians = THREE.MathUtils.degToRad(fixture.rotation.xDeg)
  direction.applyAxisAngle(WORLD_UP, yawRadians)

  const right = new THREE.Vector3().crossVectors(direction, WORLD_UP)

  if (right.lengthSq() < 1e-8) {
    right.set(1, 0, 0)
  }

  return direction.applyAxisAngle(right.normalize(), pitchRadians).normalize()
}

function getBeamHalfAngleRadians(beamAngleDeg: number) {
  return THREE.MathUtils.degToRad(
    THREE.MathUtils.clamp(beamAngleDeg, 1, 85) / 2
  )
}

interface TubeFrameProps {
  radius: number
  material: THREE.Material
}

function TubeFrame({ radius, material }: TubeFrameProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 14), [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useLayoutEffect(() => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    const matrix = new THREE.Matrix4()
    const scale = new THREE.Vector3()

    STRUCTURE_EDGES_RESOLVED.forEach((edge, index) => {
      const start = new THREE.Vector3(...edge.verticesMeters[0].position)
      const end = new THREE.Vector3(...edge.verticesMeters[1].position)
      const direction = end.clone().sub(start)
      const length = direction.length()
      const midpoint = start.add(end).multiplyScalar(0.5)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        Y_AXIS,
        direction.normalize()
      )

      scale.set(radius, length, radius)
      matrix.compose(midpoint, quaternion, scale)
      mesh.setMatrixAt(index, matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [radius])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, STRUCTURE_EDGES_RESOLVED.length]}
      castShadow
      receiveShadow
    />
  )
}

interface PanelLayerProps {
  gapMeters: number
  material: THREE.Material
}

function PanelLayer({ gapMeters, material }: PanelLayerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => {
    const panelGeometry = new THREE.BufferGeometry()

    panelGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3)
    )
    panelGeometry.setIndex([0, 1, 2])
    panelGeometry.computeVertexNormals()

    return panelGeometry
  }, [])
  const panelMatrices = useMemo(() => {
    const normal = new THREE.Vector3()

    return STRUCTURE_PANELS.flatMap((panel) => {
      const points = getPanelInsetPositions(panel, gapMeters)

      if (!points) {
        return []
      }

      const [a, b, c] = points
      const edgeOne = b.clone().sub(a)
      const edgeTwo = c.clone().sub(a)

      normal.crossVectors(edgeOne, edgeTwo)

      if (normal.lengthSq() < 1e-10) {
        return []
      }

      normal.normalize()

      return [
        new THREE.Matrix4().set(
          edgeOne.x,
          edgeTwo.x,
          normal.x,
          a.x,
          edgeOne.y,
          edgeTwo.y,
          normal.y,
          a.y,
          edgeOne.z,
          edgeTwo.z,
          normal.z,
          a.z,
          0,
          0,
          0,
          1
        ),
      ]
    })
  }, [gapMeters])

  useEffect(() => () => geometry.dispose(), [geometry])

  useLayoutEffect(() => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    panelMatrices.forEach((matrix, index) => {
      mesh.setMatrixAt(index, matrix)
    })

    mesh.count = panelMatrices.length
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [panelMatrices])

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, panelMatrices.length]}
      castShadow
      receiveShadow
      renderOrder={1}
    />
  )
}

function VertexLabels() {
  return (
    <>
      {STRUCTURE_VERTICES_METERS.map((vertex) => (
        <Billboard
          key={vertex.id}
          position={[
            vertex.position[0],
            vertex.position[1] + 0.14,
            vertex.position[2],
          ]}
        >
          <Text
            fontSize={0.18}
            color="#111827"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#ffffff"
          >
            {vertex.id}
          </Text>
        </Billboard>
      ))}
    </>
  )
}

interface HumanAvatarProps {
  placement: HumanPlacement
  globalScale: number
  animationSpeed: number
}

function HumanAvatar({
  placement,
  globalScale,
  animationSpeed,
}: HumanAvatarProps) {
  const fbx = useFBX(HUMAN_MODEL_URL)
  const model = useMemo(() => {
    const clonedModel = cloneSkeleton(fbx) as THREE.Group

    clonedModel.traverse((object) => {
      const mesh = object as THREE.Mesh

      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
      }
    })

    return clonedModel
  }, [fbx])
  const animations = useMemo(() => fbx.animations, [fbx.animations])
  const { actions, names, mixer } = useAnimations(animations, model)
  const activeAnimationName = names[0]

  useEffect(() => {
    if (!activeAnimationName) {
      return undefined
    }

    const action = actions[activeAnimationName]

    if (action) {
      const clipDuration = action.getClip().duration
      const offset = clipDuration * getStableUnitValue(placement.id)

      action.reset()
      action.time = offset
      action.fadeIn(0.25).play()
    }

    return () => {
      action?.fadeOut(0.2)
    }
  }, [actions, activeAnimationName, placement.id])

  useEffect(() => {
    mixer.timeScale = animationSpeed
  }, [animationSpeed, mixer])

  return (
    <primitive
      object={model}
      position={placement.position}
      rotation={[0, THREE.MathUtils.degToRad(placement.rotationYDeg), 0]}
      scale={placement.scale * globalScale}
    />
  )
}

interface HumanLayerProps {
  scale: number
  animationSpeed: number
}

function HumanLayer({ scale, animationSpeed }: HumanLayerProps) {
  return (
    <group>
      {HUMAN_PLACEMENTS.map((placement) => (
        <HumanAvatar
          key={placement.id}
          placement={placement}
          globalScale={scale}
          animationSpeed={animationSpeed}
        />
      ))}
    </group>
  )
}

function AnimatedClouds() {
  const [opacities, setOpacities] = useState([1, 0, 0])
  const previousOpacities = useRef(opacities)
  const cloudLayers = useMemo(
    () => [
      { color: "#cc0000", seed: 11 },
      { color: "#cc0000", seed: 29 },
      { color: "#cc0000", seed: 47 },
      { color: "#cc0000", seed: 23 },
      { color: "#cc0000", seed: 56 },
      { color: "#cc0000", seed: 99 },
    ],
    []
  )

  useFrame(({ clock }) => {
    const phase = (clock.elapsedTime / CLOUD_FADE_SECONDS) % cloudLayers.length
    const nextOpacities = cloudLayers.map((_, index) => {
      const distance = Math.min(
        Math.abs(phase - index),
        cloudLayers.length - Math.abs(phase - index)
      )

      return smoothstep(1 - distance)
    })
    const changed = nextOpacities.some(
      (opacity, index) =>
        Math.abs(opacity - previousOpacities.current[index]) > 0.015
    )

    if (changed) {
      previousOpacities.current = nextOpacities
      setOpacities(nextOpacities)
    }
  })

  return (
    <Clouds
      material={THREE.MeshBasicMaterial}
      limit={2000}
    >
      {cloudLayers.map((layer, index) => (
        <group key={layer.seed}>
          <Cloud
            seed={layer.seed}
            segments={40}
            bounds={[3, 5, 10]}
            volume={1}
            color={layer.color}
            fade={40}
            opacity={opacities[index] * 0.78}
            speed={0.08}
          />
          <Cloud
            seed={layer.seed + 1}
            bounds={[5, 5, 10]}
            volume={1}
            color={layer.color}
            fade={50}
            opacity={opacities[index] * 0.48}
            speed={0.05}
          />
        </group>
      ))}
    </Clouds>
  )
}

interface DmxCanFixtureProps {
  fixture: DmxFixture
  renderMode: DmxRenderMode
  color: string
  realIntensity: number
  beamAngleDeg: number
  castShadows: boolean
  bodyMaterial: THREE.Material
  lensMaterial: THREE.Material
  fakeBeamMaterial: THREE.Material
}

function DmxCanFixture({
  fixture,
  renderMode,
  color,
  realIntensity,
  beamAngleDeg,
  castShadows,
  bodyMaterial,
  lensMaterial,
  fakeBeamMaterial,
}: DmxCanFixtureProps) {
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  const direction = useMemo(() => getFixtureBeamDirection(fixture), [fixture])
  const halfAngleRadians = getBeamHalfAngleRadians(beamAngleDeg)
  const lensPosition = new THREE.Vector3(...fixture.position)
  const bodyPosition = lensPosition.clone().addScaledVector(direction, -0.16)
  const lensCenter = lensPosition.clone().addScaledVector(direction, 0.03)
  const bodyQuaternion = new THREE.Quaternion().setFromUnitVectors(
    Y_AXIS,
    direction
  )
  const beamTarget = lensPosition
    .clone()
    .addScaledVector(direction, REAL_BEAM_DISTANCE_METERS)

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current
      lightRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        position={bodyPosition}
        quaternion={bodyQuaternion}
        material={bodyMaterial}
      >
        <cylinderGeometry args={[0.125, 0.125, 0.35, 20]} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={lensCenter}
        quaternion={bodyQuaternion}
        material={lensMaterial}
      >
        <cylinderGeometry args={[0.095, 0.095, 0.03, 20]} />
      </mesh>
      {renderMode === "real" && (
        <>
          <object3D
            ref={targetRef}
            position={beamTarget}
          />
          <spotLight
            ref={lightRef}
            position={lensPosition}
            color={color}
            intensity={realIntensity}
            angle={halfAngleRadians}
            penumbra={0.42}
            distance={REAL_BEAM_DISTANCE_METERS}
            decay={1.25}
            castShadow={castShadows}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-bias={-0.0002}
          />
        </>
      )}
      {renderMode === "fake" && (
        <mesh
          position={lensPosition
            .clone()
            .addScaledVector(direction, FAKE_BEAM_LENGTH_METERS / 2)}
          quaternion={new THREE.Quaternion().setFromUnitVectors(
            NEGATIVE_Y_AXIS,
            direction
          )}
          renderOrder={2}
          material={fakeBeamMaterial}
        >
          <coneGeometry
            args={[
              Math.tan(halfAngleRadians) * FAKE_BEAM_LENGTH_METERS,
              FAKE_BEAM_LENGTH_METERS,
              32,
              1,
              true,
            ]}
          />
        </mesh>
      )}
    </group>
  )
}

interface SurfaceMaterialOptions {
  color: string
  roughness: number
  metalness: number
  emissive?: string
  emissiveIntensity?: number
  opacity?: number
  transparent?: boolean
  side?: THREE.Side
  depthWrite?: boolean
}

function createSurfaceMaterial({
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  opacity = 1,
  transparent = false,
  side = THREE.FrontSide,
  depthWrite = true,
}: SurfaceMaterialOptions) {
  return new THREE.MeshLambertMaterial({
    color,
    emissive,
    emissiveIntensity,
    opacity,
    transparent,
    side,
    depthWrite,
  })
}

function Scene() {
  const {
    showLabels,
    tubeDiameterMeters,
    tubeColor,
    tubeOpacity,
    showPanels,
    panelColor,
    panelGapMeters,
    showDmxFixtures,
    dmxRenderMode,
    dmxColor,
    dmxRealIntensity,
    dmxFakeIntensity,
    dmxBeamAngleDeg,
    dmxCastShadows,
    showHumans,
    humanScale,
    humanAnimationSpeed,
  } = useAbyssStore()
  const radius = Math.max(tubeDiameterMeters / 2, 0.001)
  const tubeMaterial = useMemo(
    () =>
      createSurfaceMaterial({
        color: tubeColor,
        roughness: 0.74,
        metalness: 0.45,
        transparent: tubeOpacity < 1,
        opacity: tubeOpacity,
      }),
    [tubeColor, tubeOpacity]
  )
  const panelMaterial = useMemo(
    () =>
      createSurfaceMaterial({
        color: panelColor,
        side: THREE.DoubleSide,
        roughness: 0.92,
        metalness: 0,
        depthWrite: true,
      }),
    [panelColor]
  )
  const bodyMaterial = useMemo(
    () =>
      createSurfaceMaterial({
        color: "#111111",
        roughness: 0.62,
        metalness: 0.72,
      }),
    []
  )
  const lensMaterial = useMemo(
    () =>
      createSurfaceMaterial({
        color: dmxColor,
        emissive: dmxColor,
        emissiveIntensity: dmxRenderMode === "real" ? 0.45 : 0.9,
        roughness: 0.24,
        metalness: 0.12,
      }),
    [dmxColor, dmxRenderMode]
  )
  const fakeBeamMaterial = useMemo(
    () =>
      createSurfaceMaterial({
        color: dmxColor,
        emissive: dmxColor,
        emissiveIntensity: THREE.MathUtils.clamp(dmxFakeIntensity * 2, 0, 1.2),
        transparent: true,
        opacity: THREE.MathUtils.clamp(dmxFakeIntensity, 0, 0.65),
        side: THREE.DoubleSide,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
      }),
    [dmxColor, dmxFakeIntensity]
  )

  useEffect(() => () => tubeMaterial.dispose(), [tubeMaterial])
  useEffect(() => () => panelMaterial.dispose(), [panelMaterial])
  useEffect(() => () => bodyMaterial.dispose(), [bodyMaterial])
  useEffect(() => () => lensMaterial.dispose(), [lensMaterial])
  useEffect(() => () => fakeBeamMaterial.dispose(), [fakeBeamMaterial])

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        position={[6, 16, 10]}
        intensity={3.1}
      />
      <directionalLight
        position={[-8, 8, -12]}
        intensity={1.7}
      />
      <AnimatedClouds />
      <group>
        {showPanels && (
          <PanelLayer
            gapMeters={panelGapMeters}
            material={panelMaterial}
          />
        )}
        {showDmxFixtures &&
          DMX_FIXTURES.map((fixture) => (
            <DmxCanFixture
              key={fixture.id}
              fixture={fixture}
              renderMode={dmxRenderMode}
              color={dmxColor}
              realIntensity={dmxRealIntensity}
              beamAngleDeg={dmxBeamAngleDeg}
              castShadows={dmxCastShadows}
              bodyMaterial={bodyMaterial}
              lensMaterial={lensMaterial}
              fakeBeamMaterial={fakeBeamMaterial}
            />
          ))}
        <TubeFrame
          radius={radius}
          material={tubeMaterial}
        />
        {showHumans && (
          <HumanLayer
            scale={humanScale}
            animationSpeed={humanAnimationSpeed}
          />
        )}
        {showLabels && <VertexLabels />}
      </group>
    </>
  )
}

export default Scene
