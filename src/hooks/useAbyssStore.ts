import { useEffect, useState } from "react"

export interface AbyssViewState {
  menuOpen: boolean
  showLabels: boolean
  tubeDiameterMeters: number
  tubeColor: string
  tubeOpacity: number
  showPanels: boolean
  panelColor: string
  panelGapMeters: number
  showSpotlights: boolean
  spotlightColor: string
  spotlightIntensity: number
  spotlightBeamAngleDeg: number
  spotlightCastShadows: boolean
  showBars: boolean
  barRotationDeg: number
  barEmitterBrightness: number
  barCobBrightness: number
  barBeamLengthMeters: number
  barBeamAngleDeg: number
  barMountOffsetMeters: number
  showHumans: boolean
  humanScale: number
  humanAnimationSpeed: number
}

export interface AbyssViewActions {
  setMenuOpen: (open: boolean) => void
  setShowLabels: (show: boolean) => void
  setTubeDiameterMeters: (diameter: number) => void
  setTubeColor: (color: string) => void
  setTubeOpacity: (opacity: number) => void
  setShowPanels: (show: boolean) => void
  setPanelColor: (color: string) => void
  setPanelGapMeters: (gap: number) => void
  setShowSpotlights: (show: boolean) => void
  setSpotlightColor: (color: string) => void
  setSpotlightIntensity: (intensity: number) => void
  setSpotlightBeamAngleDeg: (angle: number) => void
  setSpotlightCastShadows: (castShadows: boolean) => void
  setShowBars: (show: boolean) => void
  setBarRotationDeg: (rotation: number) => void
  setBarEmitterBrightness: (brightness: number) => void
  setBarCobBrightness: (brightness: number) => void
  setBarBeamLengthMeters: (length: number) => void
  setBarBeamAngleDeg: (angle: number) => void
  setBarMountOffsetMeters: (offset: number) => void
  setShowHumans: (showHumans: boolean) => void
  setHumanScale: (humanScale: number) => void
  setHumanAnimationSpeed: (humanAnimationSpeed: number) => void
}

const DEFAULT_STATE: AbyssViewState = {
  menuOpen: true,
  showLabels: false,
  tubeDiameterMeters: 0.0508,
  tubeColor: "#050505",
  tubeOpacity: 1,
  showPanels: true,
  panelColor: "#2f3030",
  panelGapMeters: 0.04,
  showSpotlights: true,
  spotlightColor: "#ff0000",
  spotlightIntensity: 1000,
  spotlightBeamAngleDeg: 24,
  spotlightCastShadows: false,
  showBars: true,
  barRotationDeg: 0,
  barEmitterBrightness: 0.15,
  barCobBrightness: 0.75,
  barBeamLengthMeters: 20,
  barBeamAngleDeg: 1,
  barMountOffsetMeters: 0.04,
  showHumans: true,
  humanScale: 1,
  humanAnimationSpeed: 1,
}

let currentState = DEFAULT_STATE
const listeners = new Set<(state: AbyssViewState) => void>()

function setState(update: Partial<AbyssViewState>) {
  currentState = { ...currentState, ...update }
  listeners.forEach((listener) => listener(currentState))
}

export function useAbyssStore(): AbyssViewState & AbyssViewActions {
  const [state, setLocalState] = useState(currentState)

  useEffect(() => {
    listeners.add(setLocalState)
    return () => {
      listeners.delete(setLocalState)
    }
  }, [])

  return {
    ...state,
    setMenuOpen: (menuOpen) => setState({ menuOpen }),
    setShowLabels: (showLabels) => setState({ showLabels }),
    setTubeDiameterMeters: (tubeDiameterMeters) =>
      setState({ tubeDiameterMeters }),
    setTubeColor: (tubeColor) => setState({ tubeColor }),
    setTubeOpacity: (tubeOpacity) => setState({ tubeOpacity }),
    setShowPanels: (showPanels) => setState({ showPanels }),
    setPanelColor: (panelColor) => setState({ panelColor }),
    setPanelGapMeters: (panelGapMeters) => setState({ panelGapMeters }),
    setShowSpotlights: (showSpotlights) => setState({ showSpotlights }),
    setSpotlightColor: (spotlightColor) => setState({ spotlightColor }),
    setSpotlightIntensity: (spotlightIntensity) =>
      setState({ spotlightIntensity }),
    setSpotlightBeamAngleDeg: (spotlightBeamAngleDeg) =>
      setState({ spotlightBeamAngleDeg }),
    setSpotlightCastShadows: (spotlightCastShadows) =>
      setState({ spotlightCastShadows }),
    setShowBars: (showBars) => setState({ showBars }),
    setBarRotationDeg: (barRotationDeg) => setState({ barRotationDeg }),
    setBarEmitterBrightness: (barEmitterBrightness) =>
      setState({ barEmitterBrightness }),
    setBarCobBrightness: (barCobBrightness) => setState({ barCobBrightness }),
    setBarBeamLengthMeters: (barBeamLengthMeters) =>
      setState({ barBeamLengthMeters }),
    setBarBeamAngleDeg: (barBeamAngleDeg) => setState({ barBeamAngleDeg }),
    setBarMountOffsetMeters: (barMountOffsetMeters) =>
      setState({ barMountOffsetMeters }),
    setShowHumans: (showHumans) => setState({ showHumans }),
    setHumanScale: (humanScale) => setState({ humanScale }),
    setHumanAnimationSpeed: (humanAnimationSpeed) =>
      setState({ humanAnimationSpeed }),
  }
}
