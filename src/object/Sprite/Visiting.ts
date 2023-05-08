import { Sprite } from './Sprite.ts'

export class Visiting extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/visiting/${name}.jpg`)
    }
}
