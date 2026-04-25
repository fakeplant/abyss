import * as THREE from "three"

export type VertexId = number

export interface StructureVertex {
  id: VertexId
  microns: readonly [number, number, number]
}

export interface StructureEdge {
  id: string
  vertices: readonly [VertexId, VertexId]
}

export interface MeterVertex extends StructureVertex {
  position: readonly [number, number, number]
}

export interface ResolvedEdge extends StructureEdge {
  verticesMeters: readonly [MeterVertex, MeterVertex]
  lengthMeters: number
}

export interface StructurePanel {
  id: string
  vertices: readonly [VertexId, VertexId, VertexId]
}

export type DmxFixtureType = "single-color-can"
export type DmxFixtureMountKind = "edge" | "free"
export type DmxFixturePlacement = "outside" | "inside"
export type DmxFixtureAim = "inward" | "outward"

export interface DmxFixtureRotation {
  xDeg: number
  yDeg: number
}

interface DmxFixtureBaseConfig {
  id: string
  type: DmxFixtureType
  rotation: DmxFixtureRotation
  color: string
}

interface EdgeMountedDmxFixtureConfig extends DmxFixtureBaseConfig {
  mount: "edge"
  mountEdgeId: string
  placement: DmxFixturePlacement
  aim: DmxFixtureAim
}

interface FreeDmxFixtureConfig extends DmxFixtureBaseConfig {
  mount: "free"
  position: readonly [number, number, number]
  baseTarget: readonly [number, number, number]
}

type DmxFixtureConfig = EdgeMountedDmxFixtureConfig | FreeDmxFixtureConfig

export interface DmxFixture extends DmxFixtureBaseConfig {
  mount: DmxFixtureMountKind
  mountEdgeId?: string
  placement?: DmxFixturePlacement
  aim?: DmxFixtureAim
  position: readonly [number, number, number]
  baseTarget: readonly [number, number, number]
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
  { id: "9-12", vertices: [9, 12] },
  { id: "9-83", vertices: [9, 83] },
  { id: "9-114", vertices: [9, 114] },
  { id: "9-116", vertices: [9, 116] },
  { id: "10-11", vertices: [10, 11] },
  { id: "10-100", vertices: [10, 100] },
  { id: "10-115", vertices: [10, 115] },
  { id: "10-117", vertices: [10, 117] },
  { id: "11-98", vertices: [11, 98] },
  { id: "11-100", vertices: [11, 100] },
  { id: "12-83", vertices: [12, 83] },
  { id: "12-85", vertices: [12, 85] },
  { id: "25-27", vertices: [25, 27] },
  { id: "25-83", vertices: [25, 83] },
  { id: "25-84", vertices: [25, 84] },
  { id: "25-88", vertices: [25, 88] },
  { id: "25-110", vertices: [25, 110] },
  { id: "25-114", vertices: [25, 114] },
  { id: "26-28", vertices: [26, 28] },
  { id: "26-99", vertices: [26, 99] },
  { id: "26-100", vertices: [26, 100] },
  { id: "26-102", vertices: [26, 102] },
  { id: "26-111", vertices: [26, 111] },
  { id: "26-115", vertices: [26, 115] },
  { id: "27-109", vertices: [27, 109] },
  { id: "27-110", vertices: [27, 110] },
  { id: "27-112", vertices: [27, 112] },
  { id: "27-114", vertices: [27, 114] },
  { id: "28-109", vertices: [28, 109] },
  { id: "28-111", vertices: [28, 111] },
  { id: "28-113", vertices: [28, 113] },
  { id: "28-115", vertices: [28, 115] },
  { id: "30-31", vertices: [30, 31] },
  { id: "30-33", vertices: [30, 33] },
  { id: "30-38", vertices: [30, 38] },
  { id: "30-42", vertices: [30, 42] },
  { id: "30-118", vertices: [30, 118] },
  { id: "31-33", vertices: [31, 33] },
  { id: "31-39", vertices: [31, 39] },
  { id: "31-118", vertices: [31, 118] },
  { id: "31-119", vertices: [31, 119] },
  { id: "31-121", vertices: [31, 121] },
  { id: "33-37", vertices: [33, 37] },
  { id: "33-38", vertices: [33, 38] },
  { id: "33-39", vertices: [33, 39] },
  { id: "36-37", vertices: [36, 37] },
  { id: "36-38", vertices: [36, 38] },
  { id: "36-43", vertices: [36, 43] },
  { id: "36-56", vertices: [36, 56] },
  { id: "36-57", vertices: [36, 57] },
  { id: "36-123", vertices: [36, 123] },
  { id: "37-39", vertices: [37, 39] },
  { id: "37-44", vertices: [37, 44] },
  { id: "37-50", vertices: [37, 50] },
  { id: "37-123", vertices: [37, 123] },
  { id: "38-42", vertices: [38, 42] },
  { id: "38-43", vertices: [38, 43] },
  { id: "39-44", vertices: [39, 44] },
  { id: "39-101", vertices: [39, 101] },
  { id: "39-121", vertices: [39, 121] },
  { id: "42-43", vertices: [42, 43] },
  { id: "42-118", vertices: [42, 118] },
  { id: "42-119", vertices: [42, 119] },
  { id: "42-120", vertices: [42, 120] },
  { id: "43-57", vertices: [43, 57] },
  { id: "43-86", vertices: [43, 86] },
  { id: "43-120", vertices: [43, 120] },
  { id: "44-47", vertices: [44, 47] },
  { id: "44-50", vertices: [44, 50] },
  { id: "44-101", vertices: [44, 101] },
  { id: "45-46", vertices: [45, 46] },
  { id: "45-47", vertices: [45, 47] },
  { id: "45-50", vertices: [45, 50] },
  { id: "45-122", vertices: [45, 122] },
  { id: "45-123", vertices: [45, 123] },
  { id: "46-56", vertices: [46, 56] },
  { id: "46-58", vertices: [46, 58] },
  { id: "46-122", vertices: [46, 122] },
  { id: "46-123", vertices: [46, 123] },
  { id: "47-50", vertices: [47, 50] },
  { id: "47-51", vertices: [47, 51] },
  { id: "47-54", vertices: [47, 54] },
  { id: "47-90", vertices: [47, 90] },
  { id: "47-122", vertices: [47, 122] },
  { id: "50-123", vertices: [50, 123] },
  { id: "51-54", vertices: [51, 54] },
  { id: "51-69", vertices: [51, 69] },
  { id: "51-82", vertices: [51, 82] },
  { id: "51-90", vertices: [51, 90] },
  { id: "52-55", vertices: [52, 55] },
  { id: "52-58", vertices: [52, 58] },
  { id: "52-75", vertices: [52, 75] },
  { id: "52-92", vertices: [52, 92] },
  { id: "52-96", vertices: [52, 96] },
  { id: "54-82", vertices: [54, 82] },
  { id: "54-122", vertices: [54, 122] },
  { id: "55-58", vertices: [55, 58] },
  { id: "55-92", vertices: [55, 92] },
  { id: "55-122", vertices: [55, 122] },
  { id: "56-57", vertices: [56, 57] },
  { id: "56-58", vertices: [56, 58] },
  { id: "56-123", vertices: [56, 123] },
  { id: "57-58", vertices: [57, 58] },
  { id: "57-86", vertices: [57, 86] },
  { id: "58-96", vertices: [58, 96] },
  { id: "58-122", vertices: [58, 122] },
  { id: "60-65", vertices: [60, 65] },
  { id: "60-93", vertices: [60, 93] },
  { id: "60-125", vertices: [60, 125] },
  { id: "60-127", vertices: [60, 127] },
  { id: "65-67", vertices: [65, 67] },
  { id: "65-93", vertices: [65, 93] },
  { id: "67-90", vertices: [67, 90] },
  { id: "67-93", vertices: [67, 93] },
  { id: "69-70", vertices: [69, 70] },
  { id: "69-82", vertices: [69, 82] },
  { id: "69-90", vertices: [69, 90] },
  { id: "69-93", vertices: [69, 93] },
  { id: "69-127", vertices: [69, 127] },
  { id: "70-81", vertices: [70, 81] },
  { id: "70-82", vertices: [70, 82] },
  { id: "70-89", vertices: [70, 89] },
  { id: "70-127", vertices: [70, 127] },
  { id: "73-75", vertices: [73, 75] },
  { id: "73-81", vertices: [73, 81] },
  { id: "73-91", vertices: [73, 91] },
  { id: "73-92", vertices: [73, 92] },
  { id: "73-128", vertices: [73, 128] },
  { id: "75-92", vertices: [75, 92] },
  { id: "75-96", vertices: [75, 96] },
  { id: "75-97", vertices: [75, 97] },
  { id: "75-128", vertices: [75, 128] },
  { id: "78-79", vertices: [78, 79] },
  { id: "78-97", vertices: [78, 97] },
  { id: "78-128", vertices: [78, 128] },
  { id: "78-129", vertices: [78, 129] },
  { id: "79-80", vertices: [79, 80] },
  { id: "79-97", vertices: [79, 97] },
  { id: "80-96", vertices: [80, 96] },
  { id: "80-97", vertices: [80, 97] },
  { id: "81-82", vertices: [81, 82] },
  { id: "81-89", vertices: [81, 89] },
  { id: "81-91", vertices: [81, 91] },
  { id: "81-92", vertices: [81, 92] },
  { id: "82-92", vertices: [82, 92] },
  { id: "82-122", vertices: [82, 122] },
  { id: "83-84", vertices: [83, 84] },
  { id: "83-85", vertices: [83, 85] },
  { id: "83-114", vertices: [83, 114] },
  { id: "84-85", vertices: [84, 85] },
  { id: "84-86", vertices: [84, 86] },
  { id: "84-88", vertices: [84, 88] },
  { id: "86-88", vertices: [86, 88] },
  { id: "86-120", vertices: [86, 120] },
  { id: "88-110", vertices: [88, 110] },
  { id: "88-119", vertices: [88, 119] },
  { id: "88-120", vertices: [88, 120] },
  { id: "89-91", vertices: [89, 91] },
  { id: "89-125", vertices: [89, 125] },
  { id: "89-126", vertices: [89, 126] },
  { id: "89-127", vertices: [89, 127] },
  { id: "90-93", vertices: [90, 93] },
  { id: "91-126", vertices: [91, 126] },
  { id: "91-128", vertices: [91, 128] },
  { id: "91-129", vertices: [91, 129] },
  { id: "92-122", vertices: [92, 122] },
  { id: "93-127", vertices: [93, 127] },
  { id: "96-97", vertices: [96, 97] },
  { id: "97-128", vertices: [97, 128] },
  { id: "98-99", vertices: [98, 99] },
  { id: "98-100", vertices: [98, 100] },
  { id: "99-100", vertices: [99, 100] },
  { id: "99-101", vertices: [99, 101] },
  { id: "99-102", vertices: [99, 102] },
  { id: "100-115", vertices: [100, 115] },
  { id: "101-102", vertices: [101, 102] },
  { id: "101-121", vertices: [101, 121] },
  { id: "102-111", vertices: [102, 111] },
  { id: "102-119", vertices: [102, 119] },
  { id: "102-121", vertices: [102, 121] },
  { id: "109-110", vertices: [109, 110] },
  { id: "109-111", vertices: [109, 111] },
  { id: "109-112", vertices: [109, 112] },
  { id: "109-113", vertices: [109, 113] },
  { id: "110-111", vertices: [110, 111] },
  { id: "110-119", vertices: [110, 119] },
  { id: "111-119", vertices: [111, 119] },
  { id: "112-113", vertices: [112, 113] },
  { id: "112-114", vertices: [112, 114] },
  { id: "112-116", vertices: [112, 116] },
  { id: "112-124", vertices: [112, 124] },
  { id: "113-115", vertices: [113, 115] },
  { id: "113-117", vertices: [113, 117] },
  { id: "113-124", vertices: [113, 124] },
  { id: "114-116", vertices: [114, 116] },
  { id: "115-117", vertices: [115, 117] },
  { id: "116-124", vertices: [116, 124] },
  { id: "117-124", vertices: [117, 124] },
  { id: "118-119", vertices: [118, 119] },
  { id: "119-120", vertices: [119, 120] },
  { id: "119-121", vertices: [119, 121] },
  { id: "125-126", vertices: [125, 126] },
  { id: "125-127", vertices: [125, 127] },
  { id: "126-129", vertices: [126, 129] },
  { id: "128-129", vertices: [128, 129] },
] as const satisfies readonly StructureEdge[]

export const STRUCTURE_PANELS = [
  { id: "9-12-83", vertices: [9, 12, 83] },
  { id: "9-83-114", vertices: [9, 83, 114] },
  { id: "9-114-116", vertices: [9, 114, 116] },
  { id: "10-11-100", vertices: [10, 11, 100] },
  { id: "10-100-115", vertices: [10, 100, 115] },
  { id: "10-115-117", vertices: [10, 115, 117] },
  { id: "11-98-100", vertices: [11, 98, 100] },
  { id: "12-83-85", vertices: [12, 83, 85] },
  { id: "25-27-110", vertices: [25, 27, 110] },
  { id: "25-27-114", vertices: [25, 27, 114] },
  { id: "25-83-84", vertices: [25, 83, 84] },
  { id: "25-83-114", vertices: [25, 83, 114] },
  { id: "25-84-88", vertices: [25, 84, 88] },
  { id: "25-88-110", vertices: [25, 88, 110] },
  { id: "26-28-111", vertices: [26, 28, 111] },
  { id: "26-28-115", vertices: [26, 28, 115] },
  { id: "26-99-100", vertices: [26, 99, 100] },
  { id: "26-99-102", vertices: [26, 99, 102] },
  { id: "26-100-115", vertices: [26, 100, 115] },
  { id: "26-102-111", vertices: [26, 102, 111] },
  { id: "27-109-110", vertices: [27, 109, 110] },
  { id: "27-109-112", vertices: [27, 109, 112] },
  { id: "27-112-114", vertices: [27, 112, 114] },
  { id: "28-109-111", vertices: [28, 109, 111] },
  { id: "28-109-113", vertices: [28, 109, 113] },
  { id: "28-113-115", vertices: [28, 113, 115] },
  { id: "44-47-50", vertices: [44, 47, 50] },
  { id: "47-51-54", vertices: [47, 51, 54] },
  { id: "47-51-90", vertices: [47, 51, 90] },
  { id: "51-54-82", vertices: [51, 54, 82] },
  { id: "51-69-82", vertices: [51, 69, 82] },
  { id: "51-69-90", vertices: [51, 69, 90] },
  { id: "52-55-58", vertices: [52, 55, 58] },
  { id: "52-55-92", vertices: [52, 55, 92] },
  { id: "52-58-96", vertices: [52, 58, 96] },
  { id: "52-75-92", vertices: [52, 75, 92] },
  { id: "52-75-96", vertices: [52, 75, 96] },
  { id: "56-57-58", vertices: [56, 57, 58] },
  { id: "60-65-93", vertices: [60, 65, 93] },
  { id: "60-93-127", vertices: [60, 93, 127] },
  { id: "60-125-127", vertices: [60, 125, 127] },
  { id: "65-67-93", vertices: [65, 67, 93] },
  { id: "67-90-93", vertices: [67, 90, 93] },
  { id: "69-70-82", vertices: [69, 70, 82] },
  { id: "69-70-127", vertices: [69, 70, 127] },
  { id: "69-90-93", vertices: [69, 90, 93] },
  { id: "69-93-127", vertices: [69, 93, 127] },
  { id: "70-81-82", vertices: [70, 81, 82] },
  { id: "70-81-89", vertices: [70, 81, 89] },
  { id: "70-89-127", vertices: [70, 89, 127] },
  { id: "73-75-92", vertices: [73, 75, 92] },
  { id: "73-75-128", vertices: [73, 75, 128] },
  { id: "73-81-91", vertices: [73, 81, 91] },
  { id: "73-81-92", vertices: [73, 81, 92] },
  { id: "73-91-128", vertices: [73, 91, 128] },
  { id: "75-96-97", vertices: [75, 96, 97] },
  { id: "75-97-128", vertices: [75, 97, 128] },
  { id: "78-79-97", vertices: [78, 79, 97] },
  { id: "78-97-128", vertices: [78, 97, 128] },
  { id: "78-128-129", vertices: [78, 128, 129] },
  { id: "79-80-97", vertices: [79, 80, 97] },
  { id: "80-96-97", vertices: [80, 96, 97] },
  { id: "81-82-92", vertices: [81, 82, 92] },
  { id: "81-89-91", vertices: [81, 89, 91] },
  { id: "84-86-88", vertices: [84, 86, 88] },
  { id: "83-84-85", vertices: [83, 84, 85] },
  { id: "86-88-120", vertices: [86, 88, 120] },
  { id: "88-110-119", vertices: [88, 110, 119] },
  { id: "89-91-126", vertices: [89, 91, 126] },
  { id: "89-125-126", vertices: [89, 125, 126] },
  { id: "89-125-127", vertices: [89, 125, 127] },
  { id: "91-126-129", vertices: [91, 126, 129] },
  { id: "91-128-129", vertices: [91, 128, 129] },
  { id: "98-99-100", vertices: [98, 99, 100] },
  { id: "99-101-102", vertices: [99, 101, 102] },
  { id: "101-102-121", vertices: [101, 102, 121] },
  { id: "102-111-119", vertices: [102, 111, 119] },
  { id: "109-110-111", vertices: [109, 110, 111] },
  { id: "109-112-113", vertices: [109, 112, 113] },
  { id: "110-111-119", vertices: [110, 111, 119] },
  { id: "112-113-124", vertices: [112, 113, 124] },
  { id: "112-114-116", vertices: [112, 114, 116] },
  { id: "112-116-124", vertices: [112, 116, 124] },
  { id: "113-115-117", vertices: [113, 115, 117] },
  { id: "113-117-124", vertices: [113, 117, 124] },
] as const satisfies readonly StructurePanel[]

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
    const verticesMeters = edge.vertices.map((vertexId) =>
      STRUCTURE_VERTEX_MAP.get(vertexId)
    ) as [MeterVertex | undefined, MeterVertex | undefined]

    if (!verticesMeters[0] || !verticesMeters[1]) {
      throw new Error(`Edge ${edge.id} references a missing vertex`)
    }

    const start = new THREE.Vector3(...verticesMeters[0].position)
    const end = new THREE.Vector3(...verticesMeters[1].position)

    return {
      ...edge,
      verticesMeters: verticesMeters as [MeterVertex, MeterVertex],
      lengthMeters: start.distanceTo(end),
    }
  })

export const STRUCTURE_BOUNDS = new THREE.Box3().setFromPoints(
  STRUCTURE_VERTICES_METERS.map(
    (vertex) => new THREE.Vector3(...vertex.position)
  )
)

export const STRUCTURE_CENTER = STRUCTURE_BOUNDS.getCenter(new THREE.Vector3())
export const STRUCTURE_SIZE = STRUCTURE_BOUNDS.getSize(new THREE.Vector3())

function edgeKey(start: VertexId, end: VertexId) {
  return [start, end].sort((a, b) => a - b).join("-")
}

export const STRUCTURE_EDGE_KEYS = new Set(
  STRUCTURE_EDGES.map((edge) => edgeKey(edge.vertices[0], edge.vertices[1]))
)

const STRUCTURE_EDGE_MAP = new Map(
  STRUCTURE_EDGES_RESOLVED.map((edge) => [edge.id, edge])
)

const DMX_FIXTURE_MOUNT_OFFSET_METERS = 0.18
const DMX_FIXTURE_UP_OFFSET_METERS = 0.12

const DMX_FIXTURE_MOUNTS = [
  {
    id: "dmx-can-01",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "47-50",
    placement: "outside",
    aim: "inward",
    rotation: { xDeg: -8, yDeg: -18 },
    color: "#ffdca8",
  },
  {
    id: "dmx-can-02",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "56-58",
    placement: "outside",
    aim: "inward",
    rotation: { xDeg: -10, yDeg: 18 },
    color: "#ffdca8",
  },
  {
    id: "dmx-can-03",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "69-82",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: 6, yDeg: 12 },
    color: "#c7e7ff",
  },
  {
    id: "dmx-can-04",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "73-92",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: 6, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "dmx-can-05",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "83-114",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: -15, yDeg: -8 },
    color: "#fff1c9",
  },
  {
    id: "dmx-can-06",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "88-110",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: -18, yDeg: 10 },
    color: "#fff1c9",
  },
  {
    id: "dmx-can-07",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "91-128",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: 10, yDeg: -22 },
    color: "#ffd2f0",
  },
  {
    id: "dmx-can-08",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "112-124",
    placement: "outside",
    aim: "outward",
    rotation: { xDeg: -12, yDeg: 22 },
    color: "#ffd2f0",
  },
  {
    id: "dmx-can-inside-01",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "45-46",
    placement: "inside",
    aim: "outward",
    rotation: { xDeg: -6, yDeg: -8 },
    color: "#fff6d8",
  },
  {
    id: "dmx-can-inside-02",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "82-92",
    placement: "inside",
    aim: "outward",
    rotation: { xDeg: -4, yDeg: 10 },
    color: "#fff6d8",
  },
  {
    id: "dmx-can-inside-03",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "110-111",
    placement: "inside",
    aim: "outward",
    rotation: { xDeg: -8, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "dmx-can-inside-04",
    type: "single-color-can",
    mount: "edge",
    mountEdgeId: "36-37",
    placement: "inside",
    aim: "outward",
    rotation: { xDeg: 8, yDeg: 16 },
    color: "#ffd2f0",
  },
  {
    id: "dmx-can-free-01",
    type: "single-color-can",
    mount: "free",
    position: [0, 5.35, -1.2],
    baseTarget: [0, 7.6, 2.4],
    rotation: { xDeg: -8, yDeg: 0 },
    color: "#fff6d8",
  },
  {
    id: "dmx-can-free-02",
    type: "single-color-can",
    mount: "free",
    position: [-0.72, 5.7, 1.2],
    baseTarget: [-1.8, 8.4, 4.2],
    rotation: { xDeg: -10, yDeg: -12 },
    color: "#c7e7ff",
  },
  {
    id: "dmx-can-free-03",
    type: "single-color-can",
    mount: "free",
    position: [0.72, 5.7, 1.2],
    baseTarget: [1.8, 8.4, 4.2],
    rotation: { xDeg: -10, yDeg: 12 },
    color: "#c7e7ff",
  },
  {
    id: "dmx-can-free-04",
    type: "single-color-can",
    mount: "free",
    position: [0, 4.8, -4.2],
    baseTarget: [0, 6.9, -7.2],
    rotation: { xDeg: 6, yDeg: 0 },
    color: "#ffd2f0",
  },
] as const satisfies readonly DmxFixtureConfig[]

function resolveDmxFixture(config: DmxFixtureConfig): DmxFixture {
  if (config.mount === "free") {
    return config
  }

  const mountEdge = STRUCTURE_EDGE_MAP.get(config.mountEdgeId)

  if (!mountEdge) {
    throw new Error(`DMX fixture ${config.id} references a missing edge`)
  }

  const start = new THREE.Vector3(...mountEdge.verticesMeters[0].position)
  const end = new THREE.Vector3(...mountEdge.verticesMeters[1].position)
  const midpoint = start.add(end).multiplyScalar(0.5)
  const outward = midpoint.clone().sub(STRUCTURE_CENTER)

  if (outward.lengthSq() < 1e-8) {
    outward.set(1, 0, 0)
  }

  const outwardDirection = outward.normalize()
  const position = midpoint
    .clone()
    .add(
      outwardDirection
        .clone()
        .multiplyScalar(
          config.placement === "inside"
            ? -DMX_FIXTURE_MOUNT_OFFSET_METERS
            : DMX_FIXTURE_MOUNT_OFFSET_METERS
        )
    )
    .add(new THREE.Vector3(0, DMX_FIXTURE_UP_OFFSET_METERS, 0))
  const baseTarget =
    config.aim === "outward"
      ? position.clone().add(outwardDirection.clone().multiplyScalar(6))
      : STRUCTURE_CENTER.clone()

  return {
    ...config,
    position: position.toArray(),
    baseTarget: baseTarget.toArray(),
  }
}

export const DMX_FIXTURES = DMX_FIXTURE_MOUNTS.map(resolveDmxFixture)

function getPanelEdgeIds(panel: StructurePanel) {
  return [
    edgeKey(panel.vertices[0], panel.vertices[1]),
    edgeKey(panel.vertices[0], panel.vertices[2]),
    edgeKey(panel.vertices[1], panel.vertices[2]),
  ] as const
}

export function getPanelPositions(panel: StructurePanel) {
  return panel.vertices.map((vertexId) => {
    const vertex = STRUCTURE_VERTEX_MAP.get(vertexId)

    if (!vertex) {
      throw new Error(`Panel ${panel.id} references missing vertex ${vertexId}`)
    }

    return new THREE.Vector3(...vertex.position)
  }) as [THREE.Vector3, THREE.Vector3, THREE.Vector3]
}

function triangleArea(
  points: readonly [THREE.Vector3, THREE.Vector3, THREE.Vector3]
) {
  return (
    points[1]
      .clone()
      .sub(points[0])
      .cross(points[2].clone().sub(points[0]))
      .length() / 2
  )
}

export function getPanelInsetPositions(
  panel: StructurePanel,
  gapMeters: number
) {
  const sourcePoints = getPanelPositions(panel)
  const area = triangleArea(sourcePoints)

  if (area <= 0) {
    return null
  }

  const edgeA = sourcePoints[1].clone().sub(sourcePoints[0])
  const edgeB = sourcePoints[2].clone().sub(sourcePoints[0])
  const xAxis = edgeA.clone().normalize()
  const normal = edgeA.clone().cross(edgeB).normalize()
  const yAxis = normal.clone().cross(xAxis).normalize()

  const localPoints = sourcePoints.map((point) => {
    const relative = point.clone().sub(sourcePoints[0])

    return new THREE.Vector2(relative.dot(xAxis), relative.dot(yAxis))
  }) as [THREE.Vector2, THREE.Vector2, THREE.Vector2]

  const sideLengths = [
    localPoints[0].distanceTo(localPoints[1]),
    localPoints[1].distanceTo(localPoints[2]),
    localPoints[2].distanceTo(localPoints[0]),
  ] as const
  const semiPerimeter = (sideLengths[0] + sideLengths[1] + sideLengths[2]) / 2
  const inradius = area / semiPerimeter
  const safeGap = Math.max(0, Math.min(gapMeters, inradius * 0.9))

  if (safeGap === 0) {
    return sourcePoints
  }

  const offsetLines = localPoints.map((start, index) => {
    const end = localPoints[(index + 1) % localPoints.length]
    const direction = end.clone().sub(start).normalize()
    const inwardNormal = new THREE.Vector2(-direction.y, direction.x)

    return {
      point: start.clone().add(inwardNormal.multiplyScalar(safeGap)),
      direction,
    }
  })

  const intersectLines = (
    lineA: (typeof offsetLines)[number],
    lineB: (typeof offsetLines)[number]
  ) => {
    const delta = lineB.point.clone().sub(lineA.point)
    const cross =
      lineA.direction.x * lineB.direction.y -
      lineA.direction.y * lineB.direction.x

    if (Math.abs(cross) < 1e-8) {
      return null
    }

    const t =
      (delta.x * lineB.direction.y - delta.y * lineB.direction.x) / cross

    return lineA.point.clone().add(lineA.direction.clone().multiplyScalar(t))
  }

  const insetLocal = [
    intersectLines(offsetLines[2], offsetLines[0]),
    intersectLines(offsetLines[0], offsetLines[1]),
    intersectLines(offsetLines[1], offsetLines[2]),
  ] as const

  if (insetLocal.some((point) => !point)) {
    return null
  }

  return insetLocal.map((point) =>
    sourcePoints[0]
      .clone()
      .add(xAxis.clone().multiplyScalar(point!.x))
      .add(yAxis.clone().multiplyScalar(point!.y))
  ) as [THREE.Vector3, THREE.Vector3, THREE.Vector3]
}

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
    if (!vertexIds.has(edge.vertices[0]) || !vertexIds.has(edge.vertices[1])) {
      errors.push(
        `Edge ${edge.id} references missing vertices ${edge.vertices.join("-")}`
      )
    }

    if (edge.id !== edge.vertices.join("-")) {
      errors.push(`Edge ${edge.id} does not match its vertex config`)
    }
  }

  for (const panel of STRUCTURE_PANELS) {
    for (const vertexId of panel.vertices) {
      if (!vertexIds.has(vertexId)) {
        errors.push(`Panel ${panel.id} references missing vertex ${vertexId}`)
      }
    }

    if (panel.id !== panel.vertices.join("-")) {
      errors.push(`Panel ${panel.id} does not match its vertex config`)
    }

    for (const edgeId of getPanelEdgeIds(panel)) {
      if (!STRUCTURE_EDGE_KEYS.has(edgeId)) {
        errors.push(`Panel ${panel.id} references missing edge ${edgeId}`)
      }
    }

    const insetPoints = getPanelInsetPositions(panel, 0.04)

    if (
      !insetPoints ||
      insetPoints.some((point) => !Number.isFinite(point.x + point.y + point.z))
    ) {
      errors.push(`Panel ${panel.id} has invalid inset geometry`)
    }
  }

  if (STRUCTURE_PANELS.length !== 85) {
    errors.push(
      `Expected 85 lower-half panels, found ${STRUCTURE_PANELS.length}`
    )
  }

  for (const fixture of DMX_FIXTURES) {
    if (
      fixture.mount === "edge" &&
      fixture.mountEdgeId &&
      !STRUCTURE_EDGE_KEYS.has(fixture.mountEdgeId)
    ) {
      errors.push(
        `DMX fixture ${fixture.id} references missing edge ${fixture.mountEdgeId}`
      )
    }

    if (fixture.mount === "edge" && !fixture.mountEdgeId) {
      errors.push(`DMX fixture ${fixture.id} is missing a mount edge`)
    }

    if (
      fixture.position.some((value) => !Number.isFinite(value)) ||
      fixture.baseTarget.some((value) => !Number.isFinite(value))
    ) {
      errors.push(`DMX fixture ${fixture.id} has invalid derived coordinates`)
    }
  }

  if (DMX_FIXTURES.length !== 16) {
    errors.push(`Expected 16 DMX fixtures, found ${DMX_FIXTURES.length}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    vertexCount: STRUCTURE_VERTICES.length,
    edgeCount: STRUCTURE_EDGES.length,
    panelCount: STRUCTURE_PANELS.length,
    dmxFixtureCount: DMX_FIXTURES.length,
    extentsMeters: {
      x: STRUCTURE_SIZE.x,
      y: STRUCTURE_SIZE.y,
      z: STRUCTURE_SIZE.z,
    },
  }
}
