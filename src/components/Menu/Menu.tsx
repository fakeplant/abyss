import {
  Box,
  ColorInput,
  Group,
  NumberInput,
  Slider,
  Stack,
  Switch,
  Text,
} from "@mantine/core"
import {
  IconCircleLetterI,
  IconDimensions,
  IconEye,
} from "@tabler/icons-react"
import {
  STRUCTURE_EDGES,
  STRUCTURE_SIZE,
  STRUCTURE_VERTICES,
  validateStructureData,
} from "../../data/carStructure"
import { useAbyssStore } from "../../hooks/useAbyssStore"
import classes from "./Menu.module.css"

function Menu() {
  const {
    showLabels,
    tubeDiameterMeters,
    tubeColor,
    tubeOpacity,
    setShowLabels,
    setTubeDiameterMeters,
    setTubeColor,
    setTubeOpacity,
  } = useAbyssStore()

  const validation = validateStructureData()

  return (
    <aside className={classes.wrapper}>
      <Stack
        gap="lg"
        p="md"
      >
        <Box>
          <Text
            size="xs"
            c="dimmed"
            tt="uppercase"
            fw={700}
          >
            Structure
          </Text>
          <Text
            size="sm"
            mt={4}
          >
            {STRUCTURE_VERTICES.length} vertices · {STRUCTURE_EDGES.length}{" "}
            edges
          </Text>
        </Box>

        <Box>
          <Group
            gap="xs"
            mb="xs"
          >
            <IconEye size={16} />
            <Text
              size="sm"
              fw={600}
            >
              View
            </Text>
          </Group>
          <Switch
            label="Vertex labels"
            checked={showLabels}
            onChange={(event) => setShowLabels(event.currentTarget.checked)}
            size="sm"
          />
        </Box>

        <Box>
          <Group
            gap="xs"
            mb="xs"
          >
            <IconDimensions size={16} />
            <Text
              size="sm"
              fw={600}
            >
              Tube
            </Text>
          </Group>
          <Stack gap="sm">
            <NumberInput
              label="Diameter"
              suffix=" m"
              min={0.005}
              max={0.3}
              step={0.001}
              decimalScale={4}
              value={tubeDiameterMeters}
              onChange={(value) =>
                setTubeDiameterMeters(
                  typeof value === "number" ? value : 0.0508
                )
              }
              size="xs"
            />
            <ColorInput
              label="Color"
              value={tubeColor}
              onChange={setTubeColor}
              swatches={["#050505", "#1f2937", "#2563eb", "#dc2626"]}
              size="xs"
            />
            <Box>
              <Text
                size="xs"
                fw={500}
                mb={6}
              >
                Opacity
              </Text>
              <Slider
                min={0.1}
                max={1}
                step={0.05}
                value={tubeOpacity}
                onChange={setTubeOpacity}
                size="sm"
              />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Group
            gap="xs"
            mb="xs"
          >
            <IconCircleLetterI size={16} />
            <Text
              size="sm"
              fw={600}
            >
              Scale
            </Text>
          </Group>
          <Stack gap={4}>
            <Text size="xs">X: {STRUCTURE_SIZE.x.toFixed(2)} m</Text>
            <Text size="xs">Y: {STRUCTURE_SIZE.y.toFixed(2)} m</Text>
            <Text size="xs">Z: {STRUCTURE_SIZE.z.toFixed(2)} m</Text>
            <Text
              size="xs"
              c={validation.valid ? "dimmed" : "red"}
              mt="xs"
            >
              {validation.valid
                ? "Data integrity checks pass."
                : validation.errors.join(", ")}
            </Text>
          </Stack>
        </Box>
      </Stack>
    </aside>
  )
}

export default Menu
