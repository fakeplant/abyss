import { useEffect, useRef } from "react"
import * as THREE from "three"
import {
  GizmoHelper,
  GizmoViewcube,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useThree } from "@react-three/fiber"
import { STRUCTURE_CENTER, STRUCTURE_SIZE } from "../../data/carStructure"

function Cameras() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    const maxDim = Math.max(
      STRUCTURE_SIZE.x,
      STRUCTURE_SIZE.y,
      STRUCTURE_SIZE.z
    )
    const distance = maxDim * 1.3

    camera.position.set(
      STRUCTURE_CENTER.x + distance,
      STRUCTURE_CENTER.y + distance * 0.5,
      STRUCTURE_CENTER.z + distance
    )
    camera.lookAt(STRUCTURE_CENTER)

    if ("zoom" in camera) {
      camera.zoom = 24
      camera.updateProjectionMatrix()
    }

    controlsRef.current?.target.copy(STRUCTURE_CENTER)
    controlsRef.current?.update()
  }, [camera])

  return (
    <>
      <GizmoHelper
        alignment="bottom-right"
        margin={[50, 50]}
      >
        <GizmoViewcube />
      </GizmoHelper>
      <OrthographicCamera
        makeDefault
        near={-1000}
        far={75}
        zoom={24}
      />
      <OrbitControls
        enableDamping={false}
        makeDefault
        screenSpacePanning
        ref={controlsRef}
        minZoom={6}
        maxZoom={400}
        target={STRUCTURE_CENTER}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
      />
    </>
  )
}

export default Cameras
