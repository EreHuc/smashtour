import { Sprite } from './Sprite.ts'

export class Series extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/series/${name}.png`
        super(name, image)
    }
}
