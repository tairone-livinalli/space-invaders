import kaboom from "kaboom"

kaboom()

const PLAYER_SPEED = 200
const INVADER_SPEED_RIGHT = 100
const INVADER_SPEED_LEFT = -100
let INVADER_CURRENT_SPEED = INVADER_SPEED_RIGHT
const STARTER_TIME_LEFT = 100
const LEVEL_DOWN = 200

layer([
  'obj',
  'ui',
], 'obj')

loadSprite('space-invader', '/sprites/space-invader.png')
loadSprite('left-wall', '/sprites/left-wall.png')
loadSprite('right-wall', '/sprites/right-wall.png')
loadSprite('space-ship', '/sprites/space-ship.png')
loadSprite('invader', '/sprites/invader.png')
loadSprite('boss', '/sprites/boss.png')

scene('game', () => {
  addLevel([
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!^^^^^^^^^^      &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  '!                &',
  ], {
    width: 30,
    height: 22,
    '^': () => [sprite('space-invader'), scale(0.8), 'space-invader', area()],
    '!': () => [sprite('left-wall'), area(), 'left-wall'],
    '&': () => [sprite('right-wall'), area(), 'right-wall'],
    '$': () => [sprite('invader'), area()],
    '|': () => [sprite('boss'), scale(2), area()]
  })
  
  const player = add([
    sprite('space-ship'),
    pos(width() / 2, height() / 2),
    origin('center'),
    area(),
  ])
  
  keyDown('w', () => {
    player.move(0, -PLAYER_SPEED)
  })
  
  keyDown('s', () => {
    player.move(0, PLAYER_SPEED)
  })
  
  keyDown('a', () => {
    player.move(-PLAYER_SPEED, 0)
  })
  
  keyDown('d', () => {
    player.move(PLAYER_SPEED, 0)
  })
  
  const score = add([
    text('0'),
    pos(25, 10),
    layer('ui'),
    {
      value: 0,
    }
  ])
  
  const timer = add([
    text('0'),
    pos(25, 65),
    scale(0.7),
    layer('ui'),
    {
      time: STARTER_TIME_LEFT
    }
  ])
  
  timer.onUpdate(() => {
    timer.time -= dt()
    timer.text = timer.time.toFixed(2)
  
    if (timer.time <= 0) {
      go('lose', { score: score.value })
    }
  })

  onUpdate('space-invader', (s) => {
    s.move(INVADER_CURRENT_SPEED, 0)
  })

  collides('space-invader', 'right-wall', () => {
    INVADER_CURRENT_SPEED = INVADER_SPEED_LEFT
    every('space-invader', (s) => {
      s.move(0, LEVEL_DOWN)
    })
  })

  collides('space-invader', 'left-wall', () => {
    INVADER_CURRENT_SPEED = INVADER_SPEED_RIGHT
    every('space-invader', (s) => {
      s.move(0, LEVEL_DOWN)
    })
  })

  player.collides('space-invader', () => {
    go('lose', { score: score.value })
  })
})

scene('lose', ({ score }) => {
  add([
    text('You lose'),
    origin('center'),
    scale(1),
    pos(width() / 2, height() / 4)
  ])
  
  add([
    text(score),
    origin('center'),
    scale(1),
    pos(width() / 2, height() / 2)
  ])

  add([
    text('You lose'),
    origin('center'),
    scale(1),
    pos(width() / 2, height() / 4)
  ])
  
  add([
    text('Press space to continue'),
    origin('center'),
    scale(0.5),
    pos(width() / 2, height() * 0.8)
  ])

  keyDown('space', () => {
    go('game')
  })
})

go('game', { score: 0 })