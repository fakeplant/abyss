import { Billboard, Text } from "@react-three/drei"
import * as THREE from "three"
import {
  STRUCTURE_EDGES_RESOLVED,
  STRUCTURE_VERTICES_METERS,
} from "../../data/carStructure"
import { useAbyssStore } from "../../hooks/useAbyssStore"

interface TubeEdgeProps {
  start: readonly [number, number, number]
  end: readonly [number, number, number]
  radius: number
  color: string
  opacity: number
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
            outlineWidth={0.012}
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
  const { showLabels, tubeDiameterMeters, tubeColor, tubeOpacity } =
    useAbyssStore()
  const radius = Math.max(tubeDiameterMeters / 2, 0.001)

  return (
    <>
      <color
        attach="background"
        args={["#f7f8fa"]}
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
        {STRUCTURE_EDGES_RESOLVED.map((edge) => (
          <TubeEdge
            key={edge.id}
            start={edge.startVertex.position}
            end={edge.endVertex.position}
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
