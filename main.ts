namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}
let hero: Sprite = null
tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`tilemap-tiny-island`))
Custom.resetMap()
Custom.createIsland()
Custom.createAnimation(
    'hero',
    'walk',
    assets.animation`hero-walk-up`,
    assets.animation`hero-walk-down`,
    assets.animation`hero-walk-left`
)
Custom.createAnimation(
    'hero',
    'use',
    assets.animation`hero-use-up`,
    assets.animation`hero-use-down`,
    assets.animation`hero-use-left`
)
hero = sprites.create(assets.image`blank`, SpriteKind.Player)
Custom.createCharacter(hero, 'hero')
Custom.startControlCharacter(hero)
controller.moveSprite(hero, 48, 48)
scene.cameraFollowSprite(hero)
Custom.createItemImages('wood-sword', assets.image`item-wood-sword`, true)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Custom.startAction(hero, 'use', true)) {
        controller.moveSprite(hero, 0, 0)
        Custom.addActionTimedEvent(
            hero,
            200,
            function (sprite: Sprite) {
                Custom.createItemSprite(sprite, 'wood-sword')
            }
        )
    
        Custom.addActionTimedEvent(
            hero,
            400,
            function (sprite: Sprite) {
                Custom.startAction(sprite, 'stand')
                controller.moveSprite(sprite, 48, 48)
            }
        )
    }
})