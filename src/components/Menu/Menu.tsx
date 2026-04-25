import {
  Accordion,
  Box,
  ColorInput,
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
  IconUsers,
} from "@tabler/icons-react"
import {
  DMX_FIXTURES,
  STRUCTURE_EDGES,
  STRUCTURE_PANELS,
  STRUCTURE_SIZE,
  STRUCTURE_VERTICES,
  validateStructureData,
} from "../../data/carStructure"
import { HUMAN_PLACEMENTS } from "../../data/humans"
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
    showHumans,
    humanScale,
    humanAnimationSpeed,
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
    setShowHumans,
    setHumanScale,
    setHumanAnimationSpeed,
  } = useAbyssStore()

  const validation = validateStructureData()

  return (
    <aside className={classes.wrapper}>
      <Stack
        gap="sm"
        p="md"
        mt="60px"
      >
        <Accordion
          multiple
          defaultValue={["structure", "dmx", "humans", "panels", "tube"]}
          chevronPosition="right"
          classNames={{
            item: classes.item,
            control: classes.control,
            content: classes.content,
            chevron: classes.chevron,
          }}
        >
          <Accordion.Item value="structure">
            <Accordion.Control icon={<IconCircleLetterI size={16} />}>
              Structure
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap={4}>
                <Text size="sm">
                  {STRUCTURE_VERTICES.length} vertices ·{" "}
                  {STRUCTURE_EDGES.length} edges
                </Text>
                <Text size="xs">{STRUCTURE_PANELS.length} lower panels</Text>
                <Text size="xs">{DMX_FIXTURES.length} DMX test fixtures</Text>
                <Text size="xs">{HUMAN_PLACEMENTS.length} human refs</Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="humans">
            <Accordion.Control icon={<IconUsers size={16} />}>
              Humans
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label={`${HUMAN_PLACEMENTS.length} ground refs`}
                  checked={showHumans}
                  onChange={(event) =>
                    setShowHumans(event.currentTarget.checked)
                  }
                  size="sm"
                />
                <NumberInput
                  label="Scale"
                  min={0.1}
                  max={3}
                  step={0.05}
                  decimalScale={2}
                  value={humanScale}
                  onChange={(value) =>
                    setHumanScale(typeof value === "number" ? value : 1)
                  }
                  size="xs"
                />
                <NumberInput
                  label="Animation speed"
                  min={0}
                  max={2}
                  step={0.05}
                  decimalScale={2}
                  value={humanAnimationSpeed}
                  onChange={(value) =>
                    setHumanAnimationSpeed(
                      typeof value === "number" ? value : 1
                    )
                  }
                  size="xs"
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="dmx">
            <Accordion.Control icon={<IconBulb size={16} />}>
              DMX Fixtures
            </Accordion.Control>
            <Accordion.Panel>
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
                  max={1000}
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
                    setDmxFakeIntensity(
                      typeof value === "number" ? value : 0.24
                    )
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
                <Text
                  size="xs"
                  c="dimmed"
                >
                  Real mode enables shadow casting on every DMX can.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="view">
            <Accordion.Control icon={<IconEye size={16} />}>
              View
            </Accordion.Control>
            <Accordion.Panel>
              <Switch
                label="Vertex labels"
                checked={showLabels}
                onChange={(event) => setShowLabels(event.currentTarget.checked)}
                size="sm"
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="panels">
            <Accordion.Control icon={<IconTriangle size={16} />}>
              Panels
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label={`${STRUCTURE_PANELS.length} lower panels`}
                  checked={showPanels}
                  onChange={(event) =>
                    setShowPanels(event.currentTarget.checked)
                  }
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
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="tube">
            <Accordion.Control icon={<IconDimensions size={16} />}>
              Tube
            </Accordion.Control>
            <Accordion.Panel>
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
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="scale">
            <Accordion.Control icon={<IconCircleLetterI size={16} />}>
              Scale
            </Accordion.Control>
            <Accordion.Panel>
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </aside>
  )
}

export default Menu
