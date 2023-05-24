import {
    bluePropertySquare,
    brownPropertySquare,
    chanceSquare,
    greenPropertySquare,
    jailSquare,
    lightBluePropertySquare,
    magentaPropertySquare,
    orangePropertySquare,
    parkingSquare,
    redPropertySquare,
    startSquare,
    stationSquare,
    taxSquare,
    toJailSquare,
    yellowPropertySquare,
} from '../const/square.ts'
import { Characters } from '../type'
import { GameError } from '../utils'

export class GameSettings {
    readonly bgColor = '#cde6d0'
    readonly rule = 'random'
    readonly squareList = [
        startSquare,
        brownPropertySquare,
        brownPropertySquare,
        brownPropertySquare,
        stationSquare,
        lightBluePropertySquare,
        lightBluePropertySquare,
        lightBluePropertySquare,
        jailSquare,
        magentaPropertySquare,
        magentaPropertySquare,
        magentaPropertySquare,
        stationSquare,
        orangePropertySquare,
        chanceSquare,
        orangePropertySquare,
        parkingSquare,
        redPropertySquare,
        chanceSquare,
        redPropertySquare,
        stationSquare,
        yellowPropertySquare,
        yellowPropertySquare,
        yellowPropertySquare,
        toJailSquare,
        greenPropertySquare,
        chanceSquare,
        greenPropertySquare,
        stationSquare,
        bluePropertySquare,
        taxSquare,
        bluePropertySquare,
    ]
    _debug = false
    get debug() {
        return this._debug
    }
    set debug(val: boolean) {
        this._debug = val
    }
    readonly pokemons: Characters[] = [
        Characters.charizard,
        Characters.incineroar,
        Characters.greninja,
        Characters.ivysaur,
        Characters.jigglypuff,
        Characters.lucario,
        Characters.mewtwo,
        Characters.pichu,
        Characters.pikachu,
        Characters.squirtle,
    ]

    readonly marios: Characters[] = [
        Characters.mario,
        Characters.luigi,
        Characters.peach,
        Characters.daisy,
        Characters.bowser,
        Characters.dr_mario,
        Characters.rosalina_and_luma,
        Characters.bowser_jr,
        Characters.piranha_plant,
    ]

    readonly topTiers: Characters[] = [
        Characters.jigglypuff,
        Characters.donkey_kong,
        Characters.chrom,
        Characters.hero,
        Characters.little_mac,
        Characters.piranha_plant,
        Characters.captain_falcon,
        Characters.ness,
        Characters.bowser,
        Characters.ike,
        Characters.pyra,
        Characters.mewtwo,
        Characters.sephiroth,
    ]

    readonly heavies: Characters[] = [
        Characters.bowser,
        Characters.king_k_rool,
        Characters.donkey_kong,
        Characters.king_dedede,
        Characters.ganondorf,
        Characters.charizard,
        Characters.incineroar,
        Characters.kazuya,
        Characters.piranha_plant,
    ]

    constructor() {
        const topTierList = document.querySelector<HTMLUListElement>('ul#top_tier_list')
        if (!topTierList) {
            throw new GameError('missing top tier list in settings')
        }

        topTierList.innerHTML = this.topTiers.map((topTier) => `<li>${topTier.split('_').join(' ')}</li>`).join('\n')
    }
}
