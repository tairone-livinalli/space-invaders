import kaboom from "kaboom"

kaboom()

const PLAYER_SPEED = 200
const INVADER_SPEED_RIGHT = 100
const INVADER_SPEED_LEFT = -100
const BULLET_SPEED = 400
let INVADER_CURRENT_SPEED = INVADER_SPEED_RIGHT
const STARTER_TIME_LEFT = 100
const LEVEL_DOWN = 200
let BULLET_COOLDOWN = false

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

const generateWalls = () => {
  for (i=0; i < height(); i += 22) {
    add([
      sprite('left-wall'),
      area(),
      'left-wall',
      pos(0, i)
    ])
    add([
      sprite('right-wall'),
      area(),
      'right-wall',
      pos(width() - 30, i)
    ])
  }
}

scene('game', () => {
  addLevel([
  ' ^^^^^^^^^^       ',
  ' ^^^^^^^^^^       ',
  ' ^^^^^^^^^^       ',
  '                  ',
  '                  ',
  '                  ',
  '                  ',
  '                  ',
  '                  ',
  '                  ',
  ], {
    width: 30,
    height: 22,
    '^': () => [sprite('space-invader'), scale(0.8), 'space-invader', area()],
    '!': () => [sprite('left-wall'), area(), 'left-wall'],
    '&': () => [sprite('right-wall'), area(), 'right-wall'],
    '$': () => [sprite('invader'), area()],
    '|': () => [sprite('boss'), scale(2), area()]
  })

  generateWalls()
  
  const player = add([
    sprite('space-ship'),
    pos(width() / 2, height() - 12),
    origin('center'),
    area(),
  ])
  
  keyDown('w', () => {
    if (player.pos.y <= 12) return
    
    player.move(0, -PLAYER_SPEED)
  })
  
  keyDown('s', () => {
    if (player.pos.y >= height() - 12) return
    
    player.move(0, PLAYER_SPEED)
  })
  
  keyDown('a', () => {
    if (player.pos.x <= 45) return
    
    player.move(-PLAYER_SPEED, 0)
  })
  
  keyDown('d', () => {
    if (player.pos.x >= width() - 45) return
    
    player.move(PLAYER_SPEED, 0)
  })

  keyDown('space', () => {
    if (BULLET_COOLDOWN) return;

    BULLET_COOLDOWN = true
    setTimeout(() => BULLET_COOLDOWN = false, 600)
    
    add([
      rect(5, 10),
      pos(player.pos.x, player.pos.y - 25),
      origin('center'),
      color(255, 223, 0),
      area(),
      'bullet',
    ])
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
    
    if (s.pos.y > height()) go('lose', { score: score.value })
    if (!get('space-invader').length) 
      go('win', { score: score.value, time: timer.text })
  })

  onUpdate('bullet', (b) => {
    b.move(0, -BULLET_SPEED)

    if (b.pos.y < 0) destroy(b)
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

  collides('bullet', 'space-invader', (b, s) => {
    shake(1)
    destroy(b)
    destroy(s)
    score.value += 100
    score.text = score.value
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
    text('Press r to restart'),
    origin('center'),
    scale(0.5),
    pos(width() / 2, height() * 0.8)
  ])

  keyDown('r', () => {
    go('game')
  })
})

scene('win', ({ score, time }) => {
  add([
    text('You win'),
    origin('center'),
    scale(1),
    pos(width() / 2, height() / 4)
  ])
  
  add([
    text(`${score} points`),
    origin('center'),
    scale(0.8),
    pos(width() / 2, height() / 2 - 20)
  ])
  

  add([
    text(`You had ${time}s left`),
    origin('center'),
    scale(0.6),
    pos(width() / 2, height() / 2 + 50)
  ])
  
  add([
    text('Press r to restart'),
    origin('center'),
    scale(0.5),
    pos(width() / 2, height() * 0.8)
  ])

  keyDown('r', () => {
    go('game')
  })
})

go('game')