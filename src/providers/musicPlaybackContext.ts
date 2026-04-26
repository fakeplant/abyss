import { createContext } from "react"

export interface MusicPlaybackContextValue {
  isPlaying: boolean
  songName: string | null
  volume: number
  canPlay: boolean
  playbackError: string | null
  setSongFile: (file: File | null) => void
  setSongUrl: (url: string, name?: string) => void
  setVolume: (volume: number) => void
  play: () => Promise<void>
  pause: () => void
  togglePlayback: () => Promise<void>
}

export const MusicPlaybackContext =
  createContext<MusicPlaybackContextValue | null>(null)
