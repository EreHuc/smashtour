import { Sprite } from './Sprite.ts'

export class Chest extends Sprite {
    constructor(name: string) {
        super(`chance_${name}`, `./assets/img/chest/${name}.png`)
    }
}
