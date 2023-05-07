import { Sprite } from './Sprite.ts'

export class Chance extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/chance/${name}.png`
        super(name, image)
    }
}
