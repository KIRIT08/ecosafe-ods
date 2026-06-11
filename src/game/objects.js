import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y, badObjects, goodObjects } from './gameConfig'

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

export function createFallingObject(level = 1) {
  const activeLevel = Math.max(1, level)
  const isTutorial = level <= 0
  const badChance = isTutorial ? 0.18 : Math.min(0.26 + activeLevel * 0.035, 0.52)
  const isGood = Math.random() > badChance
  const definition = pickRandom(isGood ? goodObjects : badObjects)
  const size = randomBetween(28, 42)

  return {
    id: crypto.randomUUID(),
    kind: isGood ? 'good' : 'bad',
    ...definition,
    x: randomBetween(26, GAME_WIDTH - 60),
    y: -size,
    width: size,
    height: size,
    speed: randomBetween(1.6, 2.8) + activeLevel * 0.38,
    rotation: randomBetween(0, Math.PI),
  }
}

export function updateObject(object) {
  return {
    ...object,
    y: object.y + object.speed,
    rotation: object.rotation + 0.025,
  }
}

export function isObjectOutOfBounds(object) {
  return object.y > GAME_HEIGHT + 80 || object.y > GROUND_Y + 70
}
