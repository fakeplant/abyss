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
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js"
import {
  STRUCTURE_PANELS,
  STRUCTURE_EDGES_RESOLVED,
  STRUCTURE_VERTICES_METERS,
  getPanelInsetPositions,
} from "../../data/carStructure"
import {
  BAR_FIXTURES,
  BarFixture,
  SPOTLIGHT_FIXTURES,
  SpotlightFixture,
} from "../../data/fixtures"
import {
  HUMAN_MODEL_URL,
  HUMAN_PLACEMENTS,
  HumanPlacement,
} from "../../data/humans"
import { useAbyssStore } from "../../hooks/useAbyssStore"

const Y_AXIS = new THREE.Vector3(0, 1, 0)
const REAL_BEAM_DISTANCE_METERS = 18
const CLOUD_FADE_SECONDS = 5
const BAR_LENGTH_METERS = 0.5
const BAR_WIDTH_METERS = 0.0508
const BAR_BASE_HEIGHT_METERS = 0.0508
const BAR_GAP_METERS = 0.0254
const BAR_HEAD_HEIGHT_METERS = 0.0762
const BAR_SPIN_DEG_PER_SECOND = 36
const BAR_REAR_COB_WIDTH_METERS = BAR_LENGTH_METERS * 0.78
const BAR_REAR_COB_HEIGHT_METERS = BAR_WIDTH_METERS * 0.65
const BAR_REAR_COB_INTENSITY_SCALE = 10
const DEBUG_BAR_BEAM_FIXTURE_ID = "bar-right-9-12-01"

RectAreaLightUniformsLib.init()

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

function getFixtureBeamDirection(fixture: SpotlightFixture) {
  const direction = new THREE.Vector3(...fixture.neutralDirection).normalize()
  const rotationXAxis = new THREE.Vector3(...fixture.rotationXAxis).normalize()
  const rotationYAxis = new THREE.Vector3(...fixture.rotationYAxis).normalize()
  const pitchRadians = THREE.MathUtils.degToRad(fixture.rotation.xDeg)
  const yawRadians = THREE.MathUtils.degToRad(fixture.rotation.yDeg)

  return direction
    .applyAxisAngle(rotationXAxis, pitchRadians)
    .applyAxisAngle(rotationYAxis, yawRadians)
    .normalize()
}

function getBarQuaternion(fixture: BarFixture) {
  const xAxis = new THREE.Vector3(...fixture.mountDirection).normalize()
  const yAxis = new THREE.Vector3(...fixture.neutralDirection).normalize()
  const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize()

  return new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis)
  )
}

function getBeamHalfAngleRadians(beamAngleDeg: number) {
  return THREE.MathUtils.degToRad(
    THREE.MathUtils.clamp(beamAngleDeg, 1, 85) / 2
  )
}

function normalizeBarRotationDeg(rotationDeg: number) {
  return THREE.MathUtils.euclideanModulo(rotationDeg + 180, 360) - 180
}

function normalizeBarRotation0To360Deg(rotationDeg: number) {
  return THREE.MathUtils.euclideanModulo(rotationDeg, 360)
}

function getFakeBeamLengthScale(rotationDeg: number) {
  const rotation0To360 = normalizeBarRotation0To360Deg(rotationDeg)

  if (rotation0To360 <= 90 || rotation0To360 >= 270) {
    return 1
  }

  if (rotation0To360 < 100) {
    return THREE.MathUtils.clamp((100 - rotation0To360) / 10, 0, 1)
  }

  if (rotation0To360 <= 260) {
    return 0
  }

  return THREE.MathUtils.clamp((rotation0To360 - 260) / 10, 0, 1)
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

interface SpotlightFixtureProps {
  fixture: SpotlightFixture
  color: string
  intensity: number
  beamAngleDeg: number
  castShadows: boolean
  bodyMaterial: THREE.Material
  lensMaterial: THREE.Material
}

function SpotlightFixtureView({
  fixture,
  color,
  intensity,
  beamAngleDeg,
  castShadows,
  bodyMaterial,
  lensMaterial,
}: SpotlightFixtureProps) {
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
      <object3D
        ref={targetRef}
        position={beamTarget}
      />
      <spotLight
        ref={lightRef}
        position={lensPosition}
        color={color}
        intensity={intensity}
        angle={halfAngleRadians}
        penumbra={0.42}
        distance={REAL_BEAM_DISTANCE_METERS}
        decay={1.25}
        castShadow={castShadows}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0002}
      />
    </group>
  )
}

interface BarFixtureProps {
  fixture: BarFixture
  rotationOffsetDeg: number
  emitterBrightness: number
  cobBrightness: number
  beamLengthMeters: number
  beamAngleDeg: number
  mountOffsetMeters: number
  bodyMaterial: THREE.Material
}

interface BarEmitterProps {
  color: string
  x: number
  emitterBrightness: number
  beamRadius: number
  beamLengthMeters: number
  beamRef: (mesh: THREE.Mesh | null) => void
}

function BarEmitter({
  color,
  x,
  emitterBrightness,
  beamRadius,
  beamLengthMeters,
  beamRef,
}: BarEmitterProps) {
  return (
    <group>
      <mesh position={[x, BAR_HEAD_HEIGHT_METERS / 2 + 0.004, 0.012]}>
        <sphereGeometry args={[0.016, 18, 10]} />
        <meshLambertMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emitterBrightness}
        />
      </mesh>
      <mesh
        ref={beamRef}
        position={[x, BAR_HEAD_HEIGHT_METERS / 2 + beamLengthMeters / 2, 0.012]}
        scale={[beamRadius, beamLengthMeters, beamRadius]}
        renderOrder={2}
      >
        <coneGeometry args={[1, 1, 18, 1, true]} />
        <meshLambertMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emitterBrightness * 0.6}
          opacity={THREE.MathUtils.clamp(emitterBrightness * 0.18, 0, 0.28)}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function BarFixtureView({
  fixture,
  rotationOffsetDeg,
  emitterBrightness,
  cobBrightness,
  beamLengthMeters,
  beamAngleDeg,
  mountOffsetMeters,
  bodyMaterial,
}: BarFixtureProps) {
  const headRef = useRef<THREE.Group>(null)
  const beamRefs = useRef<Array<THREE.Mesh | null>>([])
  const lastBeamDebugLogRef = useRef(0)
  const quaternion = useMemo(() => getBarQuaternion(fixture), [fixture])
  const position = useMemo(
    () =>
      new THREE.Vector3(...fixture.mountPoint).add(
        new THREE.Vector3(...fixture.neutralDirection).multiplyScalar(
          THREE.MathUtils.clamp(mountOffsetMeters, 0, 0.3)
        )
      ),
    [fixture, mountOffsetMeters]
  )
  const baseRotationDeg = normalizeBarRotationDeg(
    fixture.rotationDeg + rotationOffsetDeg
  )
  const headRotation = THREE.MathUtils.degToRad(baseRotationDeg)
  const safeBeamLength = Math.max(0.05, beamLengthMeters)
  const beamRadius =
    Math.tan(getBeamHalfAngleRadians(beamAngleDeg)) * safeBeamLength
  const emitterXStart = -BAR_LENGTH_METERS / 2 + BAR_LENGTH_METERS / 16
  const emitterSpacing = BAR_LENGTH_METERS / 8
  const minBeamLength = Math.min(
    safeBeamLength,
    Math.max(0.001, mountOffsetMeters)
  )

  function getEffectiveBeamLength(rotationDeg: number) {
    if (!fixture.scaleFakeBeamWithRotation) {
      return safeBeamLength
    }

    const scale = getFakeBeamLengthScale(rotationDeg)

    return THREE.MathUtils.lerp(minBeamLength, safeBeamLength, scale)
  }

  function updateBeamMeshes(rotationDeg: number) {
    const effectiveBeamLength = getEffectiveBeamLength(rotationDeg)
    const effectiveBeamRadius =
      Math.tan(getBeamHalfAngleRadians(beamAngleDeg)) * effectiveBeamLength

    beamRefs.current.forEach((beam) => {
      if (!beam) {
        return
      }

      beam.position.y = BAR_HEAD_HEIGHT_METERS / 2 + effectiveBeamLength / 2
      beam.scale.set(
        effectiveBeamRadius,
        effectiveBeamLength,
        effectiveBeamRadius
      )
    })
  }

  useLayoutEffect(() => {
    updateBeamMeshes(baseRotationDeg)
  })

  useFrame(({ clock }) => {
    if (!headRef.current) {
      return
    }

    const rawRotationDeg =
      baseRotationDeg + clock.elapsedTime * BAR_SPIN_DEG_PER_SECOND
    const rotationDeg = normalizeBarRotationDeg(rawRotationDeg)
    const effectiveBeamLength = getEffectiveBeamLength(rotationDeg)

    headRef.current.rotation.x = THREE.MathUtils.degToRad(rotationDeg)
    updateBeamMeshes(rotationDeg)

    if (
      fixture.id === DEBUG_BAR_BEAM_FIXTURE_ID &&
      clock.elapsedTime - lastBeamDebugLogRef.current > 0.25
    ) {
      lastBeamDebugLogRef.current = clock.elapsedTime
      const rotation0To360Deg = normalizeBarRotation0To360Deg(rawRotationDeg)
      const scale = getFakeBeamLengthScale(rotation0To360Deg)

      console.info(
        `[Abyss bar beam debug] ${fixture.id} ` +
          `raw=${rawRotationDeg.toFixed(2)}deg ` +
          `rot360=${rotation0To360Deg.toFixed(2)}deg ` +
          `signed=${rotationDeg.toFixed(2)}deg ` +
          `scale=${scale.toFixed(3)} ` +
          `length=${effectiveBeamLength.toFixed(3)}m ` +
          `min=${minBeamLength.toFixed(3)}m ` +
          `max=${safeBeamLength.toFixed(3)}m ` +
          `enabled=${fixture.scaleFakeBeamWithRotation}`
      )
    }
  })

  return (
    <group
      position={position}
      quaternion={quaternion}
    >
      <mesh
        castShadow
        receiveShadow
        position={[0, BAR_BASE_HEIGHT_METERS / 2, 0]}
        material={bodyMaterial}
      >
        <boxGeometry
          args={[
            BAR_LENGTH_METERS,
            BAR_BASE_HEIGHT_METERS,
            BAR_WIDTH_METERS * 1.08,
          ]}
        />
      </mesh>
      <group
        ref={headRef}
        position={[
          0,
          BAR_BASE_HEIGHT_METERS + BAR_GAP_METERS + BAR_HEAD_HEIGHT_METERS / 2,
          0,
        ]}
        rotation={[headRotation, 0, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          material={bodyMaterial}
        >
          <boxGeometry
            args={[BAR_LENGTH_METERS, BAR_HEAD_HEIGHT_METERS, BAR_WIDTH_METERS]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          position={[-BAR_LENGTH_METERS / 2 - 0.012, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={bodyMaterial}
        >
          <cylinderGeometry
            args={[BAR_WIDTH_METERS * 0.55, BAR_WIDTH_METERS * 0.55, 0.024, 18]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          position={[BAR_LENGTH_METERS / 2 + 0.012, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={bodyMaterial}
        >
          <cylinderGeometry
            args={[BAR_WIDTH_METERS * 0.55, BAR_WIDTH_METERS * 0.55, 0.024, 18]}
          />
        </mesh>
        {fixture.frontEmitters.map((emitter, index) => {
          const x = emitterXStart + emitterSpacing * index

          return (
            <BarEmitter
              key={emitter.id}
              color={emitter.color}
              x={x}
              emitterBrightness={emitterBrightness}
              beamRadius={beamRadius}
              beamLengthMeters={safeBeamLength}
              beamRef={(mesh) => {
                beamRefs.current[index] = mesh
              }}
            />
          )
        })}
        <rectAreaLight
          width={BAR_REAR_COB_WIDTH_METERS}
          height={BAR_REAR_COB_HEIGHT_METERS}
          color={fixture.rearCobColor}
          intensity={cobBrightness * BAR_REAR_COB_INTENSITY_SCALE}
          position={[0, -BAR_HEAD_HEIGHT_METERS / 2 - 0.006, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh position={[0, -BAR_HEAD_HEIGHT_METERS / 2 - 0.003, 0]}>
          <boxGeometry
            args={[
              BAR_REAR_COB_WIDTH_METERS,
              0.004,
              BAR_REAR_COB_HEIGHT_METERS,
            ]}
          />
          <meshBasicMaterial color={fixture.rearCobColor} />
        </mesh>
      </group>
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
    showSpotlights,
    spotlightColor,
    spotlightIntensity,
    spotlightBeamAngleDeg,
    spotlightCastShadows,
    showBars,
    barRotationDeg,
    barEmitterBrightness,
    barCobBrightness,
    barBeamLengthMeters,
    barBeamAngleDeg,
    barMountOffsetMeters,
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
        color: spotlightColor,
        emissive: spotlightColor,
        emissiveIntensity: 0.45,
        roughness: 0.24,
        metalness: 0.12,
      }),
    [spotlightColor]
  )

  useEffect(() => () => tubeMaterial.dispose(), [tubeMaterial])
  useEffect(() => () => panelMaterial.dispose(), [panelMaterial])
  useEffect(() => () => bodyMaterial.dispose(), [bodyMaterial])
  useEffect(() => () => lensMaterial.dispose(), [lensMaterial])

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
        {showSpotlights &&
          SPOTLIGHT_FIXTURES.map((fixture) => (
            <SpotlightFixtureView
              key={fixture.id}
              fixture={fixture}
              color={spotlightColor}
              intensity={spotlightIntensity}
              beamAngleDeg={spotlightBeamAngleDeg}
              castShadows={spotlightCastShadows}
              bodyMaterial={bodyMaterial}
              lensMaterial={lensMaterial}
            />
          ))}
        {showBars &&
          BAR_FIXTURES.map((fixture) => (
            <BarFixtureView
              key={fixture.id}
              fixture={fixture}
              rotationOffsetDeg={barRotationDeg}
              emitterBrightness={barEmitterBrightness}
              cobBrightness={barCobBrightness}
              beamLengthMeters={barBeamLengthMeters}
              beamAngleDeg={barBeamAngleDeg}
              mountOffsetMeters={barMountOffsetMeters}
              bodyMaterial={bodyMaterial}
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
