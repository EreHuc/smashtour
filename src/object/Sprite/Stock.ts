import { Sprite } from './Sprite.ts'

export class Stock extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/stock/${name}.png`
        super(name, image)
    }
}
