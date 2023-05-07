import { Sprite } from './Sprite.ts'

export class Station extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/station/${name}.png`
        super(name, image)
    }
}
