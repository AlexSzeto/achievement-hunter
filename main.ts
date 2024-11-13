namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    assets.animation`hero-walk-up`,
    100,
    true
    )
    heroFacing = "up"
})
function widthPct (percent: number) {
    return percent / 100 * tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (heroFacing == "left") {
        animation.runImageAnimation(
        hero,
        assets.animation`hero-use-left`,
        200,
        false
        )
    } else if (heroFacing == "right") {
        animation.runImageAnimation(
        hero,
        animHeroUseRight,
        200,
        false
        )
    } else if (heroFacing == "up") {
        animation.runImageAnimation(
        hero,
        assets.animation`hero-use-up`,
        200,
        false
        )
    } else {
        animation.runImageAnimation(
        hero,
        assets.animation`hero-use-down`,
        200,
        false
        )
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    assets.animation`hero-walk-left`,
    100,
    true
    )
    heroFacing = "left"
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    animHeroWalkRight,
    100,
    true
    )
    heroFacing = "right"
})
function generateMap () {
    clearMap()
    for (let index = 0; index < 3; index++) {
        localHeight = widthPct(randint(20, 80))
        localWidth = widthPct(randint(20, 80))
        localX2 = widthPct(randint(0, 40))
        localY2 = widthPct(randint(0, 40))
        mapGen.generateTerrain(
        [
        assets.tile`transparency8`,
        assets.tile`tile-sand`,
        assets.tile`tile-sand`,
        assets.tile`tile-grass`,
        assets.tile`tile-grass`,
        assets.tile`tile-mountain`,
        assets.tile`tile-mountain`,
        assets.tile`tile-mountain`
        ],
        widthPct(16),
        true,
        localY2,
        localY2 + localHeight,
        localX2,
        localX2 + localWidth
        )
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    assets.animation`hero-walk-down`,
    100,
    true
    )
    heroFacing = "down"
})
function clearMap () {
    for (let localX = 0; localX <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns); localX++) {
        for (let localY = 0; localY <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows); localY++) {
            tiles.setTileAt(tiles.getTileLocation(localX, localY), assets.tile`tile-deep-ocean`)
        }
    }
}
let localY2 = 0
let localX2 = 0
let localWidth = 0
let localHeight = 0
let heroFacing = ""
let hero: Sprite = null
let animHeroUseRight: Image[] = []
let animHeroWalkRight: Image[] = []
tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`tilemap-tiny-island`))
generateMap()
animHeroWalkRight = assets.animation`hero-walk-left`
for (let localImage of animHeroWalkRight) {
    localImage.flipX()
}
animHeroUseRight = assets.animation`hero-use-left`
for (let localImage2 of animHeroUseRight) {
    localImage2.flipX()
}
let animSetHeroWalk = [
assets.animation`hero-walk-up`,
assets.animation`hero-walk-down`,
assets.animation`hero-walk-left`,
assets.animation`hero-walk-left`
]
hero = sprites.create(assets.image`blank`, SpriteKind.Player)
controller.moveSprite(hero, 96, 96)
scene.cameraFollowSprite(hero)
