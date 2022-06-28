import kaboom from "kaboom"

kaboom()

loadSprite('space-invader', '/sprites/space-invader.png')
loadSprite('left-wall', '/sprites/left-wall.png')
loadSprite('right-wall', '/sprites/right-wall.png')

addLevel([
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
  '^': () => [sprite('space-invader')],
  '!': () => [sprite('left-wall')],
  '&': () => [sprite('right-wall')],
})
