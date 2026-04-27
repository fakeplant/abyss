import {
  Accordion,
  Box,
  Button,
  ColorInput,
  FileButton,
  Group,
  NumberInput,
  ScrollArea,
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
  IconMusic,
  IconPlayerPause,
  IconPlayerPlay,
  IconTriangle,
  IconUpload,
  IconVolume,
  IconUsers,
} from "@tabler/icons-react"
import {
  STRUCTURE_EDGES,
  STRUCTURE_PANELS,
  STRUCTURE_SIZE,
  STRUCTURE_VERTICES,
  validateStructureData,
} from "../../data/carStructure"
import {
  BAR_FIXTURES,
  DMX_FIXTURES,
  LASER_FIXTURES,
  SPOTLIGHT_FIXTURES,
  validateFixtureData,
} from "../../data/fixtures"
import { HUMAN_PLACEMENTS } from "../../data/humans"
import { useAbyssStore } from "../../hooks/useAbyssStore"
import { useMusicPlayback } from "../../hooks/useMusicPlayback"
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
    showSpotlights,
    spotlightColor,
    spotlightIntensity,
    spotlightBeamAngleDeg,
    spotlightCastShadows,
    showBars,
    barRotationDeg,
    barEmitterBrightness,
    barCobBrightness,
    barBeamLengthMeters,
    barBeamAngleDeg,
    barMountOffsetMeters,
    showLasers,
    laserColor,
    laserBrightness,
    laserBeamLengthMeters,
    laserFanAngleDeg,
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
    setShowSpotlights,
    setSpotlightColor,
    setSpotlightIntensity,
    setSpotlightBeamAngleDeg,
    setSpotlightCastShadows,
    setShowBars,
    setBarRotationDeg,
    setBarEmitterBrightness,
    setBarCobBrightness,
    setBarBeamLengthMeters,
    setBarBeamAngleDeg,
    setBarMountOffsetMeters,
    setShowLasers,
    setLaserColor,
    setLaserBrightness,
    setLaserBeamLengthMeters,
    setLaserFanAngleDeg,
    setShowHumans,
    setHumanScale,
    setHumanAnimationSpeed,
  } = useAbyssStore()
  const {
    isPlaying,
    songName,
    volume,
    canPlay,
    playbackError,
    setSongFile,
    togglePlayback,
    setVolume,
  } = useMusicPlayback()

  const validation = validateStructureData()
  const fixtureValidation = validateFixtureData()

  return (
    <aside className={classes.wrapper}>
      <ScrollArea
        className={classes.scrollArea}
        offsetScrollbars
        scrollbarSize={8}
        type="auto"
      >
        <Stack
          gap="sm"
          p="md"
          mt="60px"
        >
          <Accordion
            multiple
            defaultValue={[
              "structure",
              "spotlights",
              "bars",
              "lasers",
              "humans",
              "panels",
              "tube",
              "music",
            ]}
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
                <Text size="xs">{DMX_FIXTURES.length} DMX fixtures</Text>
                <Text size="xs">{SPOTLIGHT_FIXTURES.length} spotlights</Text>
                <Text size="xs">{BAR_FIXTURES.length} bars</Text>
                <Text size="xs">{LASER_FIXTURES.length} lasers</Text>
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

          <Accordion.Item value="spotlights">
            <Accordion.Control icon={<IconBulb size={16} />}>
              Spotlights
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label={`${SPOTLIGHT_FIXTURES.length} real spotlights`}
                  checked={showSpotlights}
                  onChange={(event) =>
                    setShowSpotlights(event.currentTarget.checked)
                  }
                  size="sm"
                />
                <ColorInput
                  label="Light color"
                  value={spotlightColor}
                  onChange={setSpotlightColor}
                  swatches={["#ffdca8", "#c7e7ff", "#ffd2f0", "#ffffff"]}
                  size="xs"
                />
                <NumberInput
                  label="Real intensity"
                  min={0}
                  max={1000}
                  step={1}
                  decimalScale={1}
                  value={spotlightIntensity}
                  onChange={(value) =>
                    setSpotlightIntensity(
                      typeof value === "number" ? value : 12
                    )
                  }
                  size="xs"
                />
                <NumberInput
                  label="Beam angle"
                  suffix="°"
                  min={4}
                  max={70}
                  step={1}
                  decimalScale={0}
                  value={spotlightBeamAngleDeg}
                  onChange={(value) =>
                    setSpotlightBeamAngleDeg(
                      typeof value === "number" ? value : 24
                    )
                  }
                  size="xs"
                />
                <Switch
                  label="Cast shadows"
                  checked={spotlightCastShadows}
                  onChange={(event) =>
                    setSpotlightCastShadows(event.currentTarget.checked)
                  }
                  size="sm"
                />
                <Text
                  size="xs"
                  c="dimmed"
                >
                  Spotlights always use real Three lights.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="bars">
            <Accordion.Control icon={<IconBulb size={16} />}>
              Bars
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label={`${BAR_FIXTURES.length} edge-mounted bars`}
                  checked={showBars}
                  onChange={(event) => setShowBars(event.currentTarget.checked)}
                  size="sm"
                />
                <NumberInput
                  label="Rotation trim"
                  suffix="°"
                  min={-90}
                  max={90}
                  step={1}
                  decimalScale={0}
                  value={barRotationDeg}
                  onChange={(value) =>
                    setBarRotationDeg(typeof value === "number" ? value : 0)
                  }
                  size="xs"
                />
                <NumberInput
                  label="Beam length"
                  suffix=" m"
                  min={0.05}
                  max={12}
                  step={0.05}
                  decimalScale={2}
                  value={barBeamLengthMeters}
                  onChange={(value) =>
                    setBarBeamLengthMeters(
                      typeof value === "number" ? value : 0.7
                    )
                  }
                  size="xs"
                />
                <NumberInput
                  label="Beam angle"
                  suffix="°"
                  min={1}
                  max={70}
                  step={1}
                  decimalScale={0}
                  value={barBeamAngleDeg}
                  onChange={(value) =>
                    setBarBeamAngleDeg(typeof value === "number" ? value : 9)
                  }
                  size="xs"
                />
                <NumberInput
                  label="Mount offset"
                  suffix=" m"
                  min={0}
                  max={0.3}
                  step={0.005}
                  decimalScale={3}
                  value={barMountOffsetMeters}
                  onChange={(value) =>
                    setBarMountOffsetMeters(
                      typeof value === "number" ? value : 0.04
                    )
                  }
                  size="xs"
                />
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={6}
                  >
                    Front emitter brightness
                  </Text>
                  <Slider
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={barEmitterBrightness}
                    onChange={setBarEmitterBrightness}
                    size="sm"
                  />
                </Box>
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={6}
                  >
                    Rear COB brightness
                  </Text>
                  <Slider
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={barCobBrightness}
                    onChange={setBarCobBrightness}
                    size="sm"
                  />
                </Box>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="lasers">
            <Accordion.Control icon={<IconBulb size={16} />}>
              Lasers
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Switch
                  label={`${LASER_FIXTURES.length} edge-mounted lasers`}
                  checked={showLasers}
                  onChange={(event) =>
                    setShowLasers(event.currentTarget.checked)
                  }
                  size="sm"
                />
                <ColorInput
                  label="Beam color"
                  value={laserColor}
                  onChange={setLaserColor}
                  swatches={["#38ff7a", "#00e5ff", "#ff1744", "#f8fafc"]}
                  size="xs"
                />
                <NumberInput
                  label="Beam length"
                  suffix=" m"
                  min={0.5}
                  max={40}
                  step={0.5}
                  decimalScale={1}
                  value={laserBeamLengthMeters}
                  onChange={(value) =>
                    setLaserBeamLengthMeters(
                      typeof value === "number" ? value : 16
                    )
                  }
                  size="xs"
                />
                <NumberInput
                  label="Fan angle"
                  suffix="°"
                  min={2}
                  max={120}
                  step={1}
                  decimalScale={0}
                  value={laserFanAngleDeg}
                  onChange={(value) =>
                    setLaserFanAngleDeg(typeof value === "number" ? value : 34)
                  }
                  size="xs"
                />
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={6}
                  >
                    Beam brightness
                  </Text>
                  <Slider
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={laserBrightness}
                    onChange={setLaserBrightness}
                    size="sm"
                  />
                </Box>
                <Text
                  size="xs"
                  c="dimmed"
                >
                  Laser beams are simulated line effects, not real lights.
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="music">
            <Accordion.Control icon={<IconMusic size={16} />}>
              Music playback
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <FileButton
                  onChange={setSongFile}
                  accept="audio/*"
                >
                  {(props) => (
                    <Button
                      {...props}
                      leftSection={<IconUpload size={16} />}
                      variant="default"
                      size="xs"
                      fullWidth
                    >
                      Choose song
                    </Button>
                  )}
                </FileButton>
                <Group
                  gap="xs"
                  grow
                >
                  <Button
                    leftSection={
                      isPlaying ? (
                        <IconPlayerPause size={16} />
                      ) : (
                        <IconPlayerPlay size={16} />
                      )
                    }
                    onClick={() => void togglePlayback()}
                    disabled={!canPlay}
                    size="xs"
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </Group>
                <Text
                  size="xs"
                  c={songName ? undefined : "dimmed"}
                  truncate
                  title={songName ?? undefined}
                >
                  {songName ?? "No song selected"}
                </Text>
                <Box>
                  <Text
                    size="xs"
                    fw={500}
                    mb={6}
                  >
                    <Group
                      gap={6}
                      component="span"
                    >
                      <IconVolume size={14} />
                      Volume
                    </Group>
                  </Text>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={setVolume}
                    size="sm"
                    label={(value) => `${Math.round(value * 100)}%`}
                  />
                </Box>
                {playbackError ? (
                  <Text
                    size="xs"
                    c="red"
                  >
                    {playbackError}
                  </Text>
                ) : null}
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
                  c={validation.valid && fixtureValidation.valid ? "dimmed" : "red"}
                  mt="xs"
                >
                  {validation.valid && fixtureValidation.valid
                    ? "Data integrity checks pass."
                    : [...validation.errors, ...fixtureValidation.errors].join(
                        ", "
                      )}
                </Text>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
          </Accordion>
        </Stack>
      </ScrollArea>
    </aside>
  )
}

export default Menu
