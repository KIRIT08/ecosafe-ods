export function createInputController() {
  const keys = new Set()
  const touchKeys = new Set()

  function onKeyDown(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      event.preventDefault()
      keys.add(event.code)
    }
  }

  function onKeyUp(event) {
    keys.delete(event.code)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  return {
    keys,
    setTouchDirection(direction, active) {
      const keyByDirection = {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
      }
      const key = keyByDirection[direction]
      if (!key) return

      if (active) {
        touchKeys.add(key)
      } else {
        touchKeys.delete(key)
      }
    },
    clearTouchDirections() {
      touchKeys.clear()
    },
    get activeKeys() {
      return new Set([...keys, ...touchKeys])
    },
    destroy() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      touchKeys.clear()
    },
  }
}

export function getMovement(keys) {
  const left = keys.has('ArrowLeft') || keys.has('KeyA')
  const right = keys.has('ArrowRight') || keys.has('KeyD')
  const up = keys.has('ArrowUp') || keys.has('KeyW')
  const down = keys.has('ArrowDown') || keys.has('KeyS')

  return {
    x: Number(right) - Number(left),
    y: Number(down) - Number(up),
  }
}
