import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from './gameConfig'

export function drawScene(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)
  sky.addColorStop(0, '#5fc7ef')
  sky.addColorStop(0.5, '#9fe8a6')
  sky.addColorStop(0.52, '#2f6b2f')
  sky.addColorStop(1, '#172a18')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  drawMountains(ctx)
  drawClouds(ctx)
  drawGround(ctx)
}

function drawMountains(ctx) {
  ctx.fillStyle = 'rgba(15, 42, 53, 0.42)'
  ctx.beginPath()
  ctx.moveTo(120, GROUND_Y)
  ctx.lineTo(310, 100)
  ctx.lineTo(510, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(6, 24, 38, 0.48)'
  ctx.beginPath()
  ctx.moveTo(420, GROUND_Y)
  ctx.lineTo(690, 70)
  ctx.lineTo(930, GROUND_Y)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)'
  ctx.beginPath()
  ctx.moveTo(690, 70)
  ctx.lineTo(640, 150)
  ctx.lineTo(710, 128)
  ctx.lineTo(735, 160)
  ctx.closePath()
  ctx.fill()
}

function drawClouds(ctx) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
  ;[
    [100, 82],
    [340, 68],
    [630, 116],
  ].forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.arc(x + 28, y - 10, 28, 0, Math.PI * 2)
    ctx.arc(x + 58, y, 24, 0, Math.PI * 2)
    ctx.fill()
  })
}

function drawGround(ctx) {
  ctx.fillStyle = '#31551f'
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y)
  ctx.fillStyle = '#203817'
  ctx.fillRect(0, GROUND_Y + 36, GAME_WIDTH, 60)

  for (let x = 0; x < GAME_WIDTH; x += 28) {
    ctx.fillStyle = x % 56 === 0 ? '#1f3617' : '#2f4d1f'
    ctx.beginPath()
    ctx.arc(x + 10, GROUND_Y + 46, 10, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function drawPlayer(ctx, player, tick) {
  ctx.save()
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2)
  const bounce = Math.sin(tick / 9) * 2
  const armSwing = Math.sin(tick / 7) * 3
  ctx.translate(0, bounce)

  ctx.fillStyle = 'rgba(2, 6, 23, 0.22)'
  ctx.beginPath()
  ctx.ellipse(0, 39, 26, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-16, 2)
  ctx.lineTo(-24, 18 + armSwing)
  ctx.moveTo(16, 2)
  ctx.lineTo(24, 18 - armSwing)
  ctx.stroke()

  ctx.fillStyle = '#15803d'
  ctx.strokeStyle = '#052e16'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(-18, -7, 36, 38, 10)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.roundRect(-12, -3, 24, 28, 7)
  ctx.fill()

  ctx.fillStyle = '#ecfccb'
  ctx.beginPath()
  ctx.moveTo(0, 3)
  ctx.ellipse(0, 9, 8, 11, -0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#166534'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-5, 16)
  ctx.lineTo(6, 4)
  ctx.stroke()

  ctx.fillStyle = '#1f2937'
  ctx.beginPath()
  ctx.roundRect(-15, 25, 11, 17, 4)
  ctx.roundRect(4, 25, 11, 17, 4)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.roundRect(-18, 39, 15, 6, 3)
  ctx.roundRect(3, 39, 15, 6, 3)
  ctx.fill()

  ctx.fillStyle = '#f8c792'
  ctx.beginPath()
  ctx.arc(0, -22, 17, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#166534'
  ctx.beginPath()
  ctx.arc(0, -34, 16, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.ellipse(8, -32, 17, 6, 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3b2414'
  ctx.beginPath()
  ctx.arc(-5, -29, 10, Math.PI, Math.PI * 1.92)
  ctx.fill()

  ctx.fillStyle = '#0f172a'
  ctx.beginPath()
  ctx.arc(-6, -22, 2, 0, Math.PI * 2)
  ctx.arc(7, -22, 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(1, -15, 6, 0, Math.PI)
  ctx.stroke()

  ctx.fillStyle = '#dcfce7'
  ctx.font = '800 8px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ODS', 0, 23)
  ctx.restore()
}

export function drawObject(ctx, object) {
  ctx.save()
  ctx.translate(object.x + object.width / 2, object.y + object.height / 2)
  ctx.rotate(object.rotation)

  if (object.kind === 'good') {
    drawGoodObject(ctx, object)
  } else {
    drawBadObject(ctx, object)
  }

  ctx.rotate(-object.rotation)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.78)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(-27, object.height / 2 + 8, 54, 22, 7)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#ecfccb'
  ctx.font = '800 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`ODS ${object.ods}`, 0, object.height / 2 + 19)

  ctx.restore()
}

function drawGoodObject(ctx, object) {
  if (object.type === 'bottle') {
    ctx.fillStyle = '#38bdf8'
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.65)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-11, -14, 22, 30, 7)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#e0f2fe'
    ctx.fillRect(-6, -23, 12, 10)
    ctx.fillStyle = '#0284c7'
    ctx.fillRect(-7, -27, 14, 5)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)'
    ctx.fillRect(-6, -8, 5, 17)
    return
  }

  if (object.type === 'water') {
    ctx.fillStyle = '#22d3ee'
    ctx.strokeStyle = 'rgba(8, 47, 73, 0.72)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, -25)
    ctx.bezierCurveTo(20, -4, 18, 22, 0, 25)
    ctx.bezierCurveTo(-18, 22, -20, -4, 0, -25)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.beginPath()
    ctx.ellipse(-6, -3, 4, 9, 0.35, 0, Math.PI * 2)
    ctx.fill()
    return
  }

  if (object.type === 'tree') {
    ctx.fillStyle = '#854d0e'
    ctx.fillRect(-5, 2, 10, 22)
    ctx.fillStyle = '#22c55e'
    ;[
      [0, -18, 17],
      [-12, -4, 14],
      [12, -4, 14],
    ].forEach(([x, y, radius]) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.strokeStyle = 'rgba(2, 6, 23, 0.55)'
    ctx.lineWidth = 2
    ctx.strokeRect(-5, 2, 10, 22)
    return
  }

  if (object.type === 'bin') {
    ctx.fillStyle = '#84cc16'
    ctx.strokeStyle = 'rgba(20, 83, 45, 0.75)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-19, -14, 38, 34, 7)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#365314'
    ctx.fillRect(-22, -20, 44, 7)
    ctx.strokeStyle = '#ecfccb'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(0, 3, 8, 0.4, Math.PI * 1.65)
    ctx.stroke()
    return
  }

  ctx.fillStyle = object.color
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.6)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(0, 0, object.width / 2, object.height / 3, -0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.strokeStyle = 'rgba(6, 24, 38, 0.62)'
  ctx.beginPath()
  ctx.moveTo(-object.width / 3, object.height / 4)
  ctx.lineTo(object.width / 3, -object.height / 4)
  ctx.stroke()
}

function drawBadObject(ctx, object) {
  if (object.type === 'smoke') {
    ctx.fillStyle = 'rgba(100, 116, 139, 0.9)'
    ;[
      [-12, 8, 13],
      [0, -4, 17],
      [14, 6, 12],
      [-2, 16, 10],
    ].forEach(([x, y, radius]) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
    drawWarning(ctx)
    return
  }

  if (object.type === 'barrel') {
    ctx.fillStyle = '#f97316'
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-18, -22, 36, 44, 8)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = 'rgba(2, 6, 23, 0.55)'
    ctx.fillRect(-18, -8, 36, 6)
    ctx.fillRect(-18, 10, 36, 6)
    drawWarning(ctx)
    return
  }

  if (object.type === 'fire') {
    const fire = ctx.createLinearGradient(0, -24, 0, 24)
    fire.addColorStop(0, '#fef08a')
    fire.addColorStop(0.45, '#f97316')
    fire.addColorStop(1, '#dc2626')
    ctx.fillStyle = fire
    ctx.beginPath()
    ctx.moveTo(0, -26)
    ctx.bezierCurveTo(22, -4, 18, 22, 0, 24)
    ctx.bezierCurveTo(-20, 18, -16, -6, 0, -26)
    ctx.fill()
    drawWarning(ctx)
    return
  }

  if (object.type === 'trash') {
    ctx.fillStyle = '#a855f7'
    ctx.strokeStyle = 'rgba(59, 7, 100, 0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(-18, -15)
    ctx.lineTo(16, -20)
    ctx.lineTo(20, 14)
    ctx.lineTo(-12, 22)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    drawWarning(ctx)
    return
  }

  if (object.type === 'spill') {
    ctx.fillStyle = '#facc15'
    ctx.strokeStyle = 'rgba(113, 63, 18, 0.8)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(0, 8, 24, 14, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(-8, -8, 8, 0, Math.PI * 2)
    ctx.fill()
    drawWarning(ctx)
    return
  }

  ctx.fillStyle = object.color
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.6)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.rect(-object.width / 2, -object.height / 2, object.width, object.height)
  ctx.fill()
  ctx.stroke()
  drawWarning(ctx)
}

function drawWarning(ctx) {
  ctx.fillStyle = 'rgba(2, 6, 23, 0.78)'
  ctx.font = '800 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('!', 0, 1)
}
