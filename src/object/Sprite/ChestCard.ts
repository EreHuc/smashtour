import { Sprite } from './Sprite.ts'

export class ChestCard extends Sprite {
    constructor(name: string) {
        super(`chest_${name}`, `./assets/img/cards/chest/CC ${name}.jpg`)
    }
}
