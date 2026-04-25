import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import Cameras from "./Cameras"
import Scene from "./Scene"
import { STRUCTURE_CENTER, STRUCTURE_SIZE } from "../../data/carStructure"

function Loading() {
  return null
}

function FloorPlane() {
  const floorSize = Math.max(STRUCTURE_SIZE.x, STRUCTURE_SIZE.z) * 100

  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[STRUCTURE_CENTER.x, 0, STRUCTURE_CENTER.z]}
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshLambertMaterial color="#1c1c1c" />
    </mesh>
  )
}

function Abyss() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <Canvas
      ref={canvasRef}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <Suspense fallback={<Loading />}>
        <color
          attach="background"
          args={["#1c1c1c"]}
        />
        <Scene />
        <FloorPlane />
        <Cameras />
      </Suspense>
    </Canvas>
  )
}

export default Abyss
