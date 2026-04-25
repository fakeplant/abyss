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
  }
}
