import * as THREE from "three"

export type VertexId = number

export interface StructureVertex {
  id: VertexId
  microns: readonly [number, number, number]
}

export interface StructureEdge {
  id: string
  start: VertexId
  end: VertexId
}

export interface MeterVertex extends StructureVertex {
  position: readonly [number, number, number]
}

export interface ResolvedEdge extends StructureEdge {
  startVertex: MeterVertex
  endVertex: MeterVertex
  lengthMeters: number
}

export const MICRONS_PER_METER = 1_000_000

export const STRUCTURE_VERTICES = [
  { id: 9, microns: [2286000, 304799, 4496209] },
  { id: 10, microns: [-2286000, 304799, 4496209] },
  { id: 11, microns: [-2286000, 304800, 996900] },
  { id: 12, microns: [2286000, 304800, 996900] },
  { id: 25, microns: [2286000, 3962400, 5872727] },
  { id: 26, microns: [-2286000, 3962400, 5872727] },
  { id: 27, microns: [1346200, 3962400, 7366000] },
  { id: 28, microns: [-1346200, 3962400, 7366000] },
  { id: 30, microns: [0, 11430000, 4870002] },
  { id: 31, microns: [-1219200, 8873911, 3613224] },
  { id: 33, microns: [-457200, 10427199, 2514779] },
  { id: 36, microns: [762000, 7276608, -276895] },
  { id: 37, microns: [-762000, 7276608, -276895] },
  { id: 38, microns: [457200, 10427199, 2514779] },
  { id: 39, microns: [-1219200, 7483280, 2094085] },
  { id: 42, microns: [1219200, 8873911, 3613224] },
  { id: 43, microns: [1219200, 7483280, 2094085] },
  { id: 44, microns: [-1219200, 5080000, 0] },
  { id: 45, microns: [-457200, 6831201, -3317986] },
  { id: 46, microns: [457200, 6831201, -3317986] },
  { id: 47, microns: [-1219200, 5080000, -3185822] },
  { id: 50, microns: [-1219200, 6928813, -1347686] },
  { id: 51, microns: [-1966214, 5080000, -5622955] },
  { id: 52, microns: [1966214, 5080000, -5622955] },
  { id: 54, microns: [-1219200, 6387435, -5202305] },
  { id: 55, microns: [1219200, 6387435, -5202305] },
  { id: 56, microns: [1219200, 6928813, -1347686] },
  { id: 57, microns: [1219200, 5080000, 0] },
  { id: 58, microns: [1219200, 5080000, -3185822] },
  { id: 60, microns: [-2286000, 304799, -4496209] },
  { id: 65, microns: [-2286000, 304800, -996900] },
  { id: 67, microns: [-2286000, 1677170, -2427554] },
  { id: 69, microns: [-2286000, 3962400, -5872727] },
  { id: 70, microns: [-1346200, 3962400, -7366000] },
  { id: 73, microns: [1346200, 3962400, -7366000] },
  { id: 75, microns: [2286000, 3962400, -5872727] },
  { id: 78, microns: [2286000, 304800, -4496209] },
  { id: 79, microns: [2286000, 304800, -996900] },
  { id: 80, microns: [2286000, 1677170, -2427554] },
  { id: 81, microns: [0, 3962400, -7670800] },
  { id: 82, microns: [-1193800, 5080000, -7670800] },
  { id: 83, microns: [2216405, 1303450, 4838302] },
  { id: 84, microns: [1286736, 3965520, 3851275] },
  { id: 85, microns: [2221056, 1677170, 2427554] },
  { id: 86, microns: [1178926, 5080000, 3185822] },
  { id: 88, microns: [1966326, 5080000, 5622955] },
  { id: 89, microns: [-1651000, 2302101, -8679704] },
  { id: 90, microns: [-1286736, 3965520, -3851275] },
  { id: 91, microns: [1651000, 2302101, -8679704] },
  { id: 92, microns: [1193800, 5080000, -7670800] },
  { id: 93, microns: [-2286000, 1303450, -4838302] },
  { id: 96, microns: [1286736, 3965520, -3851275] },
  { id: 97, microns: [2286000, 1303450, -4838302] },
  { id: 98, microns: [-2221056, 1677170, 2427554] },
  { id: 99, microns: [-1286736, 3965520, 3851275] },
  { id: 100, microns: [-2216405, 1303450, 4838302] },
  { id: 101, microns: [-1178926, 5080000, 3185822] },
  { id: 102, microns: [-1966326, 5080000, 5622955] },
  { id: 109, microns: [0, 3962400, 7670800] },
  { id: 110, microns: [1193800, 5080000, 7670800] },
  { id: 111, microns: [-1193800, 5080000, 7670800] },
  { id: 112, microns: [1651000, 2302101, 8679704] },
  { id: 113, microns: [-1651000, 2302101, 8679704] },
  { id: 114, microns: [2088478, 1697881, 6355514] },
  { id: 115, microns: [-2088478, 1697881, 6355514] },
  { id: 116, microns: [1676400, 304799, 7315200] },
  { id: 117, microns: [-1676400, 304799, 7315200] },
  { id: 118, microns: [0, 9857387, 5270375] },
  { id: 119, microns: [0, 6831201, 6062764] },
  { id: 120, microns: [1219200, 7013152, 3751268] },
  { id: 121, microns: [-1219200, 7013152, 3751268] },
  { id: 122, microns: [0, 8086312, -5439131] },
  { id: 123, microns: [0, 7874589, -767379] },
  { id: 124, microns: [0, 304799, 8229600] },
  { id: 125, microns: [-1676400, 304799, -7315200] },
  { id: 126, microns: [0, 304799, -8229600] },
  { id: 127, microns: [-2088478, 1697881, -6355514] },
  { id: 128, microns: [2088478, 1697881, -6355514] },
  { id: 129, microns: [1676400, 304799, -7315200] },
] as const satisfies readonly StructureVertex[]

export const STRUCTURE_EDGES = [
  { id: "9-12", start: 9, end: 12 },
  { id: "9-83", start: 9, end: 83 },
  { id: "9-114", start: 9, end: 114 },
  { id: "9-116", start: 9, end: 116 },
  { id: "10-11", start: 10, end: 11 },
  { id: "10-100", start: 10, end: 100 },
  { id: "10-115", start: 10, end: 115 },
  { id: "10-117", start: 10, end: 117 },
  { id: "11-98", start: 11, end: 98 },
  { id: "11-100", start: 11, end: 100 },
  { id: "12-83", start: 12, end: 83 },
  { id: "12-85", start: 12, end: 85 },
  { id: "25-27", start: 25, end: 27 },
  { id: "25-83", start: 25, end: 83 },
  { id: "25-84", start: 25, end: 84 },
  { id: "25-88", start: 25, end: 88 },
  { id: "25-110", start: 25, end: 110 },
  { id: "25-114", start: 25, end: 114 },
  { id: "26-28", start: 26, end: 28 },
  { id: "26-99", start: 26, end: 99 },
  { id: "26-100", start: 26, end: 100 },
  { id: "26-102", start: 26, end: 102 },
  { id: "26-111", start: 26, end: 111 },
  { id: "26-115", start: 26, end: 115 },
  { id: "27-109", start: 27, end: 109 },
  { id: "27-110", start: 27, end: 110 },
  { id: "27-112", start: 27, end: 112 },
  { id: "27-114", start: 27, end: 114 },
  { id: "28-109", start: 28, end: 109 },
  { id: "28-111", start: 28, end: 111 },
  { id: "28-113", start: 28, end: 113 },
  { id: "28-115", start: 28, end: 115 },
  { id: "30-31", start: 30, end: 31 },
  { id: "30-33", start: 30, end: 33 },
  { id: "30-38", start: 30, end: 38 },
  { id: "30-42", start: 30, end: 42 },
  { id: "30-118", start: 30, end: 118 },
  { id: "31-33", start: 31, end: 33 },
  { id: "31-39", start: 31, end: 39 },
  { id: "31-118", start: 31, end: 118 },
  { id: "31-119", start: 31, end: 119 },
  { id: "31-121", start: 31, end: 121 },
  { id: "33-37", start: 33, end: 37 },
  { id: "33-38", start: 33, end: 38 },
  { id: "33-39", start: 33, end: 39 },
  { id: "36-37", start: 36, end: 37 },
  { id: "36-38", start: 36, end: 38 },
  { id: "36-43", start: 36, end: 43 },
  { id: "36-56", start: 36, end: 56 },
  { id: "36-57", start: 36, end: 57 },
  { id: "36-123", start: 36, end: 123 },
  { id: "37-39", start: 37, end: 39 },
  { id: "37-44", start: 37, end: 44 },
  { id: "37-50", start: 37, end: 50 },
  { id: "37-123", start: 37, end: 123 },
  { id: "38-42", start: 38, end: 42 },
  { id: "38-43", start: 38, end: 43 },
  { id: "39-44", start: 39, end: 44 },
  { id: "39-101", start: 39, end: 101 },
  { id: "39-121", start: 39, end: 121 },
  { id: "42-43", start: 42, end: 43 },
  { id: "42-118", start: 42, end: 118 },
  { id: "42-119", start: 42, end: 119 },
  { id: "42-120", start: 42, end: 120 },
  { id: "43-57", start: 43, end: 57 },
  { id: "43-86", start: 43, end: 86 },
  { id: "43-120", start: 43, end: 120 },
  { id: "44-47", start: 44, end: 47 },
  { id: "44-50", start: 44, end: 50 },
  { id: "44-101", start: 44, end: 101 },
  { id: "45-46", start: 45, end: 46 },
  { id: "45-47", start: 45, end: 47 },
  { id: "45-50", start: 45, end: 50 },
  { id: "45-122", start: 45, end: 122 },
  { id: "45-123", start: 45, end: 123 },
  { id: "46-56", start: 46, end: 56 },
  { id: "46-58", start: 46, end: 58 },
  { id: "46-122", start: 46, end: 122 },
  { id: "46-123", start: 46, end: 123 },
  { id: "47-50", start: 47, end: 50 },
  { id: "47-51", start: 47, end: 51 },
  { id: "47-54", start: 47, end: 54 },
  { id: "47-90", start: 47, end: 90 },
  { id: "47-122", start: 47, end: 122 },
  { id: "50-123", start: 50, end: 123 },
  { id: "51-54", start: 51, end: 54 },
  { id: "51-69", start: 51, end: 69 },
  { id: "51-82", start: 51, end: 82 },
  { id: "51-90", start: 51, end: 90 },
  { id: "52-55", start: 52, end: 55 },
  { id: "52-58", start: 52, end: 58 },
  { id: "52-75", start: 52, end: 75 },
  { id: "52-92", start: 52, end: 92 },
  { id: "52-96", start: 52, end: 96 },
  { id: "54-82", start: 54, end: 82 },
  { id: "54-122", start: 54, end: 122 },
  { id: "55-58", start: 55, end: 58 },
  { id: "55-92", start: 55, end: 92 },
  { id: "55-122", start: 55, end: 122 },
  { id: "56-57", start: 56, end: 57 },
  { id: "56-58", start: 56, end: 58 },
  { id: "56-123", start: 56, end: 123 },
  { id: "57-58", start: 57, end: 58 },
  { id: "57-86", start: 57, end: 86 },
  { id: "58-96", start: 58, end: 96 },
  { id: "58-122", start: 58, end: 122 },
  { id: "60-65", start: 60, end: 65 },
  { id: "60-93", start: 60, end: 93 },
  { id: "60-125", start: 60, end: 125 },
  { id: "60-127", start: 60, end: 127 },
  { id: "65-67", start: 65, end: 67 },
  { id: "65-93", start: 65, end: 93 },
  { id: "67-90", start: 67, end: 90 },
  { id: "67-93", start: 67, end: 93 },
  { id: "69-70", start: 69, end: 70 },
  { id: "69-82", start: 69, end: 82 },
  { id: "69-90", start: 69, end: 90 },
  { id: "69-93", start: 69, end: 93 },
  { id: "69-127", start: 69, end: 127 },
  { id: "70-81", start: 70, end: 81 },
  { id: "70-82", start: 70, end: 82 },
  { id: "70-89", start: 70, end: 89 },
  { id: "70-127", start: 70, end: 127 },
  { id: "73-75", start: 73, end: 75 },
  { id: "73-81", start: 73, end: 81 },
  { id: "73-91", start: 73, end: 91 },
  { id: "73-92", start: 73, end: 92 },
  { id: "73-128", start: 73, end: 128 },
  { id: "75-92", start: 75, end: 92 },
  { id: "75-96", start: 75, end: 96 },
  { id: "75-97", start: 75, end: 97 },
  { id: "75-128", start: 75, end: 128 },
  { id: "78-79", start: 78, end: 79 },
  { id: "78-97", start: 78, end: 97 },
  { id: "78-128", start: 78, end: 128 },
  { id: "78-129", start: 78, end: 129 },
  { id: "79-80", start: 79, end: 80 },
  { id: "79-97", start: 79, end: 97 },
  { id: "80-96", start: 80, end: 96 },
  { id: "80-97", start: 80, end: 97 },
  { id: "81-82", start: 81, end: 82 },
  { id: "81-89", start: 81, end: 89 },
  { id: "81-91", start: 81, end: 91 },
  { id: "81-92", start: 81, end: 92 },
  { id: "82-92", start: 82, end: 92 },
  { id: "82-122", start: 82, end: 122 },
  { id: "83-84", start: 83, end: 84 },
  { id: "83-85", start: 83, end: 85 },
  { id: "83-114", start: 83, end: 114 },
  { id: "84-85", start: 84, end: 85 },
  { id: "84-86", start: 84, end: 86 },
  { id: "84-88", start: 84, end: 88 },
  { id: "86-88", start: 86, end: 88 },
  { id: "86-120", start: 86, end: 120 },
  { id: "88-110", start: 88, end: 110 },
  { id: "88-119", start: 88, end: 119 },
  { id: "88-120", start: 88, end: 120 },
  { id: "89-91", start: 89, end: 91 },
  { id: "89-125", start: 89, end: 125 },
  { id: "89-126", start: 89, end: 126 },
  { id: "89-127", start: 89, end: 127 },
  { id: "90-93", start: 90, end: 93 },
  { id: "91-126", start: 91, end: 126 },
  { id: "91-128", start: 91, end: 128 },
  { id: "91-129", start: 91, end: 129 },
  { id: "92-122", start: 92, end: 122 },
  { id: "93-127", start: 93, end: 127 },
  { id: "96-97", start: 96, end: 97 },
  { id: "97-128", start: 97, end: 128 },
  { id: "98-99", start: 98, end: 99 },
  { id: "98-100", start: 98, end: 100 },
  { id: "99-100", start: 99, end: 100 },
  { id: "99-101", start: 99, end: 101 },
  { id: "99-102", start: 99, end: 102 },
  { id: "100-115", start: 100, end: 115 },
  { id: "101-102", start: 101, end: 102 },
  { id: "101-121", start: 101, end: 121 },
  { id: "102-111", start: 102, end: 111 },
  { id: "102-119", start: 102, end: 119 },
  { id: "102-121", start: 102, end: 121 },
  { id: "109-110", start: 109, end: 110 },
  { id: "109-111", start: 109, end: 111 },
  { id: "109-112", start: 109, end: 112 },
  { id: "109-113", start: 109, end: 113 },
  { id: "110-111", start: 110, end: 111 },
  { id: "110-119", start: 110, end: 119 },
  { id: "111-119", start: 111, end: 119 },
  { id: "112-113", start: 112, end: 113 },
  { id: "112-114", start: 112, end: 114 },
  { id: "112-116", start: 112, end: 116 },
  { id: "112-124", start: 112, end: 124 },
  { id: "113-115", start: 113, end: 115 },
  { id: "113-117", start: 113, end: 117 },
  { id: "113-124", start: 113, end: 124 },
  { id: "114-116", start: 114, end: 116 },
  { id: "115-117", start: 115, end: 117 },
  { id: "116-124", start: 116, end: 124 },
  { id: "117-124", start: 117, end: 124 },
  { id: "118-119", start: 118, end: 119 },
  { id: "119-120", start: 119, end: 120 },
  { id: "119-121", start: 119, end: 121 },
  { id: "125-126", start: 125, end: 126 },
  { id: "125-127", start: 125, end: 127 },
  { id: "126-129", start: 126, end: 129 },
  { id: "128-129", start: 128, end: 129 },
] as const satisfies readonly StructureEdge[]

export const STRUCTURE_VERTICES_METERS: readonly MeterVertex[] =
  STRUCTURE_VERTICES.map((vertex) => ({
    ...vertex,
    position: [
      vertex.microns[0] / MICRONS_PER_METER,
      vertex.microns[1] / MICRONS_PER_METER,
      vertex.microns[2] / MICRONS_PER_METER,
    ],
  }))

export const STRUCTURE_VERTEX_MAP = new Map<VertexId, MeterVertex>(
  STRUCTURE_VERTICES_METERS.map((vertex) => [vertex.id, vertex])
)

export const STRUCTURE_EDGES_RESOLVED: readonly ResolvedEdge[] =
  STRUCTURE_EDGES.map((edge) => {
    const startVertex = STRUCTURE_VERTEX_MAP.get(edge.start)
    const endVertex = STRUCTURE_VERTEX_MAP.get(edge.end)

    if (!startVertex || !endVertex) {
      throw new Error(`Edge ${edge.id} references a missing vertex`)
    }

    const start = new THREE.Vector3(...startVertex.position)
    const end = new THREE.Vector3(...endVertex.position)

    return {
      ...edge,
      startVertex,
      endVertex,
      lengthMeters: start.distanceTo(end),
    }
  })

export const STRUCTURE_BOUNDS = new THREE.Box3().setFromPoints(
  STRUCTURE_VERTICES_METERS.map((vertex) => new THREE.Vector3(...vertex.position))
)

export const STRUCTURE_CENTER = STRUCTURE_BOUNDS.getCenter(new THREE.Vector3())
export const STRUCTURE_SIZE = STRUCTURE_BOUNDS.getSize(new THREE.Vector3())

export function validateStructureData() {
  const errors: string[] = []
  const vertexIds = new Set<VertexId>()

  for (const vertex of STRUCTURE_VERTICES_METERS) {
    if (vertexIds.has(vertex.id)) {
      errors.push(`Duplicate vertex id: ${vertex.id}`)
    }

    vertexIds.add(vertex.id)

    if (vertex.position.some((value) => !Number.isFinite(value))) {
      errors.push(`Vertex ${vertex.id} has a non-finite meter coordinate`)
    }
  }

  for (const edge of STRUCTURE_EDGES) {
    if (!vertexIds.has(edge.start) || !vertexIds.has(edge.end)) {
      errors.push(`Edge ${edge.id} references missing vertices ${edge.start}-${edge.end}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    vertexCount: STRUCTURE_VERTICES.length,
    edgeCount: STRUCTURE_EDGES.length,
    extentsMeters: {
      x: STRUCTURE_SIZE.x,
      y: STRUCTURE_SIZE.y,
      z: STRUCTURE_SIZE.z,
    },
  }
}
