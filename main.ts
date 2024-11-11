namespace SpriteKind {
    export const StatusBar = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    showMinimap = !(showMinimap)
    if (showMinimap) {
        myMinimap.setFlag(SpriteFlag.Invisible, false)
    } else {
        myMinimap.setFlag(SpriteFlag.Invisible, true)
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    animHeroWalkLeft,
    100,
    true
    )
})
controller.right.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.All, hero)
})
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    animation.stopAnimation(animation.AnimationTypes.All, hero)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    animation.runImageAnimation(
    hero,
    animHeroWalkRight,
    100,
    true
    )
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
let showMinimap = false
let myMinimap: Sprite = null
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
controller.moveSprite(hero, 96, 96)
scene.cameraFollowSprite(hero)
myMinimap = sprites.create(minimap.getImage(minimap.minimap(MinimapScale.Eighth, 2, 15)), SpriteKind.Player)
myMinimap.setStayInScreen(true)
myMinimap.setFlag(SpriteFlag.Invisible, true)
showMinimap = false
