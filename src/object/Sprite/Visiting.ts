import { Sprite } from './Sprite.ts'

export class Visiting extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/visiting/${name}.jpg`
        super(name, image)
    }
}
