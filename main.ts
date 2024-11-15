namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}
let heroPalette = [
    DefaultPaletteColor.Transparency,
    DefaultPaletteColor.White,
    DefaultPaletteColor.Red,

    // light shoes
    DefaultPaletteColor.White,

    DefaultPaletteColor.Orange,
    DefaultPaletteColor.Yellow,

    // dark hair
    DefaultPaletteColor.Red,
    // light hair
    DefaultPaletteColor.Orange,

    // dark pants
    DefaultPaletteColor.Purple,
    // light pants
    DefaultPaletteColor.Pink,

    // light shirt
    DefaultPaletteColor.LightBlue,

    DefaultPaletteColor.LightPurple,

    // dark shirt
    DefaultPaletteColor.Teal,

    DefaultPaletteColor.Tan,

    // dark shoes
    DefaultPaletteColor.Tan,

    DefaultPaletteColor.Black
]

const recolor = (anim: Image[]) => Custom.colorSwapAnimation(anim, heroPalette)

let hero: Sprite = null
tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`tilemap-tiny-island`))
Custom.resetMap()
Custom.createIsland()
Custom.createAnimation(
    'hero',
    'walk',
    recolor(assets.animation`hero-walk-up`),
    recolor(assets.animation`hero-walk-down`),
    recolor(assets.animation`hero-walk-left`)
)
Custom.createAnimation(
    'hero',
    'use',
    recolor(assets.animation`hero-use-up`),
    recolor(assets.animation`hero-use-down`),
    recolor(assets.animation`hero-use-left`)
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