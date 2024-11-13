enum CharacterFacing {
  Up,
  Down,
  Left,
  Right
}

enum CharacterAction {
  Stand,
  Walk,
  Use
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

  export function rotateClone(source: Image): Image {
    const clone = image.create(source.height, source.width)
    // Rotate 90 degrees counter-clockwise
    for (let x = 0; x < source.width; x++) {
      for (let y = 0; y < source.height; y++) {
        clone.setPixel(y, source.width - x - 1, source.getPixel(x, y))
      }
    }
    return clone
  }

  //
  // ***** Character Animation *****
  //
  class CharacterAnimation {
    public right: Image[]
    constructor(
      public name: string,
      public action: CharacterAction,
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
    constructor(
      public sprite: Sprite,
      public name: string,
      public facing: CharacterFacing,
      public action: CharacterAction
    ) {}
  }

  const characterAnims: CharacterAnimation[] = []
  const characters: CharacterProperties[] = []

  export function createAnimation(name: string, action: CharacterAction, up: Image[], down: Image[], left: Image[]) {
    characterAnims.push(new CharacterAnimation(name, action, up, down, left))
  }

  function getAnimation(name: string, action: CharacterAction, facing: CharacterFacing): Image[] {
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
    characters.push(new CharacterProperties(sprite, name, randint(0, 3), CharacterAction.Stand))
    startAction(sprite, CharacterAction.Stand)
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

  export function startAction(sprite: Sprite, action: CharacterAction) {
    const props = getCharacterProperties(sprite)
    props.action = action
    switch (action) {
      case CharacterAction.Stand:
        animation.stopAnimation(animation.AnimationTypes.All, sprite)
        sprite.setImage(getAnimation(props.name, CharacterAction.Walk, props.facing)[0])
        break
      default:
        animation.runImageAnimation(
          sprite,
          getAnimation(props.name, action, props.facing),
          200,
          action == CharacterAction.Walk
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
      startAction(controlledSprite, CharacterAction.Walk)
    } else if (controller.right.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Right)
      startAction(controlledSprite, CharacterAction.Walk)
    } else if (controller.up.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Up)
      startAction(controlledSprite, CharacterAction.Walk)
    } else if (controller.down.isPressed()) {
      changeFacing(controlledSprite, CharacterFacing.Down)
      startAction(controlledSprite, CharacterAction.Walk)
    } else {
      startAction(controlledSprite, CharacterAction.Stand)
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

