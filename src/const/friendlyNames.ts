import { Name } from './type'
import { Character } from './type/Character.enum.ts'
import { Chance } from './type/Chance.enum.ts'

export const friendlyNames: Record<Name, string> = {
    [Character.captain_falcon]: 'Captain Falcon',
    [Character.wii_fit_trainer]: 'Wii Fit Trainer',
    [Chance.gandw_chance]: 'Game & Watch',
    [Chance.duckhunt_chance]: 'Duck Hunt',
    [Chance.rosalina_chance]: 'Rosalina & Luma',
    [Character.little_mac]: 'Little Mac',
    [Character.dr_mario]: 'Dr Mario',
    [Character.ice_climbers]: 'Ice Climbers',
    [Character.banjo_and_kazooie]: 'Banjo & Kazooie',
    [Character.bowser_jr]: 'Bowser Jr',
    [Character.dark_pit]: 'Dark Pit',
    [Character.king_dedede]: 'King Dedede',
    [Character.meta_knight]: 'Meta Knight',
    [Character.zero_suit_samus]: 'Zero Suit Samus',
    [Character.dark_samus]: 'Dark Samus',
    [Character.donkey_kong]: 'Donkey Kong',
    [Character.diddy_kong]: 'Diddy Kong',
    [Character.king_k_rool]: 'King K. Rool',
    [Character.piranha_plant]: 'Piranha Plant',
    [Character.toon_link]: 'Toon Link',
    [Character.young_link]: 'Young Link',
    [Character.mega_man]: 'Mega Man',
    [Character.minmin]: 'Min Min',
} as Record<Name, string>
