import { Sprite } from './Sprite.ts'

export class Chance extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/chance/${name}.png`)
    }
}
