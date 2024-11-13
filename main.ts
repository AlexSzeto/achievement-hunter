namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}
let hero: Sprite = null
tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`tilemap-tiny-island`))
Custom.resetMap()
Custom.createIsland()
Custom.createAnimation(
    'hero',
    CharacterAction.Walk,
    assets.animation`hero-walk-up`,
    assets.animation`hero-walk-down`,
    assets.animation`hero-walk-left`
)
Custom.createAnimation(
    'hero',
    CharacterAction.Use,
    assets.animation`hero-use-up`,
    assets.animation`hero-use-down`,
    assets.animation`hero-use-left`
)
hero = sprites.create(assets.image`blank`, SpriteKind.Player)
Custom.createCharacter(hero, 'hero')
Custom.startControlCharacter(hero)
controller.moveSprite(hero, 48, 48)
scene.cameraFollowSprite(hero)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Custom.startAction(hero, CharacterAction.Use)
    setTimeout(function () {
        Custom.startAction(hero, CharacterAction.Stand)
    }, 400)
})