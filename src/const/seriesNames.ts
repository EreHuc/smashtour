import { Character } from './type/Character.enum.ts'
import { Series } from './type/Series.enum.ts'

export interface SeriesName {
    name: Series
    characters: Character[]
}

export const seriesNames: SeriesName[] = [
    { name: Series.animalcrossing_series, characters: [Character.villager, Character.isabelle] },
    {
        name: Series.donkeykong_series,
        characters: [Character.donkey_kong, Character.diddy_kong, Character.king_k_rool],
    },
    { name: Series.finalfantasy_series, characters: [Character.cloud, Character.sephiroth] },
    { name: Series.kirby_series, characters: [Character.kirby, Character.king_dedede, Character.meta_knight] },
    {
        name: Series.mario_series,
        characters: [
            Character.mario,
            Character.peach,
            Character.piranha_plant,
            Character.daisy,
            Character.yoshi,
            Character.luigi,
        ],
    },
    {
        name: Series.metroid_series,
        characters: [Character.samus, Character.zero_suit_samus, Character.ridley, Character.dark_samus],
    },
    { name: Series.mother_series, characters: [Character.ness, Character.lucas] },
    { name: Series.palutena_series, characters: [Character.pit, Character.dark_pit, Character.palutena] },
    {
        name: Series.pokemon_series,
        characters: [
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
    },
    { name: Series.starfox_series, characters: [Character.fox, Character.falco, Character.wolf] },
    { name: Series.streetfighter_series, characters: [Character.ken, Character.ryu] },
    { name: Series.xenoblade_series, characters: [Character.shulk, Character.mythra, Character.pyra] },
    {
        name: Series.zelda_series,
        characters: [
            Character.ganondorf,
            Character.link,
            Character.toon_link,
            Character.young_link,
            Character.zelda,
            Character.sheik,
        ],
    },
]
