export interface SlotType {
    type: string
    no_dlc?: string[]
    pool?: string[] | string[][]
    one?: number[]
    two?: number[]
    handicaps?: number[]
    colour?: string
    handicap?: number
    handicapSet?: number
    count?: number
    orig_pool?: string[] | string[][]
}

export const slotTypes: SlotType[] = [
    {
        type: 'chest',
        no_dlc: ['inkling_chest', 'snake_chest', 'wiifit_chest', 'bayonetta_chest'],
        pool: ['inkling_chest', 'joker_chest', 'snake_chest', 'wiifit_chest', 'bayonetta_chest', 'sora_chest'],
    },
    {
        type: 'chance',
        no_dlc: ['gandw_chance', 'pacman_chance', 'duckhunt_chance', 'wario_chance', 'rosalina_chance'],
        pool: ['gandw_chance', 'hero_chance', 'pacman_chance', 'duckhunt_chance', 'wario_chance', 'rosalina_chance'],
    },
    { type: 'go' },
    { type: 'visiting', no_dlc: ['rob'], pool: ['steve', 'kazuya', 'rob'] },
    { type: 'banned' },
    { type: 'tobanned' },
    { type: 'free' },
    {
        type: 'lowtiertax',
        no_dlc: ['littlemac', 'drmario', 'iceclimbers'],
        pool: ['littlemac', 'drmario', 'iceclimbers', 'banjo'],
    },
    {
        type: 'lametax',
        no_dlc: ['megaman', 'olimar', 'sonic'],
        pool: ['megaman', 'olimar', 'sonic', 'minmin'],
    },
    {
        type: 'utility',
        pool: [
            ['bowser', 'bowserjr'],
            ['simon', 'richter'],
        ],
        one: [0, 0, 10, 10, 20, 20, 30, 30, 40, 40, 50, 50, 60],
        two: [0, 0, 20, 30, 40, 50, 60, 60, 80, 80, 100, 100, 125],
    },
    {
        type: 'station',
        no_dlc: [
            'chrom_station',
            'corrin_station',
            'ike_station',
            'lucina_station',
            'marth_station',
            'robin_station',
            'roy_station',
        ],
        pool: [
            'byleth_station',
            'chrom_station',
            'corrin_station',
            'ike_station',
            'lucina_station',
            'marth_station',
            'robin_station',
            'roy_station',
        ],
        handicaps: [0, 20, 40, 80, 150],
    },
    {
        type: 'brown',
        colour: '#965336',
        pool: [
            ['villager', 'isabelle'],
            ['ken', 'ryu'],
        ],
        handicap: 10,
        handicapSet: 20,
    },
    {
        type: 'lightblue',
        colour: '#aae0fa',
        pool: [
            ['fox', 'falco', 'wolf'],
            ['pit', 'darkpit', 'palutena'],
        ],
        handicap: 20,
        handicapSet: 30,
    },
    {
        type: 'pink',
        colour: '#d93a96',
        no_dlc: ['kirby', 'kingdedede', 'metaknight'],
        pool: [
            ['kirby', 'kingdedede', 'metaknight'],
            ['shulk', 'mythra', 'pyra'],
        ],
        handicap: 30,
        handicapSet: 50,
    },
    {
        type: 'orange',
        colour: '#f7941d',
        pool: [
            ['samus', 'zss', 'ridley', 'darksamus'],
            ['donkeykong', 'diddykong', 'krool'],
        ],
        handicap: 40,
        handicapSet: 60,
    },
    {
        type: 'red',
        colour: '#ed1b24',
        no_dlc: ['mario', 'peach', 'daisy', 'yoshi', 'luigi'],
        pool: ['mario', 'peach', 'plant', 'daisy', 'yoshi', 'luigi'],
        handicap: 50,
        handicapSet: 80,
    },
    {
        type: 'yellow',
        colour: '#fef200',
        pool: [
            'pichu',
            'pikachu',
            'jigglypuff',
            'charizard',
            'ivysaur',
            'squirtle',
            'mewtwo',
            'incineroar',
            'greninja',
            'lucario',
        ],
        handicap: 60,
        handicapSet: 100,
    },
    {
        type: 'green',
        colour: '#1fb25a',
        pool: ['ganondorf', 'link', 'toonlink', 'younglink', 'zelda', 'sheik'],
        handicap: 80,
        handicapSet: 125,
    },
    {
        type: 'blue',
        colour: '#0072bb',
        no_dlc: ['ness', 'lucas'],
        pool: [
            ['cloud', 'sephiroth'],
            ['ness', 'lucas'],
        ],
        handicap: 100,
        handicapSet: 150,
    },
]
