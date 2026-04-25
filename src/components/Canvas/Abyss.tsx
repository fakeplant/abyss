import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import * as THREE from "three"
import Cameras from "./Cameras"
import Scene from "./Scene"
import { useMantineTheme } from "@mantine/core"

function Loading() {
  return null
}

function Abyss() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useMantineTheme()

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
          sectionColor={theme.colors.dark[5]}
          cellColor={theme.colors.dark[5]}
        />
        <Cameras />
      </Suspense>
    </Canvas>
  )
}

export default Abyss
