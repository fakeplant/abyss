import { useMemo } from "react"
import { Billboard, Text } from "@react-three/drei"
import * as THREE from "three"
import {
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

function Scene() {
  const {
    showLabels,
    tubeDiameterMeters,
    tubeColor,
    tubeOpacity,
    showPanels,
    panelColor,
    panelGapMeters,
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
