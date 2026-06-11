import { useEffect, useState } from 'react'

function AnimatedCounter({ duration = 900, formatter, value }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = window.performance.now()
    const startValue = 0
    const endValue = Number(value) || 0
    let frameId

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(startValue + (endValue - startValue) * eased)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [duration, value])

  if (formatter) {
    return formatter(displayValue)
  }

  return Math.round(displayValue).toLocaleString('es-PE')
}

export default AnimatedCounter
