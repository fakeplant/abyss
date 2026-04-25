import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import * as THREE from "three"
import Cameras from "./Cameras"
import Scene from "./Scene"

function Loading() {
  return null
}

function Abyss() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <Canvas
      ref={canvasRef}
      shadows
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ height: "100%", width: "100%" }}
    >
      <Suspense fallback={<Loading />}>
        <Scene />
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          fadeDistance={70}
          fadeStrength={4}
          sectionColor="#8aa8b8"
          cellColor="#d4dde2"
        />
        <Cameras />
      </Suspense>
    </Canvas>
  )
}

export default Abyss
