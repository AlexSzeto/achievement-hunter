namespace SpriteKind {
  export const Interaction = SpriteKind.create()
}

enum CharacterFacing {
  Up,
  Down,
  Left,
  Right
}

namespace Custom {  

  //
  // ***** Map Generation *****
  //
  function widthPct(percent: number): number {
    return Math.floor(tileUtil.currentTilemap().width * percent / 100)
  }

  //% group="Map"
  //% block="reset map"
  export function resetMap() {
    seededRandom.reset(randint(0, 10000))
    const currentTilemap = tileUtil.currentTilemap()
    for (let x = 0; x <= currentTilemap.width; x++) {
      for (let y = 0; y <= currentTilemap.height; y++) {
        tiles.setTileAt(tiles.getTileLocation(x, y), assets.tile`tile-deep-ocean`)
      }
    }
  }

  //% group="Map"
  //% block="create island"
  export function createIsland() {
    for (let section = 0; section < 1; section++) {
      const x = Math.getSeededRandInt(0, 20)
      const y = Math.getSeededRandInt(0, 20)
      mapGen.generateTerrain(
        [
          assets.tile`transparency8`,
          assets.tile`tile-sand`,
          assets.tile`tile-grass`,
          assets.tile`tile-grass`,
          assets.tile`tile-grass`,
          assets.tile`tile-grass`,
          assets.tile`tile-grass`,
          assets.tile`tile-grass`
        ],
        widthPct(45),
        true,
        widthPct(y),
        widthPct(y + 80),
        widthPct(x),
        widthPct(x + 80)
      )
    }
  }

  //
  // ***** Items *****
  //
  export function cloneRotate(source: Image): Image {
    const clone = image.create(source.height, source.width)
    for (let x = 0; x < source.width; x++) {
      for (let y = 0; y < source.height; y++) {
        clone.setPixel(source.height - y - 1, x, source.getPixel(x, y))
      }
    }
    return clone
  }

  class ItemImageSet {
    public up: Image
    public down: Image
    public left: Image
    public right: Image    
    constructor(
      public name: string,
      base: Image,
      rotate: boolean
    ) {
      this.up = base
      if (rotate) {
        this.right = cloneRotate(base)
        this.right.flipY()
        this.down = base.clone()
        this.down.flipY()
        this.down.flipX()
        this.left = this.right.clone()
        this.left.flipX()
      } else {
        this.right = base
        this.down = base
        this.left = base
      }
    }
  }

  const itemImages: ItemImageSet[] = []

  export function createItemImages(name: string, base: Image, rotate: boolean) {
    itemImages.push(new ItemImageSet(name, base, rotate))
  }

  export function createItemSprite(sprite: Sprite, name: string): Sprite {
    const imageSet = itemImages.find(item => item.name == name)
    const facing = getCharacterProperties(sprite).facing
    let itemImage: Image
    switch (facing) {
      case CharacterFacing.Up:
        itemImage = imageSet.up
        break
      case CharacterFacing.Down:
        itemImage = imageSet.down
        break
      case CharacterFacing.Left:
        itemImage = imageSet.left
        break
      case CharacterFacing.Right:
        itemImage = imageSet.right
        break
    }
    const itemSprite = sprites.create(itemImage, SpriteKind.Interaction)
    switch (facing) {
      case CharacterFacing.Up:
        itemSprite.x = sprite.x
        itemSprite.y = sprite.y - (sprite.height + itemSprite.height) / 2
        itemSprite.vy = -24
        break
      case CharacterFacing.Down:
        itemSprite.x = sprite.x
        itemSprite.y = sprite.y + (sprite.height + itemSprite.height) / 2
        itemSprite.vy = 24
        break
      case CharacterFacing.Left:
        itemSprite.x = sprite.x - (sprite.width + itemSprite.width) / 2
        itemSprite.y = sprite.y
        itemSprite.vy = 24
        break
      case CharacterFacing.Right:
        itemSprite.x = sprite.x + (sprite.width + itemSprite.width) / 2
        itemSprite.y = sprite.y
        itemSprite.vy = 24
        break
    }
    itemSprite.fy = 128
    setTimeout(function () { itemSprite.destroy() }, 400)
    return itemSprite
  }

  //
  // ***** Character Animation *****
  //
  class CharacterAnimation {
    public right: Image[]
    constructor(
      public name: string,
      public action: string,
      public up: Image[],
      public down: Image[],
      public left: Image[],
    ) {
      this.right = left.map(frame => {
        const clone = frame.clone()
        clone.flipX()
        return clone
      })
    }
  }

  class CharacterProperties {
    public actionTimers: number[] = []
    constructor(
      public sprite: Sprite,
      public name: string,
      public facing: CharacterFacing,
      public action: string,
    ) {}
  }

  const characterAnims: CharacterAnimation[] = []
  const characters: CharacterProperties[] = []

  export function createAnimation(name: string, action: string, up: Image[], down: Image[], left: Image[]) {
    characterAnims.push(new CharacterAnimation(name, action, up, down, left))
  }

  function getAnimation(name: string, action: string, facing: CharacterFacing): Image[] {
    const anim = characterAnims.find(anim => anim.name == name && anim.action == action)
    switch (facing) {
      case CharacterFacing.Up:
        return anim.up
      case CharacterFacing.Down:
        return anim.down
      case CharacterFacing.Left:
        return anim.left
      case CharacterFacing.Right:
        return anim.right
    }
  }

  function getCharacterProperties(sprite: Sprite): CharacterProperties {
    return characters.find(character => character.sprite == sprite)
  }

  export function createCharacter(sprite: Sprite, name: string) {
    characters.push(new CharacterProperties(sprite, name, randint(0, 3), 'stand'))
    startAction(sprite, 'stand')
  }

  export function changeFacing(sprite: Sprite, facing: CharacterFacing) {
    const props = getCharacterProperties(sprite)
    if (facing != props.facing) {
      props.facing = facing
    }
  }

  export function restartAction(sprite: Sprite) {
    const props = getCharacterProperties(sprite)
    startAction(sprite, props.action)
  }

  export function addActionTimedEvent(
    sprite: Sprite,
    timeout: number,
    callback: (sprite: Sprite) => void
  ) {
    const props = getCharacterProperties(sprite)    
    props.actionTimers.push(setTimeout(function () {
      callback(sprite)      
    }, timeout))
  }

  function clearActionTimers(sprite: Sprite) {
    const props = getCharacterProperties(sprite)
    for (const timer of props.actionTimers) {
      clearTimeout(timer)
    }
    props.actionTimers = []
  }

  export function startAction(sprite: Sprite, action: string) {
    clearActionTimers(sprite)
    const props = getCharacterProperties(sprite)
    props.action = action
    switch (action) {
      case 'stand':
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        sprite.setImage(getAnimation(props.name, 'walk', props.facing)[0])
        break
      case 'walk':
        animation.runImageAnimation(
          sprite,
          getAnimation(props.name, 'walk', props.facing),
          200,
          true
        )
        break
      default:
        const actionAnimation = getAnimation(props.name, action, props.facing)
        animation.runImageAnimation(
          sprite,
          actionAnimation,
          200,
          false
        )
        break
    }
  }

  //
  // ***** Controller *****
  //
  let controlledSprite: Sprite = null

  export function startControlCharacter(sprite: Sprite) {
    controlledSprite = sprite
  }

  function updateCharacterMovement() {
    if (!controlledSprite) return

    if(controller.left.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Left)
      startAction(controlledSprite, 'walk')
    } else if (controller.right.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Right)
      startAction(controlledSprite, 'walk')
    } else if (controller.up.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Up)
      startAction(controlledSprite, 'walk')
    } else if (controller.down.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Down)
      startAction(controlledSprite, 'walk')
    } else {
      startAction(controlledSprite, 'stand')
    }
  }

  controller.left.onEvent(ControllerButtonEvent.Pressed, updateCharacterMovement)
  controller.right.onEvent(ControllerButtonEvent.Pressed, updateCharacterMovement)
  controller.up.onEvent(ControllerButtonEvent.Pressed, updateCharacterMovement)
  controller.down.onEvent(ControllerButtonEvent.Pressed, updateCharacterMovement)

  controller.left.onEvent(ControllerButtonEvent.Released, updateCharacterMovement)
  controller.right.onEvent(ControllerButtonEvent.Released, updateCharacterMovement)
  controller.up.onEvent(ControllerButtonEvent.Released, updateCharacterMovement)
  controller.down.onEvent(ControllerButtonEvent.Released, updateCharacterMovement)
}

