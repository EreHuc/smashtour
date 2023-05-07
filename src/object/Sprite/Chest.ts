import { Sprite } from './Sprite.ts'

export class Chest extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/chest/${name}.png`
        super(`chance_${name}`, image)
    }
}
