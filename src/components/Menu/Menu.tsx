import {
  Box,
  ColorInput,
  Group,
  NumberInput,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
} from "@mantine/core"
import {
  IconBulb,
  IconCircleLetterI,
  IconDimensions,
  IconEye,
  IconTriangle,
} from "@tabler/icons-react"
import {
  DMX_FIXTURES,
  STRUCTURE_EDGES,
  STRUCTURE_PANELS,
  STRUCTURE_SIZE,
  STRUCTURE_VERTICES,
  validateStructureData,
} from "../../data/carStructure"
import { DmxRenderMode, useAbyssStore } from "../../hooks/useAbyssStore"
import classes from "./Menu.module.css"

function Menu() {
  const {
    showLabels,
    tubeDiameterMeters,
    tubeColor,
    tubeOpacity,
    showPanels,
    panelColor,
    panelGapMeters,
    showDmxFixtures,
    dmxRenderMode,
    dmxColor,
    dmxRealIntensity,
    dmxFakeIntensity,
    dmxBeamAngleDeg,
    dmxCastShadows,
    setShowLabels,
    setTubeDiameterMeters,
    setTubeColor,
    setTubeOpacity,
    setShowPanels,
    setPanelColor,
    setPanelGapMeters,
    setShowDmxFixtures,
    setDmxRenderMode,
    setDmxColor,
    setDmxRealIntensity,
    setDmxFakeIntensity,
    setDmxBeamAngleDeg,
    setDmxCastShadows,
  } = useAbyssStore()

  const validation = validateStructureData()

  return (
    <aside className={classes.wrapper}>
      <Stack
        gap="lg"
        p="md"
        mt="60px"
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
            <IconBulb size={16} />
            <Text
              size="sm"
              fw={600}
            >
              DMX Fixtures
            </Text>
          </Group>
          <Stack gap="sm">
            <Switch
              label={`${DMX_FIXTURES.length} single-color cans`}
              checked={showDmxFixtures}
              onChange={(event) =>
                setShowDmxFixtures(event.currentTarget.checked)
              }
              size="sm"
            />
            <SegmentedControl
              value={dmxRenderMode}
              onChange={(value) => setDmxRenderMode(value as DmxRenderMode)}
              data={[
                { label: "Real", value: "real" },
                { label: "Fake", value: "fake" },
              ]}
              size="xs"
              fullWidth
            />
            <ColorInput
              label="Light color"
              value={dmxColor}
              onChange={setDmxColor}
              swatches={["#ffdca8", "#c7e7ff", "#ffd2f0", "#ffffff"]}
              size="xs"
            />
            <NumberInput
              label="Real intensity"
              min={0}
              max={60}
              step={1}
              decimalScale={1}
              value={dmxRealIntensity}
              onChange={(value) =>
                setDmxRealIntensity(typeof value === "number" ? value : 12)
              }
              disabled={dmxRenderMode !== "real"}
              size="xs"
            />
            <NumberInput
              label="Fake beam strength"
              min={0}
              max={1}
              step={0.02}
              decimalScale={2}
              value={dmxFakeIntensity}
              onChange={(value) =>
                setDmxFakeIntensity(typeof value === "number" ? value : 0.24)
              }
              disabled={dmxRenderMode !== "fake"}
              size="xs"
            />
            <NumberInput
              label="Beam angle"
              suffix="°"
              min={4}
              max={70}
              step={1}
              decimalScale={0}
              value={dmxBeamAngleDeg}
              onChange={(value) =>
                setDmxBeamAngleDeg(typeof value === "number" ? value : 24)
              }
              size="xs"
            />
            <Switch
              label="Cast shadows"
              checked={dmxCastShadows}
              onChange={(event) =>
                setDmxCastShadows(event.currentTarget.checked)
              }
              disabled={dmxRenderMode !== "real"}
              size="sm"
            />
          </Stack>
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
            <IconTriangle size={16} />
            <Text
              size="sm"
              fw={600}
            >
              Panels
            </Text>
          </Group>
          <Stack gap="sm">
            <Switch
              label={`${STRUCTURE_PANELS.length} lower panels`}
              checked={showPanels}
              onChange={(event) => setShowPanels(event.currentTarget.checked)}
              size="sm"
            />
            <ColorInput
              label="Texture color"
              value={panelColor}
              onChange={setPanelColor}
              swatches={["#2f6f7f", "#455b4a", "#7f5f3f", "#f3e7cf"]}
              size="xs"
            />
            <NumberInput
              label="Edge gap"
              suffix=" m"
              min={0}
              max={0.3}
              step={0.01}
              decimalScale={3}
              value={panelGapMeters}
              onChange={(value) =>
                setPanelGapMeters(typeof value === "number" ? value : 0.04)
              }
              size="xs"
            />
          </Stack>
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
