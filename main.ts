namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    assets.animation`hero-walk-up`,
    200,
    true
    )
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    animHeroWalkLeft,
    200,
    true
    )
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    animHeroWalkRight,
    200,
    true
    )
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
        hero,
        assets.animation`hero-use-left`,
        200,
        false
    )
    // hero.vx = -25
    // hero.fx = 50
})
function generateMap () {
    clearMap()
    for (let index = 0; index < 3; index++) {
        localHeight = mapSplit(randint(20, 80))
        localWidth = mapSplit(randint(20, 80))
        localX = mapSplit(randint(0, 40))
        localY = mapSplit(randint(0, 40))
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
        mapSplit(16),
        true,
        localY,
        localY + localHeight,
        localX,
        localX + localWidth
        )
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    assets.animation`hero-walk-down`,
    200,
    true
    )
})
function mapSplit (percent: number) {
    return percent / 100 * tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns)
}
function clearMap () {
    for (let localX = 0; localX <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Columns); localX++) {
        for (let localY = 0; localY <= tileUtil.tilemapProperty(tileUtil.currentTilemap(), tileUtil.TilemapProperty.Rows); localY++) {
            tiles.setTileAt(tiles.getTileLocation(localX, localY), assets.tile`tile-deep-ocean`)
        }
    }
}
let localY = 0
let localX = 0
let localWidth = 0
let localHeight = 0
let hero: Sprite = null
let animHeroWalkRight: Image[] = []
let animHeroWalkLeft: Image[] = []
tiles.setCurrentTilemap(tileUtil.createSmallMap(tilemap`tilemap-tiny-island`))
generateMap()
animHeroWalkLeft = assets.animation`hero-walk-left`
animHeroWalkRight = assets.animation`hero-walk-left`
for (let localImage of animHeroWalkRight) {
    localImage.flipX()
}
hero = sprites.create(assets.image`hero-standing`, SpriteKind.Player)
controller.moveSprite(hero, 48, 48)
scene.cameraFollowSprite(hero)
