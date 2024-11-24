namespace SpriteKind {
  export const Resource = SpriteKind.create()
  export const StatusBar = SpriteKind.create()
}
 
enum CharacterFacing {
  Up,
  Down,
  Left,
  Right
}

enum DefaultPaletteColor {
  Transparency = 0,
  White,
  Red,
  Pink,
  Orange,
  Yellow,
  Teal,
  Green,
  Blue,
  LightBlue,
  Purple,
  LightPurple,
  DarkPurple,
  Tan,
  Brown,
  Black
}

namespace Custom {  

  // ***** Map Generation *****
  //#region
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
  //#endregion

  // ***** Image Manipulation *****
  //#region

  const HERO_PSWAP = [
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

  export function colorSwap(image: Image, shift: number[]): Image {
    const clone = image.clone()
    for (let x = 0; x < clone.width; x++) {
      for (let y = 0; y < clone.height; y++) {
        const color = clone.getPixel(x, y)
        if (color != 0) {
          const newColor = shift[color]
          clone.setPixel(x, y, newColor)
        }
      }
    }
    return clone
  }

  export function colorSwapAnimation(anim: Image[], shift: number[]): Image[] {
    return anim.map(frame => colorSwap(frame, shift))
  }

  export function cloneRotate(source: Image): Image {
    const clone = image.create(source.height, source.width)
    for (let x = 0; x < source.width; x++) {
      for (let y = 0; y < source.height; y++) {
        clone.setPixel(source.height - y - 1, x, source.getPixel(x, y))
      }
    }
    return clone
  }
  //#endregion

  // ***** Status Bars *****
  //#region
  class StatusBar {
    public sprite: Sprite
    private _value: number
    private _max: number
    constructor(
      value: number,
      max: number,
      public color: number
    ) {
      this.sprite = sprites.create(assets.image`bar-base`, SpriteKind.StatusBar)
      this._max = max
      this.value = value
    }

    get value(): number {
      return this._value
    }

    set value(value: number) {
      this._value = value
      this.sprite.image.fillRect(1, 1, Math.floor(14 * value / this._max), 2, this.color)
    }

    get max(): number {
      return this._max
    }

    set max(max: number) {
      this._max = max
    }

    redraw() {
      const width = Math.min(Math.max(Math.floor(14 * this._value / this._max), 0), 14)
      if (width > 0) {
        this.sprite.image.fillRect(1, 1, width, 2, this.color)        
      }
      if (width < 14) {
        this.sprite.image.fillRect(1 + width, 1, 14 - width, 2, 0)
      }
    }
  }
  //#endregion

  // ***** Items *****
  //#region
  class DirectionalImageSet {
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

  const itemImages: DirectionalImageSet[] = []

  export function createDirectionalImages(name: string, base: Image, rotate: boolean) {
    itemImages.push(new DirectionalImageSet(name, base, rotate))
  }

  export function createItemSprite(sprite: Sprite, name: string): Sprite {
    const imageSet = itemImages.find(item => item.name == name)
    const facing = getCharacterAnimationStatus(sprite).facing
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
    const itemSprite = sprites.create(itemImage, SpriteKind.Resource)
    switch (facing) {
      case CharacterFacing.Up:
        itemSprite.x = sprite.x
        itemSprite.y = sprite.y - (sprite.height + itemSprite.height) / 2
        itemSprite.y += 1
        // itemSprite.vx = -24
        itemSprite.vy = -24
        break
      case CharacterFacing.Down:
        itemSprite.x = sprite.x
        itemSprite.y = sprite.y + (sprite.height + itemSprite.height) / 2
        itemSprite.y -= 1
        // itemSprite.vx = 24
        itemSprite.vy = 24
        break
      case CharacterFacing.Left:
        itemSprite.x = sprite.x - (sprite.width + itemSprite.width) / 2
        // itemSprite.x -= 1
        itemSprite.y = sprite.y
        // itemSprite.vx = -24
        itemSprite.vy = 24
        break
      case CharacterFacing.Right:
        itemSprite.x = sprite.x + (sprite.width + itemSprite.width) / 2
        // itemSprite.x += 1
        itemSprite.y = sprite.y
        // itemSprite.vx = 24
        itemSprite.vy = 24
        break
    }
    // itemSprite.fx = 128
    itemSprite.fy = 128
    setTimeout(function () { itemSprite.destroy() }, 300)
    return itemSprite
  }
  //#endregion

  // ***** Character Animation *****
  //#region
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

  class CharacterAnimationStatus {
    public actionTimers: number[] = []
    public locked: boolean = false
    constructor(
      public sprite: Sprite,
      public name: string,
      public facing: CharacterFacing,
      public action: string,
    ) {}
  }

  const characterAnims: CharacterAnimation[] = []
  const characters: CharacterAnimationStatus[] = []

  sprites.onDestroyed(SpriteKind.Enemy, function (sprite: Sprite) {
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].sprite == sprite) {
        characters.splice(i, 1)
        return
      }
    }
  })
  
  export function createAnimation(name: string, action: string, up: Image[], down: Image[], left: Image[]) {
    characterAnims.push(new CharacterAnimation(
      name,
      action,
      colorSwapAnimation(up, HERO_PSWAP),
      colorSwapAnimation(down, HERO_PSWAP),
      colorSwapAnimation(left, HERO_PSWAP)
    ))
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

  function getCharacterAnimationStatus(sprite: Sprite): CharacterAnimationStatus {
    return characters.find(character => character.sprite == sprite)
  }

  export function createCharacter(sprite: Sprite, name: string) {
    characters.push(new CharacterAnimationStatus(sprite, name, randint(0, 3), 'stand'))
    startAction(sprite, 'stand')
  }

  export function changeFacing(sprite: Sprite, facing: CharacterFacing) {
    const props = getCharacterAnimationStatus(sprite)
    if (facing != props.facing) {
      props.facing = facing
    }
  }

  export function restartAction(sprite: Sprite) {
    const props = getCharacterAnimationStatus(sprite)
    startAction(sprite, props.action)
  }

  export function addActionTimedEvent(
    sprite: Sprite,
    timeout: number,
    callback: (sprite: Sprite) => void
  ) {
    const props = getCharacterAnimationStatus(sprite)    
    props.actionTimers.push(setTimeout(function () {
      callback(sprite)      
    }, timeout))
  }

  function clearActionTimers(sprite: Sprite) {
    const props = getCharacterAnimationStatus(sprite)
    for (const timer of props.actionTimers) {
      clearTimeout(timer)
    }
    props.actionTimers = []
  }

  export function startAction(sprite: Sprite, action: string, lock: boolean = false): boolean {
    const props = getCharacterAnimationStatus(sprite)
    if(props.locked) return false
    clearActionTimers(sprite)
    props.action = action
    switch (action) {
      case 'stand':
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        sprite.setImage(getAnimation(props.name, 'walk', props.facing)[1])
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
        if (lock) {
          props.locked = true
          addActionTimedEvent(
            sprite,
            actionAnimation.length * 200,
            function (sprite: Sprite) {
              const props = getCharacterAnimationStatus(sprite)
              props.locked = false
            }
          )
        }
        break
    }
    return true
  }
  //#endregion

  // ***** Controller *****
  //#region
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
  //#endregion
}

