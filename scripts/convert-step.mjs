#!/usr/bin/env node
import { mkdir, stat } from "node:fs/promises"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  init,
  triangulate,
  writeGlbFile,
  writeGltfFile,
  writeObjFile,
} from "opencascade-tools"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const defaultInput = "/Users/user/Downloads/Audio ASEM 4_14_2022.STEP.step"
const defaultOutputDir = path.join(projectRoot, "public", "models")

function printHelp() {
  console.log(`Convert STEP/IGES CAD files to OBJ, GLTF, or GLB.

Usage:
  npm run convert:step -- [options]

Options:
  --input <path>          STEP/IGES input file.
                          Default: ${defaultInput}
  --output-dir <path>     Directory for converted files.
                          Default: ${defaultOutputDir}
  --name <name>           Output base filename without extension.
                          Default: input filename cleaned for URLs.
  --format <format>       Output format: glb, gltf, obj, or all.
                          Default: glb
  --lin-deflection <n>    Optional triangulation linear deflection.
  --ang-deflection <n>    Optional triangulation angular deflection.
  --relative              Use relative linear deflection for triangulation.
  --parallel              Enable parallel triangulation.
  --help                  Show this help.

Examples:
  npm run convert:step
  npm run convert:step -- --format obj
  npm run convert:step -- --format all --lin-deflection 0.5
`)
}

function parseArgs(argv) {
  const options = {
    input: defaultInput,
    outputDir: defaultOutputDir,
    format: "glb",
    name: undefined,
    linDeflection: undefined,
    angDeflection: undefined,
    relative: false,
    parallel: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]

    if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }

    if (arg === "--relative") {
      options.relative = true
      continue
    }

    if (arg === "--parallel") {
      options.parallel = true
      continue
    }

    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`)
    }

    if (arg === "--input") {
      options.input = path.resolve(next)
    } else if (arg === "--output-dir") {
      options.outputDir = path.resolve(next)
    } else if (arg === "--name") {
      options.name = next
    } else if (arg === "--format") {
      options.format = next.toLowerCase()
    } else if (arg === "--lin-deflection") {
      options.linDeflection = next
    } else if (arg === "--ang-deflection") {
      options.angDeflection = next
    } else {
      throw new Error(`Unknown option ${arg}`)
    }

    index += 1
  }

  return options
}

function cleanName(inputPath) {
  return path
    .basename(inputPath)
    .replace(/\.(step|stp|iges|igs)$/i, "")
    .replace(/\.(step|stp|iges|igs)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function getInputType(input) {
  const extension = path.extname(input).toLowerCase()

  if (extension === ".step" || extension === ".stp") {
    return "step"
  }

  if (extension === ".iges" || extension === ".igs") {
    return "iges"
  }

  throw new Error(`Unsupported input file extension "${extension}". Use STEP or IGES.`)
}

function getWriter(format) {
  if (format === "glb") {
    return writeGlbFile
  }

  if (format === "gltf") {
    return writeGltfFile
  }

  if (format === "obj") {
    return writeObjFile
  }

  throw new Error(`Unsupported format "${format}". Use glb, gltf, obj, or all.`)
}

function createDocumentHandle(oc) {
  const format = new oc.TCollection_ExtendedString_1()
  const doc = new oc.TDocStd_Document(format)

  return new oc.Handle_TDocStd_Document_2(doc)
}

function readCadFile(oc, input) {
  const inputType = getInputType(input)
  const virtualPath =
    inputType === "step" ? "/abyss-conversion-input.step" : "/abyss-conversion-input.iges"
  const data = readFileSync(input)

  if (oc.FS.analyzePath(virtualPath).exists) {
    oc.FS.unlink(virtualPath)
  }

  oc.FS.writeFile(virtualPath, data)

  try {
    if (inputType === "step") {
      console.log("> Reading STEP")
      const reader = new oc.STEPCAFControl_Reader_1()
      const result = reader.ReadFile(virtualPath)

      if (result !== oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
        throw new Error("Could not read STEP file.")
      }

      const docHandle = createDocumentHandle(oc)
      const progress = new oc.Message_ProgressRange_1()
      reader.Transfer_1(docHandle, progress)

      return docHandle
    }

    console.log("> Reading IGES")
    const reader = new oc.IGESCAFControl_Reader_1()
    const result = reader.ReadFile(virtualPath)

    if (result !== oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
      throw new Error("Could not read IGES file.")
    }

    const docHandle = createDocumentHandle(oc)
    const progress = new oc.Message_ProgressRange_1()
    reader.Transfer(docHandle, progress)

    return docHandle
  } finally {
    if (oc.FS.analyzePath(virtualPath).exists) {
      oc.FS.unlink(virtualPath)
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const formats =
    options.format === "all" ? ["glb", "gltf", "obj"] : [options.format]
  const allowedFormats = new Set(["glb", "gltf", "obj"])

  for (const format of formats) {
    if (!allowedFormats.has(format)) {
      throw new Error(`Unsupported format "${format}". Use glb, gltf, obj, or all.`)
    }
  }

  const inputStats = await stat(options.input)

  if (!inputStats.isFile()) {
    throw new Error(`Input is not a file: ${options.input}`)
  }

  await mkdir(options.outputDir, { recursive: true })

  const baseName = options.name ?? cleanName(options.input)
  const linDeflection = options.linDeflection
    ? Number.parseFloat(options.linDeflection)
    : undefined
  const angDeflection = options.angDeflection
    ? Number.parseFloat(options.angDeflection)
    : undefined

  if (linDeflection !== undefined && !Number.isFinite(linDeflection)) {
    throw new Error("--lin-deflection must be a finite number.")
  }

  if (angDeflection !== undefined && !Number.isFinite(angDeflection)) {
    throw new Error("--ang-deflection must be a finite number.")
  }

  console.log(`Loading OpenCascade...`)
  const oc = await init()

  console.log(`Reading ${options.input}`)
  const docHandle = readCadFile(oc, options.input)

  console.log(`Triangulating geometry`)
  triangulate(
    oc,
    docHandle.get(),
    linDeflection,
    options.relative,
    angDeflection,
    options.parallel
  )

  for (const format of formats) {
    const output = path.join(options.outputDir, `${baseName}.${format}`)
    const writer = getWriter(format)

    console.log(`Writing ${output}`)
    writer(oc, docHandle, output)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
