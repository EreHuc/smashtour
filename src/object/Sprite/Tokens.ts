import { Sprite } from './Sprite.ts'

export class Tokens extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/tokens/${name}.png`
        super(name, image)
    }
}
