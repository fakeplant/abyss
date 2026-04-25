import { useEffect, useMemo, useRef } from "react"
import { Billboard, Text } from "@react-three/drei"
import * as THREE from "three"
import {
  DMX_FIXTURES,
  DmxFixture,
  STRUCTURE_PANELS,
  STRUCTURE_EDGES_RESOLVED,
  STRUCTURE_VERTICES_METERS,
  StructurePanel,
  getPanelInsetPositions,
} from "../../data/carStructure"
import { useAbyssStore } from "../../hooks/useAbyssStore"

interface TubeEdgeProps {
  start: readonly [number, number, number]
  end: readonly [number, number, number]
  radius: number
  color: string
  opacity: number
}

interface PanelMeshProps {
  panel: StructurePanel
  color: string
  gapMeters: number
}

const Y_AXIS = new THREE.Vector3(0, 1, 0)
const NEGATIVE_Y_AXIS = new THREE.Vector3(0, -1, 0)
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const FAKE_BEAM_LENGTH_METERS = 8
const REAL_BEAM_DISTANCE_METERS = 18

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
  return THREE.MathUtils.degToRad(THREE.MathUtils.clamp(beamAngleDeg, 1, 85) / 2)
}

function TubeEdge({ start, end, radius, color, opacity }: TubeEdgeProps) {
  const startVector = new THREE.Vector3(...start)
  const endVector = new THREE.Vector3(...end)
  const direction = endVector.clone().sub(startVector)
  const length = direction.length()
  const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    Y_AXIS,
    direction.clone().normalize()
  )

  return (
    <mesh
      castShadow
      receiveShadow
      position={midpoint}
      quaternion={quaternion}
    >
      <cylinderGeometry args={[radius, radius, length, 14]} />
      <meshStandardMaterial
        color={color}
        roughness={0.74}
        metalness={0.45}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  )
}

function PanelMesh({ panel, color, gapMeters }: PanelMeshProps) {
  const geometry = useMemo(() => {
    const points = getPanelInsetPositions(panel, gapMeters)

    if (!points) {
      return null
    }

    const panelGeometry = new THREE.BufferGeometry()
    panelGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        points.flatMap((point) => [point.x, point.y, point.z]),
        3
      )
    )
    panelGeometry.setIndex([0, 1, 2])
    panelGeometry.computeVertexNormals()

    return panelGeometry
  }, [panel, gapMeters])

  if (!geometry) {
    return null
  }

  return (
    <mesh
      geometry={geometry}
      castShadow
      receiveShadow
      renderOrder={1}
    >
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.92}
        metalness={0}
        depthWrite
      />
    </mesh>
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

interface DmxCanFixtureProps {
  fixture: DmxFixture
  renderMode: "real" | "fake"
  color: string
  realIntensity: number
  fakeIntensity: number
  beamAngleDeg: number
  castShadows: boolean
}

function DmxCanFixture({
  fixture,
  renderMode,
  color,
  realIntensity,
  fakeIntensity,
  beamAngleDeg,
  castShadows,
}: DmxCanFixtureProps) {
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  const direction = useMemo(() => getFixtureBeamDirection(fixture), [fixture])
  const halfAngleRadians = getBeamHalfAngleRadians(beamAngleDeg)
  const lensPosition = new THREE.Vector3(...fixture.position)
  const bodyPosition = lensPosition
    .clone()
    .addScaledVector(direction, -0.16)
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
      >
        <cylinderGeometry args={[0.125, 0.125, 0.35, 20]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.62}
          metalness={0.72}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={lensCenter}
        quaternion={bodyQuaternion}
      >
        <cylinderGeometry args={[0.095, 0.095, 0.03, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={renderMode === "real" ? 0.45 : 0.9}
          roughness={0.24}
          metalness={0.12}
        />
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
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
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
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={THREE.MathUtils.clamp(fakeIntensity * 2, 0, 1.2)}
            transparent
            opacity={THREE.MathUtils.clamp(fakeIntensity, 0, 0.65)}
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={1}
            metalness={0}
          />
        </mesh>
      )}
    </group>
  )
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
  } = useAbyssStore()
  const radius = Math.max(tubeDiameterMeters / 2, 0.001)

  return (
    <>
      <color
        attach="background"
        args={["#1f1f1f"]}
      />
      <ambientLight intensity={1.7} />
      <directionalLight
        castShadow
        position={[6, 16, 10]}
        intensity={2.1}
        shadow-mapSize={2048}
      />
      <directionalLight
        position={[-8, 8, -12]}
        intensity={0.7}
      />
      <group>
        {showPanels &&
          STRUCTURE_PANELS.map((panel) => (
            <PanelMesh
              key={panel.id}
              panel={panel}
              color={panelColor}
              gapMeters={panelGapMeters}
            />
          ))}
        {showDmxFixtures &&
          DMX_FIXTURES.map((fixture) => (
            <DmxCanFixture
              key={fixture.id}
              fixture={fixture}
              renderMode={dmxRenderMode}
              color={dmxColor}
              realIntensity={dmxRealIntensity}
              fakeIntensity={dmxFakeIntensity}
              beamAngleDeg={dmxBeamAngleDeg}
              castShadows={dmxCastShadows}
            />
          ))}
        {STRUCTURE_EDGES_RESOLVED.map((edge) => (
          <TubeEdge
            key={edge.id}
            start={edge.verticesMeters[0].position}
            end={edge.verticesMeters[1].position}
            radius={radius}
            color={tubeColor}
            opacity={tubeOpacity}
          />
        ))}
        {showLabels && <VertexLabels />}
      </group>
    </>
  )
}

export default Scene
