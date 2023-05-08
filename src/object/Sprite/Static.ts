import { Sprite } from './Sprite.ts'

export class Static extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/${name}.png`)
    }
}
