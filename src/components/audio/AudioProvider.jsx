import { useCallback, useMemo, useRef, useState } from 'react'
import { AudioContextState } from '../../contexts/audioContext'

const STORAGE_KEY = 'ecosafe_ods_sound_enabled'

const soundMap = {
  click: { frequency: 520, duration: 0.055, volume: 0.035, type: 'sine' },
  toggle: { frequency: 680, duration: 0.08, volume: 0.045, type: 'triangle' },
  success: { frequency: 880, duration: 0.12, volume: 0.055, type: 'sine' },
  warning: { frequency: 190, duration: 0.14, volume: 0.045, type: 'sawtooth' },
}

function getInitialEnabled() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored ? stored === 'true' : true
}

function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const [enabled, setEnabled] = useState(getInitialEnabled)

  const play = useCallback(
    (name = 'click') => {
      if (!enabled) return

      const BrowserAudioContext = window.AudioContext || window.webkitAudioContext
      if (!BrowserAudioContext) return

      const audioContext = audioRef.current || new BrowserAudioContext()
      audioRef.current = audioContext

      const config = soundMap[name] || soundMap.click
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.type = config.type
      oscillator.frequency.value = config.frequency
      gain.gain.setValueAtTime(config.volume, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration)
      oscillator.connect(gain)
      gain.connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + config.duration)
    },
    [enabled],
  )

  const toggleSound = useCallback(() => {
    setEnabled((current) => {
      const next = !current
      window.localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      enabled,
      play,
      toggleSound,
    }),
    [enabled, play, toggleSound],
  )

  return <AudioContextState.Provider value={value}>{children}</AudioContextState.Provider>
}

export default AudioProvider
