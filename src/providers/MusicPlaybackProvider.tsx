import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  MusicPlaybackContext,
  type MusicPlaybackContextValue,
} from "./musicPlaybackContext"

interface MusicPlaybackProviderProps {
  children: ReactNode
  initialSongUrl?: string
  initialSongName?: string
}

function clampVolume(volume: number) {
  return Math.min(1, Math.max(0, volume))
}

export function MusicPlaybackProvider({
  children,
  initialSongUrl,
  initialSongName,
}: MusicPlaybackProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [songUrl, setSongUrlState] = useState(initialSongUrl ?? "")
  const [songName, setSongName] = useState<string | null>(
    initialSongName ?? null
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      setIsPlaying(false)
      setPlaybackError("Unable to play this audio file.")
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handlePause)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handlePause)
      audio.removeEventListener("error", handleError)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const setSongUrl = useCallback((url: string, name?: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    const audio = audioRef.current
    audio?.pause()
    setSongUrlState(url)
    setSongName(name ?? url.split("/").pop() ?? "Song")
    setPlaybackError(null)

    if (audio) {
      audio.currentTime = 0
    }
  }, [])

  const setSongFile = useCallback((file: File | null) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    const audio = audioRef.current
    audio?.pause()

    if (!file) {
      setSongUrlState("")
      setSongName(null)
      setPlaybackError(null)
      return
    }

    const nextUrl = URL.createObjectURL(file)
    objectUrlRef.current = nextUrl
    setSongUrlState(nextUrl)
    setSongName(file.name)
    setPlaybackError(null)

    if (audio) {
      audio.currentTime = 0
    }
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(clampVolume(nextVolume))
  }, [])

  const play = useCallback(async () => {
    if (!audioRef.current || !songUrl) {
      setPlaybackError("Choose a song before playback.")
      return
    }

    try {
      setPlaybackError(null)
      await audioRef.current.play()
    } catch {
      setIsPlaying(false)
      setPlaybackError("Playback was blocked. Press play again.")
    }
  }, [songUrl])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      pause()
      return
    }

    await play()
  }, [isPlaying, pause, play])

  const value = useMemo<MusicPlaybackContextValue>(
    () => ({
      isPlaying,
      songName,
      volume,
      canPlay: Boolean(songUrl),
      playbackError,
      setSongFile,
      setSongUrl,
      setVolume,
      play,
      pause,
      togglePlayback,
    }),
    [
      isPlaying,
      pause,
      play,
      playbackError,
      setSongFile,
      setSongUrl,
      setVolume,
      songName,
      songUrl,
      togglePlayback,
      volume,
    ]
  )

  return (
    <MusicPlaybackContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={songUrl}
        loop
        preload="auto"
      />
    </MusicPlaybackContext.Provider>
  )
}
