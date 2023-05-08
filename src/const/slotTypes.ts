import { SlotTypeName } from './type/SlotTypeName.enum.ts'
import {
    RegularSlotType,
    SlotBanned,
    SlotChance,
    SlotChest,
    SlotFree,
    SlotLameTax,
    SlotLowTierTax,
    SlotStart,
    SlotStation,
    SlotToBanned,
    SlotType,
    SlotUtility,
    SlotVisiting,
} from './type'
import { Chest } from './type/Chest.enum.ts'
import { Chance } from './type/Chance.enum.ts'
import { Character } from './type/Character.enum.ts'
import { Station } from './type/Station.enum.ts'

const slotChest: SlotChest = {
    type: SlotTypeName.chest,
    no_dlc: [Chest.inkling_chest, Chest.snake_chest, Chest.wiifit_chest, Chest.bayonetta_chest],
    pool: [
        Chest.inkling_chest,
        Chest.joker_chest,
        Chest.snake_chest,
        Chest.wiifit_chest,
        Chest.bayonetta_chest,
        Chest.sora_chest,
    ],
}
const slotChance: SlotChance = {
    type: SlotTypeName.chance,
    no_dlc: [
        Chance.gandw_chance,
        Chance.pacman_chance,
        Chance.duckhunt_chance,
        Chance.wario_chance,
        Chance.rosalina_chance,
    ],
    pool: [
        Chance.gandw_chance,
        Chance.hero_chance,
        Chance.pacman_chance,
        Chance.duckhunt_chance,
        Chance.wario_chance,
        Chance.rosalina_chance,
    ],
}
const slotStart: SlotStart = { type: SlotTypeName.go }
const slotVisiting: SlotVisiting = {
    type: SlotTypeName.visiting,
    no_dlc: [Character.rob],
    pool: [Character.steve, Character.kazuya, Character.rob],
}
const slotBanned: SlotBanned = { type: SlotTypeName.banned }
const slotToBanned: SlotToBanned = { type: SlotTypeName.tobanned }
const slotFree: SlotFree = { type: SlotTypeName.free }
const slotLowTierTax: SlotLowTierTax = {
    type: SlotTypeName.lowtiertax,
    no_dlc: [Character.little_mac, Character.dr_mario, Character.ice_climbers],
    pool: [Character.little_mac, Character.dr_mario, Character.ice_climbers, Character.banjo_and_kazooie],
}
const slotLameTax: SlotLameTax = {
    type: SlotTypeName.lametax,
    no_dlc: [Character.mega_man, Character.olimar, Character.sonic],
    pool: [Character.mega_man, Character.olimar, Character.sonic, Character.minmin],
}
const slotUtility: SlotUtility = {
    type: SlotTypeName.utility,
    pool: [
        [Character.bowser, Character.bowser_jr],
        [Character.simon, Character.richter],
    ],
    no_dlc: [
        [Character.bowser, Character.bowser_jr],
        [Character.simon, Character.richter],
    ],
    one: [0, 0, 10, 10, 20, 20, 30, 30, 40, 40, 50, 50, 60],
    two: [0, 0, 20, 30, 40, 50, 60, 60, 80, 80, 100, 100, 125],
}
const slotStation: SlotStation = {
    type: SlotTypeName.station,
    no_dlc: [
        Station.chrom_station,
        Station.corrin_station,
        Station.ike_station,
        Station.lucina_station,
        Station.marth_station,
        Station.robin_station,
        Station.roy_station,
    ],
    pool: [
        Station.byleth_station,
        Station.chrom_station,
        Station.corrin_station,
        Station.ike_station,
        Station.lucina_station,
        Station.marth_station,
        Station.robin_station,
        Station.roy_station,
    ],
    handicaps: [0, 20, 40, 80, 150],
}
const brownSlot: RegularSlotType = {
    type: SlotTypeName.brown,
    colour: '#965336',
    pool: [
        [Character.villager, Character.isabelle],
        [Character.ken, Character.ryu],
    ],
    no_dlc: [
        [Character.villager, Character.isabelle],
        [Character.ken, Character.ryu],
    ],
    handicap: 10,
    handicapSet: 20,
}
const lightBlueSlot: RegularSlotType = {
    type: SlotTypeName.lightblue,
    colour: '#aae0fa',
    pool: [
        [Character.fox, Character.falco, Character.wolf],
        [Character.pit, Character.dark_pit, Character.palutena],
    ],
    no_dlc: [
        [Character.fox, Character.falco, Character.wolf],
        [Character.pit, Character.dark_pit, Character.palutena],
    ],
    handicap: 20,
    handicapSet: 30,
}
const slotPink: RegularSlotType = {
    type: SlotTypeName.pink,
    colour: '#d93a96',
    no_dlc: [Character.kirby, Character.king_dedede, Character.meta_knight],
    pool: [
        [Character.kirby, Character.king_dedede, Character.meta_knight],
        [Character.shulk, Character.mythra, Character.pyra],
    ],
    handicap: 30,
    handicapSet: 50,
}
const slotOrange: RegularSlotType = {
    type: SlotTypeName.orange,
    colour: '#f7941d',
    pool: [
        [Character.samus, Character.zero_suit_samus, Character.ridley, Character.dark_samus],
        [Character.donkey_kong, Character.diddy_kong, Character.king_k_rool],
    ],
    no_dlc: [
        [Character.samus, Character.zero_suit_samus, Character.ridley, Character.dark_samus],
        [Character.donkey_kong, Character.diddy_kong, Character.king_k_rool],
    ],
    handicap: 40,
    handicapSet: 60,
}
const slotRed: RegularSlotType = {
    type: SlotTypeName.red,
    colour: '#ed1b24',
    no_dlc: [Character.mario, Character.peach, Character.daisy, Character.yoshi, Character.luigi],
    pool: [
        Character.mario,
        Character.peach,
        Character.piranha_plant,
        Character.daisy,
        Character.yoshi,
        Character.luigi,
    ],
    handicap: 50,
    handicapSet: 80,
}
const yellowSlot: RegularSlotType = {
    type: SlotTypeName.yellow,
    colour: '#fef200',
    pool: [
        Character.pichu,
        Character.pikachu,
        Character.jigglypuff,
        Character.charizard,
        Character.ivysaur,
        Character.squirtle,
        Character.mewtwo,
        Character.incineroar,
        Character.greninja,
        Character.lucario,
    ],
    no_dlc: [
        Character.pichu,
        Character.pikachu,
        Character.jigglypuff,
        Character.charizard,
        Character.ivysaur,
        Character.squirtle,
        Character.mewtwo,
        Character.incineroar,
        Character.greninja,
        Character.lucario,
    ],
    handicap: 60,
    handicapSet: 100,
}
const greenSlot: RegularSlotType = {
    type: SlotTypeName.green,
    colour: '#1fb25a',
    pool: [
        Character.ganondorf,
        Character.link,
        Character.toon_link,
        Character.young_link,
        Character.zelda,
        Character.sheik,
    ],
    no_dlc: [
        Character.ganondorf,
        Character.link,
        Character.toon_link,
        Character.young_link,
        Character.zelda,
        Character.sheik,
    ],
    handicap: 80,
    handicapSet: 125,
}
const blueSlot: RegularSlotType = {
    type: SlotTypeName.blue,
    colour: '#0072bb',
    no_dlc: [Character.ness, Character.lucas],
    pool: [
        [Character.cloud, Character.sephiroth],
        [Character.ness, Character.lucas],
    ],
    handicap: 100,
    handicapSet: 150,
}

export const slotTypes: SlotType[] = [
    slotChest,
    slotChance,
    slotStart,
    slotVisiting,
    slotBanned,
    slotToBanned,
    slotFree,
    slotLowTierTax,
    slotLameTax,
    slotUtility,
    slotStation,
    brownSlot,
    lightBlueSlot,
    slotPink,
    slotOrange,
    slotRed,
    yellowSlot,
    greenSlot,
    blueSlot,
]
