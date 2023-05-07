import { Sprite } from './Sprite.ts'

export class ChestCard extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/cards/chest/CC ${name}.jpg`
        super(`chest_${name}`, image)
    }
}
