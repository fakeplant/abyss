import { useContext } from "react"
import { MusicPlaybackContext } from "../providers/musicPlaybackContext"

export function useMusicPlayback() {
  const context = useContext(MusicPlaybackContext)

  if (!context) {
    throw new Error("useMusicPlayback must be used inside MusicPlaybackProvider")
  }

  return context
}
