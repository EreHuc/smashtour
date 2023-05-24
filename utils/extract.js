const { exec } = require('child_process')
const { writeFile } = require('fs/promises')
const { join } = require('path')
const { pathToFileURL } = require('node:url')

const slotTypes = [
    {
        type: 'chest',
        no_dlc: ['inkling', 'snake', 'wiifit', 'bayonetta'],
        pool: ['inkling', 'joker', 'snake', 'wiifit', 'bayonetta', 'sora'],
    },
    {
        type: 'chance',
        no_dlc: ['gandw', 'pacman', 'duckhunt', 'wario', 'rosalina'],
        pool: ['gandw', 'hero', 'pacman', 'duckhunt', 'wario', 'rosalina'],
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
        no_dlc: ['chrom', 'corrin', 'ike', 'lucina', 'marth', 'robin', 'roy'],
        pool: ['byleth', 'chrom', 'corrin', 'ike', 'lucina', 'marth', 'robin', 'roy'],
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
const seriesNames = [
    { name: 'animalcrossing', characters: ['villager', 'isabelle'] },
    { name: 'donkeykong', characters: ['donkeykong', 'diddykong', 'krool'] },
    { name: 'finalfantasy', characters: ['cloud', 'sephiroth'] },
    { name: 'kirby', characters: ['kirby', 'kingdedede', 'metaknight'] },
    {
        name: 'mario',
        characters: ['mario', 'peach', 'plant', 'daisy', 'yoshi', 'luigi'],
    },
    { name: 'metroid', characters: ['samus', 'zss', 'ridley', 'darksamus'] },
    { name: 'mother', characters: ['ness', 'lucas'] },
    { name: 'palutena', characters: ['pit', 'darkpit', 'palutena'] },
    {
        name: 'pokemon',
        characters: [
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
    },
    { name: 'starfox', characters: ['fox', 'falco', 'wolf'] },
    { name: 'streetfighter', characters: ['ken', 'ryu'] },
    { name: 'xenoblade', characters: ['shulk', 'mythra', 'pyra'] },
    {
        name: 'zelda',
        characters: ['ganondorf', 'link', 'toonlink', 'younglink', 'zelda', 'sheik'],
    },
]
const communityChests = [
    { fileIndex: 1, targetIndex: 0 },
    { fileIndex: 2, playerText: 'Free hit on each opponent!' },
    { fileIndex: 3, handicapIncrease: 50 },
    { fileIndex: 4, gotoProperty: 'toptier' },
    { fileIndex: 5, type: 'lightblue' },
    { fileIndex: 6, type: 'pink' },
    { fileIndex: 7, type: 'orange' },
    { fileIndex: 8, type: 'red' },
    { fileIndex: 9, type: 'yellow' },
    { fileIndex: 10, type: 'green' },
    { fileIndex: 11, type: 'blue' },
    { fileIndex: 12, type: 'brown' },
    { fileIndex: 13, banned: true },
    { fileIndex: 14, targetIndex: 20 },
    { fileIndex: 15, showChest: true },
]
const chances = [
    { fileIndex: 1, playerText: 'Pick stage!' },
    { fileIndex: 2, targetIndex: -3 },
    { fileIndex: 3, goto: 'station' },
    { fileIndex: 4, text: 'Pokeballs on!' },
    { fileIndex: 5, text: 'Assist Trophies on!' },
    { fileIndex: 6, text: 'Launch rate to 1.5x!' },
    { fileIndex: 7, text: 'Random stage!' },
    { fileIndex: 8, playerText: 'Play as random!' },
    { fileIndex: 9, text: 'Final Smash Meter on!' },
    { fileIndex: 10, banned: true },
    { fileIndex: 11, showChance: true },
    { fileIndex: 12, goto: 'yellow' },
    { fileIndex: 13, gotoProperty: 'heavy' },
    { fileIndex: 14, goto: 'lowtiertax' },
    { fileIndex: 15, text: 'Items on high!' },
]
const playerTokens = [
    'parking_token',
    'assisttrophey',
    'bobomb',
    'crate',
    'football',
    'freezie',
    'hammer',
    'homerunbat',
    'launchstar',
    'maximtomato',
    'mushroom',
    'pokeball',
    'sandbag',
    'smartbomb',
    'smashball',
    'spiny',
]

function generateUrl() {
    const slotTypesImg = slotTypes.flatMap((slotType) => {
        if (slotType.pool) {
            const folder = ['station', 'chest', 'chance', 'visiting'].includes(slotType.type) ? slotType.type : 'slots'
            let extension = folder === 'slots' ? 'webp' : 'jpg'
            if (['chest', 'chance', 'station'].includes(slotType.type)) {
                extension = 'png'
            }
            return slotType.pool.flatMap((poolItem) => {
                if (Array.isArray(poolItem)) {
                    return poolItem.map((innerPool) => folder + '/' + innerPool + '.' + extension)
                } else {
                    return [folder + '/' + poolItem + '.' + extension]
                }
            })
        }
        return []
    })
    const seriesNameImg = seriesNames.map((series) => 'img/series/' + series.name + '.png')
    const communityChestImg = communityChests.map((chest) => 'cards/chest/CC ' + chest.fileIndex + '.jpg')
    const chancesImg = chances.map((chance) => 'cards/chance/CHANCE ' + chance.fileIndex + '.jpg')
    const playerTokenImg = playerTokens.map((token) => 'tokens/' + token + '.png')
    const images = ['<base href="https://smashmonopoly.com/">']
        .concat(
            [...slotTypesImg, ...seriesNameImg, ...communityChestImg, ...chancesImg, ...playerTokenImg].map(
                (img) => `<img alt="${img}" src="${img}">`
            )
        )
        .join('\n')
        .trim()

    writeFile(join(__dirname, 'images.html'), images).then((file) => {
        console.log(join(process.cwd(), '..'), join('.', 'smashmonopoly.com', 'images.txt'))
        console.log(pathToFileURL(join(__dirname, 'images.txt')).href)
        // exec(`wget -i ./${join('.','smashmonopoly.com', 'images.txt')} --wait=20 --limit-rate=20K`, {cwd: join(process.cwd(), '..')}, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`exec error: ${error}`);
        //     return;
        //   }
        //   console.log(`stdout: ${stdout}`);
        //   console.error(`stderr: ${stderr}`);
        // })
    })
}

generateUrl()
