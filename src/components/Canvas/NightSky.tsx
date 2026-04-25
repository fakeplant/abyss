import { useMemo } from "react"
import * as THREE from "three"
import { STRUCTURE_CENTER } from "../../data/carStructure"

const SKY_RADIUS_METERS = 220
const STAR_COUNT = 1200

function seededRandom(seed: number) {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296

    return state / 4294967296
  }
}

function NightSky() {
  const starGeometry = useMemo(() => {
    const random = seededRandom(0xaba55)
    const positions: number[] = []
    const colors: number[] = []

    for (let index = 0; index < STAR_COUNT; index += 1) {
      const y = -0.08 + random() * 1.08
      const angle = random() * Math.PI * 2
      const horizontalRadius = Math.sqrt(Math.max(0, 1 - y * y))
      const radius = SKY_RADIUS_METERS * (0.72 + random() * 0.24)
      const brightness = 0.45 + random() * 0.55
      const warmth = random()

      positions.push(
        STRUCTURE_CENTER.x + Math.cos(angle) * horizontalRadius * radius,
        STRUCTURE_CENTER.y + y * radius,
        STRUCTURE_CENTER.z + Math.sin(angle) * horizontalRadius * radius
      )
      colors.push(
        brightness,
        brightness * (0.88 + warmth * 0.12),
        brightness * (0.88 + (1 - warmth) * 0.18)
      )
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    return geometry
  }, [])

  return (
    <group renderOrder={-100}>
      <mesh
        position={STRUCTURE_CENTER}
        frustumCulled={false}
        renderOrder={-100}
      >
        <sphereGeometry args={[SKY_RADIUS_METERS, 64, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          depthTest={false}
          uniforms={{
            horizonColor: { value: new THREE.Color("#101722") },
            zenithColor: { value: new THREE.Color("#02040b") },
          }}
          vertexShader={`
            varying vec3 vDirection;

            void main() {
              vDirection = normalize(position);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 horizonColor;
            uniform vec3 zenithColor;
            varying vec3 vDirection;

            void main() {
              float gradient = smoothstep(-0.15, 0.85, vDirection.y);
              vec3 color = mix(horizonColor, zenithColor, gradient);
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
      <points
        geometry={starGeometry}
        frustumCulled={false}
        renderOrder={-90}
      >
        <pointsMaterial
          size={0.12}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.86}
          depthWrite={false}
          depthTest={false}
        />
      </points>
    </group>
  )
}

export default NightSky
