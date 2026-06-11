import { useContext } from 'react'
import { AudioContextState } from '../contexts/audioContext'

export function useAudio() {
  const context = useContext(AudioContextState)

  if (!context) {
    throw new Error('useAudio debe usarse dentro de AudioProvider.')
  }

  return context
}
