/* eslint-env node */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import * as THREE from "three"
import {
  STRUCTURE_CENTER,
  STRUCTURE_EDGES_RESOLVED,
  type ResolvedEdge,
} from "../src/data/carStructure"
import {
  barFixtureConfigListSchema,
  type BarFixtureConfig,
  type FixtureGravityOrientation,
} from "../src/data/fixtureSchemas"

type SolverSide = "left" | "right"

interface SolverOptions {
  side: SolverSide
  fixtureLengthMeters: number
  minGapMeters: number
  edgeMarginMeters: number
  minEdgeLengthMeters: number
  crossCenterToleranceMeters: number
  maxBarsPerEdge: number
  gravityOrientation: FixtureGravityOrientation
  rotationDeg: number
  rearCobColor: string
  output: string
}

const DEFAULT_OPTIONS: SolverOptions = {
  side: "right",
  fixtureLengthMeters: 0.5,
  minGapMeters: 0.1,
  edgeMarginMeters: 0.1,
  minEdgeLengthMeters: 0,
  crossCenterToleranceMeters: 0.05,
  maxBarsPerEdge: Number.POSITIVE_INFINITY,
  gravityOrientation: "right",
  rotationDeg: 0,
  rearCobColor: "#f8fafc",
  output: "src/data/generatedBarFixtures.json",
}

const BAR_EMITTER_COLOR = "#ff0000"

function printHelp() {
  console.log(`Generate edge-mounted bar fixtures.

Usage:
  npm run generate:bars -- [options]

Options:
  --side left|right              Car side to solve. Default: right
  --fixture-length <meters>      Physical bar length. Default: 0.5
  --min-gap <meters>             Minimum gap between bars. Default: 0.1
  --edge-margin <meters>         Gap from each edge endpoint. Default: 0.1
  --min-edge-length <meters>     Skip edges shorter than this. Default: auto
  --cross-center-tolerance <m>   Strict side filter tolerance. Default: 0.05
  --max-bars-per-edge <count>    Cap generated bars per edge. Default: unlimited
  --gravity up|down|left|right   Mount wrap/orientation. Default: right
  --rotation <degrees>           Initial bar head rotation. Default: 0
  --rear-cob-color <hex>         Rear COB color. Default: #f8fafc
  --output <path>                JSON output path. Default: src/data/generatedBarFixtures.json`)
}

function parseNumber(value: string | undefined, flag: string) {
  const parsed = Number(value)

  if (!value || !Number.isFinite(parsed)) {
    throw new Error(`${flag} expects a finite number`)
  }

  return parsed
}

function parseInteger(value: string | undefined, flag: string) {
  const parsed = parseNumber(value, flag)

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} expects a positive integer`)
  }

  return parsed
}

function parseSide(value: string | undefined): SolverSide {
  if (value === "left" || value === "right") {
    return value
  }

  throw new Error("--side expects left or right")
}

function parseGravityOrientation(
  value: string | undefined
): FixtureGravityOrientation {
  if (
    value === "up" ||
    value === "down" ||
    value === "left" ||
    value === "right"
  ) {
    return value
  }

  throw new Error("--gravity expects up, down, left, or right")
}

function parseArgs(args: string[]): SolverOptions {
  const options = { ...DEFAULT_OPTIONS }

  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index]
    const value = args[index + 1]

    if (flag === "--help" || flag === "-h") {
      printHelp()
      process.exit(0)
    }

    if (!flag.startsWith("--")) {
      throw new Error(`Unexpected argument ${flag}`)
    }

    switch (flag) {
      case "--side":
        options.side = parseSide(value)
        index += 1
        break
      case "--fixture-length":
        options.fixtureLengthMeters = parseNumber(value, flag)
        index += 1
        break
      case "--min-gap":
        options.minGapMeters = parseNumber(value, flag)
        index += 1
        break
      case "--edge-margin":
        options.edgeMarginMeters = parseNumber(value, flag)
        index += 1
        break
      case "--min-edge-length":
        options.minEdgeLengthMeters = parseNumber(value, flag)
        index += 1
        break
      case "--cross-center-tolerance":
        options.crossCenterToleranceMeters = parseNumber(value, flag)
        index += 1
        break
      case "--max-bars-per-edge":
        options.maxBarsPerEdge = parseInteger(value, flag)
        index += 1
        break
      case "--gravity":
        options.gravityOrientation = parseGravityOrientation(value)
        index += 1
        break
      case "--rotation":
        options.rotationDeg = parseNumber(value, flag)
        index += 1
        break
      case "--rear-cob-color":
        if (!value) {
          throw new Error(`${flag} expects a color`)
        }
        options.rearCobColor = value
        index += 1
        break
      case "--output":
        if (!value) {
          throw new Error(`${flag} expects a path`)
        }
        options.output = value
        index += 1
        break
      default:
        throw new Error(`Unknown option ${flag}`)
    }
  }

  return options
}

function edgeIsOnSide(edge: ResolvedEdge, options: SolverOptions) {
  const xs = edge.verticesMeters.map((vertex) => vertex.position[0])

  if (options.side === "left") {
    return (
      Math.max(...xs) <=
      STRUCTURE_CENTER.x + options.crossCenterToleranceMeters
    )
  }

  return (
    Math.min(...xs) >= STRUCTURE_CENTER.x - options.crossCenterToleranceMeters
  )
}

function makeEmitters(): BarFixtureConfig["frontEmitters"] {
  return Array.from({ length: 8 }, (_value, index) => ({
    id: `emitter-${index + 1}`,
    color: BAR_EMITTER_COLOR,
  })) as BarFixtureConfig["frontEmitters"]
}

function round(value: number) {
  return Number(value.toFixed(6))
}

function solveBars(options: SolverOptions) {
  const fixtures: BarFixtureConfig[] = []
  const minEdgeLength =
    options.minEdgeLengthMeters ||
    options.fixtureLengthMeters + options.edgeMarginMeters * 2

  for (const edge of STRUCTURE_EDGES_RESOLVED) {
    if (!edgeIsOnSide(edge, options) || edge.lengthMeters < minEdgeLength) {
      continue
    }

    const usableLength = edge.lengthMeters - options.edgeMarginMeters * 2

    if (usableLength < options.fixtureLengthMeters) {
      continue
    }

    const capacity = Math.floor(
      (usableLength + options.minGapMeters) /
        (options.fixtureLengthMeters + options.minGapMeters)
    )
    const barCount = Math.min(capacity, options.maxBarsPerEdge)
    const usedLength =
      barCount * options.fixtureLengthMeters +
      Math.max(0, barCount - 1) * options.minGapMeters
    const firstCenterDistance =
      options.edgeMarginMeters +
      (usableLength - usedLength) / 2 +
      options.fixtureLengthMeters / 2

    for (let index = 0; index < barCount; index += 1) {
      const centerDistance =
        firstCenterDistance +
        index * (options.fixtureLengthMeters + options.minGapMeters)
      const edgeT = THREE.MathUtils.clamp(
        centerDistance / edge.lengthMeters,
        0,
        1
      )
      fixtures.push({
        id: `bar-${options.side}-${edge.id}-${String(index + 1).padStart(2, "0")}`,
        type: "bar",
        mount: "edge",
        mountEdgeId: edge.id,
        edgeT: round(edgeT),
        gravityOrientation: options.gravityOrientation,
        rotationDeg: THREE.MathUtils.euclideanModulo(options.rotationDeg, 360),
        scaleFakeBeamWithRotation: true,
        frontEmitters: makeEmitters(),
        rearCobColor: options.rearCobColor,
      })
    }
  }

  return fixtures
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const fixtures = barFixtureConfigListSchema.parse(solveBars(options))
  const outputPath = path.resolve(process.cwd(), options.output)

  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(fixtures, null, 2)}\n`, "utf8")

  console.log(
    `Generated ${fixtures.length} ${options.side}-side bar fixtures -> ${options.output}`
  )
  console.log(
    `fixtureLength=${options.fixtureLengthMeters}m minGap=${options.minGapMeters}m edgeMargin=${options.edgeMarginMeters}m gravity=${options.gravityOrientation}`
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
