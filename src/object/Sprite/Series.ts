import { Sprite } from './Sprite.ts'

export class Series extends Sprite {
    constructor(name: string) {
        super(name, `./assets/img/series/${name}.png`)
    }
}
