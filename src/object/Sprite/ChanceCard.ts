import { Sprite } from './Sprite.ts'

export class ChanceCard extends Sprite {
    constructor(name: string) {
        super(`chance_${name}`, `./assets/img/cards/chance/CHANCE ${name}.jpg`)
    }
}
