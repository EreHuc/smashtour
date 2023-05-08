import { Sprite } from './Sprite.ts'

export class Tokens extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/tokens/${name}.png`)
    }
}
