import { Sprite } from './Sprite.ts'

export class Station extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/station/${name}.png`)
    }
}
