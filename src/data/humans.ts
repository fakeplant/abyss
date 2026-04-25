export interface HumanPlacement {
  id: string
  label: string
  position: readonly [number, number, number]
  rotationYDeg: number
  scale: number
}

export const HUMAN_MODEL_URL = "/models/humans/wave-hip-hop-dance.fbx"

export const HUMAN_PLACEMENTS = [
  {
    id: "human-front-left",
    label: "Front left",
    position: [-1.4, 0, 9.7],
    rotationYDeg: 170,
    scale: 0.01,
  },
  {
    id: "human-front-right",
    label: "Front right",
    position: [1.6, 0, 9.5],
    rotationYDeg: -165,
    scale: 0.01,
  },
  {
    id: "human-left-mid",
    label: "Left mid",
    position: [-3.55, 0, 3.2],
    rotationYDeg: 92,
    scale: 0.01,
  },
  {
    id: "human-right-mid",
    label: "Right mid",
    position: [3.55, 0, 2.4],
    rotationYDeg: -88,
    scale: 0.01,
  },
  {
    id: "human-left-rear",
    label: "Left rear",
    position: [-3.25, 0, -5.8],
    rotationYDeg: 70,
    scale: 0.01,
  },
  {
    id: "human-right-rear",
    label: "Right rear",
    position: [3.3, 0, -6.2],
    rotationYDeg: -72,
    scale: 0.01,
  },
  {
    id: "human-tail-left",
    label: "Tail left",
    position: [-1.2, 0, -10.0],
    rotationYDeg: 12,
    scale: 0.01,
  },
  {
    id: "human-tail-right",
    label: "Tail right",
    position: [1.3, 0, -9.8],
    rotationYDeg: -18,
    scale: 0.01,
  },
] as const satisfies readonly HumanPlacement[]
