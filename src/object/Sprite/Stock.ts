import { Sprite } from './Sprite.ts'

export class Stock extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/stock/${name}.png`)
    }
}
