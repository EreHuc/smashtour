import { Characters, Square } from '../type'
import { GameError } from '../utils'
import { pokemons, topTiers, heavies, squareList, marios } from '../const'

export class GameSettings {
    readonly bgColor = '#cde6d0'
    readonly rule = 'random'
    readonly squareList: Square[] = squareList
    readonly pokemons: Characters[] = pokemons
    readonly marios: Characters[] = marios
    readonly topTiers: Characters[] = topTiers
    readonly heavies: Characters[] = heavies
    private _debug = false
    get debug() {
        return this._debug
    }
    set debug(val: boolean) {
        this._debug = val
    }

    constructor() {
        const topTierList = document.querySelector<HTMLUListElement>('ul#top_tier_list')
        if (!topTierList) {
            throw new GameError('missing top tier list in settings')
        }

        topTierList.innerHTML = this.topTiers.map((topTier) => `<li>${topTier.split('_').join(' ')}</li>`).join('\n')
    }
}
