import * as THREE from "three"
import {
  STRUCTURE_CENTER,
  STRUCTURE_EDGE_KEYS,
  STRUCTURE_EDGES_RESOLVED,
} from "./carStructure"
import generatedBarFixtures from "./generatedBarFixtures.json"
import {
  barFixtureConfigListSchema,
  type BarFixtureConfig,
  type FixtureGravityOrientation,
} from "./fixtureSchemas"

export type FixtureMountKind = "edge" | "free"
export type { BarFixtureConfig, BarFrontEmitterConfig } from "./fixtureSchemas"

export interface FixtureRotation {
  xDeg: number
  yDeg: number
}

interface EdgeMountedFixtureConfig {
  mount: "edge"
  mountEdgeId: string
  edgeT?: number
  gravityOrientation: FixtureGravityOrientation
}

interface FreeFixtureConfig {
  mount: "free"
  position: readonly [number, number, number]
  gravityOrientation: FixtureGravityOrientation
}

interface SpotlightFixtureBaseConfig {
  id: string
  type: "spotlight"
  rotation: FixtureRotation
  color: string
}

export type SpotlightFixtureConfig = SpotlightFixtureBaseConfig &
  (EdgeMountedFixtureConfig | FreeFixtureConfig)

export interface ResolvedFixtureBase {
  id: string
  mount: FixtureMountKind
  mountEdgeId?: string
  edgeT?: number
  gravityOrientation: FixtureGravityOrientation
  position: readonly [number, number, number]
  neutralDirection: readonly [number, number, number]
  rotationXAxis: readonly [number, number, number]
  rotationYAxis: readonly [number, number, number]
}

export interface SpotlightFixture
  extends ResolvedFixtureBase,
    SpotlightFixtureBaseConfig {
  type: "spotlight"
}

export interface BarFixture extends ResolvedFixtureBase {
  type: "bar"
  mount: "edge"
  mountEdgeId: string
  mountPoint: readonly [number, number, number]
  rotationDeg: number
  scaleFakeBeamWithRotation: boolean
  frontEmitters: BarFixtureConfig["frontEmitters"]
  rearCobColor: string
  mountDirection: readonly [number, number, number]
}

export type DmxFixture = SpotlightFixture | BarFixture

const FIXTURE_EDGE_MAP = new Map(
  STRUCTURE_EDGES_RESOLVED.map((edge) => [edge.id, edge])
)

const EDGE_FIXTURE_MOUNT_OFFSET_METERS = 0.18
const SPOTLIGHT_MAX_ROTATION_DEG = 120
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const WORLD_RIGHT = new THREE.Vector3(1, 0, 0)
const WORLD_FORWARD = new THREE.Vector3(0, 0, 1)
const WORLD_LEFT = new THREE.Vector3(-1, 0, 0)
const WORLD_DOWN = new THREE.Vector3(0, -1, 0)

export const SPOTLIGHT_FIXTURE_CONFIGS = [
  {
    id: "spotlight-01",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "47-50",
    gravityOrientation: "up",
    rotation: { xDeg: -8, yDeg: -18 },
    color: "#ffdca8",
  },
  {
    id: "spotlight-02",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "56-58",
    gravityOrientation: "up",
    rotation: { xDeg: -10, yDeg: 18 },
    color: "#ffdca8",
  },
  {
    id: "spotlight-03",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "69-82",
    gravityOrientation: "up",
    rotation: { xDeg: 6, yDeg: 12 },
    color: "#c7e7ff",
  },
  {
    id: "spotlight-04",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "73-92",
    gravityOrientation: "up",
    rotation: { xDeg: 6, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "spotlight-05",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "83-114",
    gravityOrientation: "left",
    rotation: { xDeg: -15, yDeg: -8 },
    color: "#fff1c9",
  },
  {
    id: "spotlight-06",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "88-110",
    gravityOrientation: "right",
    rotation: { xDeg: -18, yDeg: 10 },
    color: "#fff1c9",
  },
  {
    id: "spotlight-07",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "91-128",
    gravityOrientation: "left",
    rotation: { xDeg: 10, yDeg: -22 },
    color: "#ffd2f0",
  },
  {
    id: "spotlight-08",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "112-124",
    gravityOrientation: "right",
    rotation: { xDeg: -12, yDeg: 22 },
    color: "#ffd2f0",
  },
  {
    id: "spotlight-inside-01",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "45-46",
    gravityOrientation: "down",
    rotation: { xDeg: -6, yDeg: -8 },
    color: "#fff6d8",
  },
  {
    id: "spotlight-inside-02",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "82-92",
    gravityOrientation: "down",
    rotation: { xDeg: -4, yDeg: 10 },
    color: "#fff6d8",
  },
  {
    id: "spotlight-inside-03",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "110-111",
    gravityOrientation: "down",
    rotation: { xDeg: -8, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "spotlight-inside-04",
    type: "spotlight",
    mount: "edge",
    mountEdgeId: "36-37",
    gravityOrientation: "down",
    rotation: { xDeg: 8, yDeg: 16 },
    color: "#ffd2f0",
  },
  {
    id: "spotlight-free-01",
    type: "spotlight",
    mount: "free",
    position: [0, 5.35, -1.2],
    gravityOrientation: "up",
    rotation: { xDeg: -8, yDeg: 0 },
    color: "#fff6d8",
  },
  {
    id: "spotlight-free-02",
    type: "spotlight",
    mount: "free",
    position: [-0.72, 5.7, 1.2],
    gravityOrientation: "up",
    rotation: { xDeg: -10, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "spotlight-free-03",
    type: "spotlight",
    mount: "free",
    position: [0.72, 5.7, 1.2],
    gravityOrientation: "up",
    rotation: { xDeg: -10, yDeg: 12 },
    color: "#c7e7ff",
  },
  {
    id: "spotlight-free-04",
    type: "spotlight",
    mount: "free",
    position: [0, 4.8, -4.2],
    gravityOrientation: "up",
    rotation: { xDeg: 6, yDeg: 0 },
    color: "#ffd2f0",
  },
] as const satisfies readonly SpotlightFixtureConfig[]

export const BAR_FIXTURE_CONFIGS =
  barFixtureConfigListSchema.parse(generatedBarFixtures)

function getEdgeBasis(mountEdgeId: string, edgeT = 0.5) {
  const edge = FIXTURE_EDGE_MAP.get(mountEdgeId)

  if (!edge) {
    throw new Error(`Fixture references missing edge ${mountEdgeId}`)
  }

  const start = new THREE.Vector3(...edge.verticesMeters[0].position)
  const end = new THREE.Vector3(...edge.verticesMeters[1].position)
  const mountPoint = start
    .clone()
    .lerp(end, THREE.MathUtils.clamp(edgeT, 0, 1))
  const mountDirection = end.clone().sub(start)

  if (mountDirection.lengthSq() < 1e-8) {
    mountDirection.set(1, 0, 0)
  }

  mountDirection.normalize()

  return {
    mountPoint,
    mountDirection,
  }
}

function getWorldOrientationVector(orientation: FixtureGravityOrientation) {
  if (orientation === "left") {
    return WORLD_LEFT.clone()
  }

  if (orientation === "right") {
    return WORLD_RIGHT.clone()
  }

  if (orientation === "down") {
    return WORLD_DOWN.clone()
  }

  return WORLD_UP.clone()
}

function projectPerpendicularToEdge(
  target: THREE.Vector3,
  edgeAxis: THREE.Vector3
) {
  return target.clone().addScaledVector(edgeAxis, -target.dot(edgeAxis))
}

function getFreeGravityDirection(orientation: FixtureGravityOrientation) {
  return getWorldOrientationVector(orientation)
}

function getFallbackPerpendicularDirection(
  mountPoint: THREE.Vector3,
  mountDirection: THREE.Vector3
) {
  let fallback = projectPerpendicularToEdge(
    mountPoint.clone().sub(STRUCTURE_CENTER),
    mountDirection
  )

  if (fallback.lengthSq() >= 1e-8) {
    return fallback.normalize()
  }

  const candidates = [WORLD_UP, WORLD_RIGHT, WORLD_FORWARD]
  const bestCandidate = candidates.reduce((best, candidate) =>
    Math.abs(candidate.dot(mountDirection)) < Math.abs(best.dot(mountDirection))
      ? candidate
      : best
  )

  fallback = projectPerpendicularToEdge(bestCandidate, mountDirection)

  if (fallback.lengthSq() < 1e-8) {
    fallback.set(0, 0, 1)
  }

  return fallback.normalize()
}

function getEdgeGravityDirection(
  mountEdgeId: string,
  orientation: FixtureGravityOrientation,
  edgeT = 0.5
) {
  const basis = getEdgeBasis(mountEdgeId, edgeT)
  const worldTarget = getWorldOrientationVector(orientation)
  const neutralDirection = projectPerpendicularToEdge(
    worldTarget,
    basis.mountDirection
  )

  if (neutralDirection.lengthSq() < 1e-8) {
    neutralDirection.copy(
      getFallbackPerpendicularDirection(basis.mountPoint, basis.mountDirection)
    )
  } else {
    neutralDirection.normalize()
  }

  return {
    ...basis,
    neutralDirection,
  }
}

function getRotationAxes(
  neutralDirection: THREE.Vector3,
  preferredXAxis: THREE.Vector3
) {
  const rotationXAxis = preferredXAxis
    .clone()
    .addScaledVector(neutralDirection, -preferredXAxis.dot(neutralDirection))

  if (rotationXAxis.lengthSq() < 1e-8) {
    rotationXAxis.crossVectors(neutralDirection, WORLD_FORWARD)
  }

  if (rotationXAxis.lengthSq() < 1e-8) {
    rotationXAxis.crossVectors(neutralDirection, WORLD_RIGHT)
  }

  rotationXAxis.normalize()

  return {
    rotationXAxis,
    rotationYAxis: new THREE.Vector3()
      .crossVectors(neutralDirection, rotationXAxis)
      .normalize(),
  }
}

function resolveEdgeMount(
  mountEdgeId: string,
  gravityOrientation: FixtureGravityOrientation,
  edgeT = 0.5,
  offsetMeters = EDGE_FIXTURE_MOUNT_OFFSET_METERS
) {
  const { mountPoint, mountDirection, neutralDirection } =
    getEdgeGravityDirection(mountEdgeId, gravityOrientation, edgeT)
  const position = mountPoint
    .clone()
    .add(neutralDirection.clone().multiplyScalar(offsetMeters))
  const { rotationXAxis, rotationYAxis } = getRotationAxes(
    neutralDirection,
    mountDirection
  )

  return {
    position,
    mountPoint,
    neutralDirection,
    rotationXAxis,
    rotationYAxis,
    mountDirection,
  }
}

function resolveSpotlight(config: SpotlightFixtureConfig): SpotlightFixture {
  if (config.mount === "free") {
    const neutralDirection = getFreeGravityDirection(config.gravityOrientation)
    const { rotationXAxis, rotationYAxis } = getRotationAxes(
      neutralDirection,
      WORLD_RIGHT
    )

    return {
      ...config,
      rotation: {
        xDeg: THREE.MathUtils.clamp(
          config.rotation.xDeg,
          -SPOTLIGHT_MAX_ROTATION_DEG,
          SPOTLIGHT_MAX_ROTATION_DEG
        ),
        yDeg: THREE.MathUtils.clamp(
          config.rotation.yDeg,
          -SPOTLIGHT_MAX_ROTATION_DEG,
          SPOTLIGHT_MAX_ROTATION_DEG
        ),
      },
      neutralDirection: neutralDirection.toArray(),
      rotationXAxis: rotationXAxis.toArray(),
      rotationYAxis: rotationYAxis.toArray(),
    }
  }

  const { position, neutralDirection, rotationXAxis, rotationYAxis } =
    resolveEdgeMount(
      config.mountEdgeId,
      config.gravityOrientation,
      config.edgeT,
      EDGE_FIXTURE_MOUNT_OFFSET_METERS
    )

  return {
    ...config,
    rotation: {
      xDeg: THREE.MathUtils.clamp(
        config.rotation.xDeg,
        -SPOTLIGHT_MAX_ROTATION_DEG,
        SPOTLIGHT_MAX_ROTATION_DEG
      ),
      yDeg: THREE.MathUtils.clamp(
        config.rotation.yDeg,
        -SPOTLIGHT_MAX_ROTATION_DEG,
        SPOTLIGHT_MAX_ROTATION_DEG
      ),
    },
    position: position.toArray(),
    neutralDirection: neutralDirection.toArray(),
    rotationXAxis: rotationXAxis.toArray(),
    rotationYAxis: rotationYAxis.toArray(),
  }
}

function resolveBar(config: BarFixtureConfig): BarFixture {
  const {
    position,
    mountPoint,
    neutralDirection,
    rotationXAxis,
    rotationYAxis,
    mountDirection,
  } = resolveEdgeMount(
    config.mountEdgeId,
    config.gravityOrientation,
    config.edgeT,
    0
  )

  return {
    ...config,
    rotationDeg: THREE.MathUtils.euclideanModulo(config.rotationDeg, 360),
    position: position.toArray(),
    mountPoint: mountPoint.toArray(),
    neutralDirection: neutralDirection.toArray(),
    rotationXAxis: rotationXAxis.toArray(),
    rotationYAxis: rotationYAxis.toArray(),
    mountDirection: mountDirection.toArray(),
  }
}

export const SPOTLIGHT_FIXTURES = SPOTLIGHT_FIXTURE_CONFIGS.map(resolveSpotlight)
export const BAR_FIXTURES = BAR_FIXTURE_CONFIGS.map(resolveBar)
export const DMX_FIXTURES: readonly DmxFixture[] = [
  ...SPOTLIGHT_FIXTURES,
  ...BAR_FIXTURES,
]

export function validateFixtureData() {
  const errors: string[] = []

  for (const fixture of DMX_FIXTURES) {
    if (
      fixture.mount === "edge" &&
      fixture.mountEdgeId &&
      !STRUCTURE_EDGE_KEYS.has(fixture.mountEdgeId)
    ) {
      errors.push(
        `Fixture ${fixture.id} references missing edge ${fixture.mountEdgeId}`
      )
    }

    if (
      fixture.position.some((value) => !Number.isFinite(value)) ||
      fixture.neutralDirection.some((value) => !Number.isFinite(value)) ||
      fixture.rotationXAxis.some((value) => !Number.isFinite(value)) ||
      fixture.rotationYAxis.some((value) => !Number.isFinite(value))
    ) {
      errors.push(`Fixture ${fixture.id} has invalid derived coordinates`)
    }

    if (
      fixture.edgeT !== undefined &&
      (fixture.edgeT < 0 || fixture.edgeT > 1 || !Number.isFinite(fixture.edgeT))
    ) {
      errors.push(`Fixture ${fixture.id} edgeT is outside 0..1`)
    }

    if (
      fixture.type === "spotlight" &&
      (Math.abs(fixture.rotation.xDeg) > SPOTLIGHT_MAX_ROTATION_DEG ||
        Math.abs(fixture.rotation.yDeg) > SPOTLIGHT_MAX_ROTATION_DEG)
    ) {
      errors.push(
        `Spotlight ${fixture.id} rotation is outside +/-${SPOTLIGHT_MAX_ROTATION_DEG} degrees`
      )
    }

    if (fixture.type === "bar") {
      if (fixture.frontEmitters.length !== 8) {
        errors.push(`Bar ${fixture.id} must have exactly 8 front emitters`)
      }

      if (fixture.rotationDeg < 0 || fixture.rotationDeg >= 360) {
        errors.push(`Bar ${fixture.id} rotation is outside 0..360 degrees`)
      }

      if (
        fixture.mountPoint.some((value) => !Number.isFinite(value)) ||
        fixture.mountDirection.some((value) => !Number.isFinite(value))
      ) {
        errors.push(`Bar ${fixture.id} has invalid orientation vectors`)
      }

      const neutralDirection = new THREE.Vector3(...fixture.neutralDirection)
      const mountDirection = new THREE.Vector3(...fixture.mountDirection)

      if (Math.abs(neutralDirection.dot(mountDirection)) > 1e-5) {
        errors.push(`Bar ${fixture.id} neutral direction is not perpendicular`)
      }
    }
  }

  if (SPOTLIGHT_FIXTURES.length !== 16) {
    errors.push(`Expected 16 spotlights, found ${SPOTLIGHT_FIXTURES.length}`)
  }

  if (BAR_FIXTURES.length === 0) {
    errors.push("Expected at least one generated bar fixture")
  }

  return {
    valid: errors.length === 0,
    errors,
    fixtureCount: DMX_FIXTURES.length,
    spotlightCount: SPOTLIGHT_FIXTURES.length,
    barCount: BAR_FIXTURES.length,
  }
}
