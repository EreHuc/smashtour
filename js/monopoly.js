let ctx
let processingRoll = false
let players = []
let playerColours = ['rgba(255,0,0)', 'rgba(0,0,255)', 'rgba(31, 178, 90)', 'rgba(247, 148, 29)']
let finishedAnimatingAction
let rollingPlayer

let gameSettings = {
    winCondition: 3,
    rounds: 1,
    over: false,
    losingCharacterIndex: undefined,
    upgradeCharacterIndex: undefined,
    recentWinner: undefined,
    chestCounter: 0,
    chanceCounter: 0,
    shuffleCards: true,
    dieResult: 0,
    currentlyAnimating: false,
    currentTurn: 0,
    matchSettings: [],
    dlc: true,
}

let standardWidth = 82.7,
    standardHeight = 127

let slotTypes = [
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

let seriesNames = [
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

let handicapBands = [300, 200, 150, 125, 100, 80, 60, 50, 40, 30, 20, 10, 0]
let heavies = ['bowser', 'krool', 'donkykong', 'kingdedede', 'ganondorf', 'charizard', 'incineroar']
let toptiers = ['pyra', 'mythra', 'pikachu', 'roy', 'palutena', 'wolf', 'peach', 'daisy']
let parkingCoords = [
    [2, 2],
    [24, 2],
    [2, 24],
    [102, 2],
    [2, 102],
    [102, 102],
    [60, 102],
    [45, 90],
    [90, 45],
    [102, 60],
]

let communityChests = [
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

let chances = [
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

let playerTokens = [
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

let friendlyNames = {
    falcon: 'Captain Falcon',
    wiifit: 'Wii Fit Trainer',
    gandw: 'Game & Watch',
    duckhunt: 'Duck Hunt',
    rosalina: 'Rosalina & Luma',
    littlemac: 'Little Mac',
    drmario: 'Dr Mario',
    iceclimbers: 'Ice Climbers',
    banjo: 'Banjo & Kazooie',
    bowserjr: 'Bowser Jr',
    darkpit: 'Dark Pit',
    kingdedede: 'King Dedede',
    metaknight: 'Meta Knight',
    zss: 'Zero Suit Samus',
    darksamus: 'Dark Samus',
    donkeykong: 'Donkey Kong',
    diddykong: 'Diddy Kong',
    krool: 'King K. Rool',
    plant: 'Piranha Plant',
    toonlink: 'Toon Link',
    younglink: 'Young Link',
    megaman: 'Mega Man',
    minmin: 'Min Min',
}

/* TODO
    - Resizable...?

    - Google analytics
 */

let images = { series: {} }

/** done in src/events/checkCanStart */
function checkCanStart() {
    let canStart = true
    if (!$('#player_0').val()) {
        canStart = false
    }
    if (!$('#player_0_icon').val()) {
        canStart = false
    }
    if (!$('#player_1').val()) {
        canStart = false
    }
    if (!$('#player_1_icon').val()) {
        canStart = false
    }
    if ($('#player_2').val() && !$('#player_2_icon').val()) {
        canStart = false
    }
    if ($('#player_3').val() && !$('#player_3_icon').val()) {
        canStart = false
    }
    if (canStart) {
        $('#startButton').removeAttr('disabled')
    } else {
        $('#startButton').attr('disabled', 'disabled')
    }
}

/** done in src/events/checkCanStart */
$('.player_name_input').on('keyup focusout', function () {
    checkCanStart()
})
$('.player_token_select').on('change', function () {
    checkCanStart()
})

function newMessage(message, clearFirst, noSync) {
    console.log('adding message')
    if (clearFirst) {
        $('#top_board').html(message + '<br />')
    } else {
        $('#top_board').append(message + '<br />')
    }
}

/** DONE */
function loadImages() {
    if (localStorage.slots && !window.location.search.includes('room')) {
        $('#resume_div').removeClass('hidden')
    } else {
        $('#setup_div').removeClass('hidden')
    }

    let canvasFont = new FontFace('Futura PT Medium', 'url(font/FuturaCyrillicMedium.woff)')
    canvasFont.load()

    let playerDropdowns = $('select.player_token_select')
    playerTokens.forEach(function (token) {
        if (token !== 'parking_token') {
            playerDropdowns.append(
                '<option value="' +
                    token +
                    "\" data-content=\"<img width='50px' src='tokens/" +
                    token +
                    '.png\' />"></option>'
            )
        }
    })
    playerDropdowns.val('')
    /*playerDropdowns.each(function(index){
      //$(this).html($('#player_tokens').html());
      $(this).val($(this).find('option:eq('+index+')').val());
  });*/
    playerDropdowns.selectpicker({
        noneSelectedText: '?',
    })
    playerDropdowns.on('show.bs.select', function (ev) {
        let currentSelect = $(this)
        console.log(ev, currentSelect)
        currentSelect.find('option').removeAttr('disabled')
        $('select.player_token_select:not(#' + currentSelect.attr('id')).each(function () {
            currentSelect.find('option[value="' + $(this).val() + '"]').attr('disabled', true)
        })
        $(this).selectpicker('refresh')
        var thisUl = $(this).parent().find('ul.dropdown-menu')
        thisUl.find('li').addClass('float33')
        thisUl.css('width', '300px')
    })

    images.house = new Image()
    images.house.src = 'img/house.png'
    images.hotel = new Image()
    images.hotel.src = 'img/hotel.png'
    images.boardMiddle = new Image()
    images.boardMiddle.src = 'img/top_image.png'
    images.parking = new Image()
    images.parking.src = 'img/parking.png'

    let folder, extension
    $.each(slotTypes, function (slotIndex, slotType) {
        if (slotType.pool) {
            folder = ['station', 'chest', 'chance', 'visiting'].includes(slotType.type) ? slotType.type : 'slots'
            extension = folder === 'slots' ? 'webp' : 'jpg'
            if (['chest', 'chance', 'station'].includes(slotType.type)) {
                extension = 'png'
            }
            $.each(slotType.pool, function (poolIndex, poolItem) {
                if (Array.isArray(poolItem)) {
                    $.each(poolItem, function (innerIndex, innerPool) {
                        images[innerPool] = new Image()
                        images[innerPool].src = folder + '/' + innerPool + '.' + extension
                    })
                } else {
                    images[poolItem] = new Image()
                    images[poolItem].src = folder + '/' + poolItem + '.' + extension
                }
            })
        }
    })

    $.each(communityChests, function (index, chest) {
        images['chest' + chest.fileIndex] = new Image()
        images['chest' + chest.fileIndex].src = 'cards/chest/CC ' + chest.fileIndex + '.jpg'
    })
    $.each(chances, function (index, chance) {
        images['chance' + chance.fileIndex] = new Image()
        images['chance' + chance.fileIndex].src = 'cards/chance/CHANCE ' + chance.fileIndex + '.jpg'
    })
    $.each(playerTokens, function (index, token) {
        images[token] = new Image()
        images[token].src = 'tokens/' + token + '.png'
    })
    $.each(seriesNames, function (index, series) {
        images.series[series.name] = new Image()
        images.series[series.name].src = 'img/series/' + series.name + '.png'
    })
    // Randomise chest and chance order
    if (gameSettings.shuffleCards) {
        communityChests.sort(() => 0.5 - Math.random())
        chances.sort(() => 0.5 - Math.random())
    }
}

let corners = [
    {
        name: 'go',
        friendlyName: 'Go',
        left: 873,
        right: 1000,
        top: 873,
        bottom: 1000,
        index: 0,
        //next: ['ken', 'kazuya', 'ryu', 'littlemac', 'lucina', 'wolf', 'gandw', 'falco', 'fox'],
        next: ['brown', 'chest', 'brown', 'lowtiertax', 'station', 'lightblue', 'chance', 'lightblue', 'lightblue'],
        type: 'go',
    },
    {
        name: 'visiting',
        friendlyName: 'Just Visiting',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 10,
        pool: ['steve', 'kazuya', 'rob'],
        //next: ['kirby', 'mythra', 'metaknight', 'kingdedede', 'chrom', 'donkeykong', 'pacman', 'diddykong', 'krool'],
        next: ['pink', 'utility', 'pink', 'pink', 'station', 'orange', 'chest', 'orange', 'orange'],
        type: 'visiting',
        drawSlot: true,
    },
    {
        name: 'freecharacter',
        friendlyName: 'Free Character',
        left: 0,
        right: 127,
        top: 0,
        bottom: 127,
        index: 20,
        //next: ['mario', 'luigi', 'peach', 'bowser', 'marth', 'pikachu', 'jigglypuff', 'pyra', 'trainer'],
        next: ['red', 'chance', 'red', 'red', 'station', 'yellow', 'yellow', 'utility', 'yellow'],
        type: 'free',
    },
    {
        name: 'tobanned',
        friendlyName: 'Get Banned',
        left: 873,
        right: 1000,
        top: 0,
        bottom: 127,
        index: 30,
        //next: ['link', 'zelda', 'falcon', 'ganondorf', 'roy', 'hero', 'cloud', 'miigunner', 'sephiroth'],
        next: ['green', 'green', 'chest', 'green', 'station', 'chance', 'blue', 'lametax', 'blue'],
        type: 'tobanned',
    },
    {
        name: 'banned',
        friendlyName: 'Banned!',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 40,
        type: 'banned',
    },
]

let slots = []

/** DONE */
function newGame() {
    $('#resume_div').addClass('hidden')
    $('#setup_div').removeClass('hidden')
}

/** done in src/object/Game.ts */
function continueGame() {
    loadGameState(true)
    game.start()
    requestAnimationFrame(updateGameArea)
    $('#setup_div, #resume_div').addClass('hidden')
    $('#game_div').removeClass('hidden')
}

/** done in src/object/Game.ts */
function configureGame() {
    // Create "token" object with settings
    players.push(new Token(0, $('#player_0').val(), $('#player_0_icon').val()))
    configurePlayer(players[0])
    // Player 2
    players.push(new Token(1, $('#player_1').val(), $('#player_1_icon').val()))
    configurePlayer(players[1])
    let player2 = $('#player_2')
    if (player2.val()) {
        players.push(new Token(2, player2.val(), $('#player_2_icon').val()))
        configurePlayer(players[2])
        gameSettings.winCondition = 2
        let player3 = $('#player_3')
        if (player3.val()) {
            players.push(new Token(3, player3.val(), $('#player_3_icon').val()))
            configurePlayer(players[3])
            gameSettings.winCondition = 1
        }
    }
    $('#setup_div').addClass('hidden')
    $('#game_div').removeClass('hidden')
    game.start()
}

/** done in src/object/Game.ts */
function configurePlayer(player) {
    let num = player.playerIndex
    // Add player name and colour to section
    $('.player[data-number="' + num + '"], #p' + num + 'name')
        .prepend(player.name + ' <img width="40px" src="tokens/' + player.icon + '.png" />')
        .css('color', playerColours[num])
        .removeClass('hidden')
    // Add player name and colour to win button and board area
    $('#p' + num + 'button')
        .html(player.name)
        .css('background-color', playerColours[num])
        .removeClass('hidden')
}

/** done in src/object/Game.ts */
let game = {
    canvas: document.getElementById('game'),
    rounds: 1,
    started: false,
    start: function () {
        this.started = true
        this.canvas.width = 1000
        this.canvas.height = 1000
        this.canvas.addEventListener('mousedown', function (e) {
            getCursorPosition(game.canvas, e)
        })
        this.context = this.canvas.getContext('2d')
        if (!slots.length) {
            populateSlots()
        }
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
}

/** done in src/object/Game.ts */
function useCard(playerIndex, cardType, multiplayerClick) {
    players[playerIndex].character = 'CHOICE'
    if (cardType === 'chest') {
        players[playerIndex].showChest = undefined
    } else {
        players[playerIndex].showChance = undefined
    }
    addPlayerText(players[playerIndex])
    requestAnimationFrame(updateGameArea)
}

/** done in src/object/Canvas.ts */
function updatePlayerPosition(player) {
    if (player.index !== player.targetIndex) {
        player.progress++
        if (player.progress === 10) {
            player.progress = 0
            if (player.backwards) {
                player.index--
                if (player.index === -1) {
                    player.index = 0
                }
            } else {
                player.index++
                if (player.index === 40) {
                    player.index = 0
                }
            }
            if (player.index === player.targetIndex) {
                if (player.banned) {
                    player.index = 40
                    player.targetIndex = 40
                }
                player.backwards = false
                gameSettings.currentlyAnimating = false
            }
        }
    }

    let occupiedSlot = slots[player.index],
        nextIndex = player.index + 1 === 40 ? 0 : player.index + 1

    if (player.backwards) {
        nextIndex = player.index - 1 === -1 ? 40 : player.index - 1
    }
    let nextSlot = slots[nextIndex]

    player.x = (occupiedSlot.left + occupiedSlot.right) / 2
    player.y = (occupiedSlot.top + occupiedSlot.bottom) / 2
    if (player.index !== player.targetIndex) {
        player.nextX = (nextSlot.left + nextSlot.right) / 2
        player.nextY = (nextSlot.top + nextSlot.bottom) / 2
        player.diffX = player.nextX - player.x
        player.diffY = player.nextY - player.y
        player.diffX = (player.diffX / 10) * player.progress
        player.diffY = (player.diffY / 10) * player.progress
        player.x = player.x + player.diffX
        player.y = player.y + player.diffY
    }
    switch (player.playerIndex) {
        case 0:
            player.x -= 13
            player.y -= 13
            if (player.index === 10) {
                player.x -= 30
            }
            break
        case 1:
            player.x += 13
            player.y -= 13
            if (player.index === 10) {
                player.x -= 56
                player.y += 26
            }
            break
        case 2:
            player.x -= 13
            player.y += 13
            if (player.index === 10) {
                player.y += 30
            }
            break
        case 3:
            player.x += 13
            player.y += 13
            if (player.index === 10) {
                player.y += 30
            }
            break
    }
    player.x -= 25
    player.y -= 25
    ctx.drawImage(images[player.icon], player.x, player.y, 60, 60)
}

/** done in src/object/Token.ts */
function Token(playerIndex, name, icon) {
    this.playerIndex = playerIndex
    this.icon = icon
    this.name = name
    this.index = 0
    this.targetIndex = 0
    this.progress = 0
    this.setCount = 0
    this.wins = 0
    this.losses = 0
    this.diceTotal = 0
    this.charactersWon = 0
    this.charactersLost = 0
    this.banned = false
    this.handicap = 0
}

/** done in src/object/Game.ts */
function finishedAnimatingCheck() {
    let actioned = true
    if (!processingRoll) {
        return
    }
    switch (finishedAnimatingAction) {
        case 'chance':
            rollingPlayer.chance = gameSettings.chanceCounter
            gameSettings.chanceCounter++
            if (gameSettings.chanceCounter === 15) {
                gameSettings.chanceCounter = 0
            }
            animateCard()
            //ctx.drawImage(chances[~~(Math.random() * 15)].image, 500-(344/2),500-(200/2),344,200);
            break
        case 'chest':
            //rollingPlayer.chest = ~~(Math.random() * 15);
            rollingPlayer.chest = gameSettings.chestCounter
            gameSettings.chestCounter++
            if (gameSettings.chestCounter === 15) {
                gameSettings.chestCounter = 0
            }
            animateCard()
            //ctx.drawImage(communityChests[~~(Math.random() * 15)].image, 500-(344/2),500-(200/2),344,200);
            break
        default:
            processingRoll = false
            processLandedSlot()
            actioned = false
            if (gameSettings.currentTurn > players.length - 1) {
                $('.win').removeClass('hidden')
                $('.roll').addClass('hidden')
                saveGameState()
                //$('#top_board').html('FIGHT!!!');
            } else {
                $('#roll_dice').removeClass('hidden')
            }
    }
    finishedAnimatingAction = undefined
}

/** add in src/object/Game.ts */
function saveGameState() {
    localStorage.setItem('slots', JSON.stringify(slots))
    localStorage.setItem('players', JSON.stringify(players))
    localStorage.setItem('chances', JSON.stringify(chances))
    localStorage.setItem('communityChests', JSON.stringify(communityChests))
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings))
}

/** done in src/object/Game.ts */
function loadGameState(continuing) {
    $('#bottom_board').removeClass('hidden')
    slots = JSON.parse(localStorage.slots)
    players = JSON.parse(localStorage.players)
    chances = JSON.parse(localStorage.chances)
    communityChests = JSON.parse(localStorage.communityChests)
    gameSettings = JSON.parse(localStorage.gameSettings)
    $('.win').removeClass('hidden')
    $('.roll').addClass('hidden')
    $('#top_board').html('')
    $.each(players, function (index, player) {
        addPlayerText(player)
        if (continuing) {
            configurePlayer(player)
        }
    })
    if (!continuing) {
        requestAnimationFrame(updateGameArea)
    }
}

/** done in src/object/Canvas.ts */
let cardWidth = 0,
    cardHeight = 0

/** Done in src/object/Canvas.ts */
function animateCard() {
    ctx.clearRect(300, 300, 400, 400)
    addBoardLogo()
    ctx.save()
    ctx.translate(500, 500)
    cardWidth += 4
    cardHeight = (200 / 344) * cardWidth
    ctx.rotate(((cardWidth + 16) * 3 * Math.PI) / 180)
    ctx.drawImage(
        typeof rollingPlayer.chance !== 'undefined'
            ? images['chance' + chances[rollingPlayer.chance].fileIndex]
            : images['chest' + communityChests[rollingPlayer.chest].fileIndex],
        -cardWidth / 2,
        -cardHeight / 2,
        cardWidth,
        cardHeight
    )
    ctx.restore()
    if (cardWidth < 344) {
        requestAnimationFrame(animateCard)
    } else {
        cardWidth = 0
        cardHeight = 0
        $('#continue_game').removeClass('hidden')
    }
}

/** done in src/object/Game.ts */
function processCard() {
    $('#continue_game').addClass('hidden')
    let cardDetails =
        typeof rollingPlayer.chance !== 'undefined'
            ? chances[rollingPlayer.chance]
            : communityChests[rollingPlayer.chest]
    rollingPlayer.chance = undefined
    rollingPlayer.chest = undefined
    let willAnimate = false
    if (cardDetails.targetIndex || cardDetails.targetIndex === 0) {
        if (cardDetails.targetIndex > -1) {
            rollingPlayer.targetIndex = cardDetails.targetIndex
        } else {
            rollingPlayer.targetIndex += cardDetails.targetIndex
            rollingPlayer.backwards = true
        }
        willAnimate = true
    } else if (cardDetails.text) {
        gameSettings.matchSettings.push(cardDetails.text)
        addMatchSettings()
    } else if (cardDetails.playerText) {
        rollingPlayer.text = cardDetails.playerText
    } else if (cardDetails.type) {
        claimRandomCharacter(rollingPlayer, cardDetails.type)
    } else if (cardDetails.goto) {
        let gotoSlot = slots.find(function (slot) {
            return slot.type === cardDetails.goto && slot.index > rollingPlayer.index
        })
        if (!gotoSlot) {
            gotoSlot = slots.find(function (slot) {
                return slot.type === cardDetails.goto
            })
        }
        if (!gotoSlot) {
            throw 'Unable to find slot to go to for type ' + cardDetails.goto
        } else {
            rollingPlayer.targetIndex = gotoSlot.index
            willAnimate = true
        }
    } else if (cardDetails.gotoProperty) {
        let gotoSlot = slots.find(function (slot) {
            return slot[cardDetails.gotoProperty] && slot.index > rollingPlayer.index
        })
        if (!gotoSlot) {
            gotoSlot = slots.find(function (slot) {
                return slot[cardDetails.gotoProperty]
            })
        }
        if (!gotoSlot) {
            throw 'Unable to find slot to go to for property ' + cardDetails.gotoProperty
        } else {
            rollingPlayer.targetIndex = gotoSlot.index
            willAnimate = true
        }
    } else if (cardDetails.showChest) {
        rollingPlayer.showChest = cardDetails
    } else if (cardDetails.showChance) {
        rollingPlayer.showChance = cardDetails
    } else if (cardDetails.banned) {
        rollingPlayer.banned = true
        rollingPlayer.index = 40
        rollingPlayer.targetIndex = 40
    } else if (cardDetails.handicapIncrease) {
        $.each(players, function (index, player) {
            if (player.playerIndex !== rollingPlayer.playerIndex) {
                addHandicap(player, 50)
                addPlayerText(player)
            }
        })
    } else {
        console.log('non implemented card:')
        console.log(cardDetails)
    }

    if (willAnimate) {
        gameSettings.currentlyAnimating = true

        let newSlot = slots[rollingPlayer.targetIndex],
            slotType = newSlot.type

        switch (slotType) {
            case 'chest':
                finishedAnimatingAction = 'chest'
                break
            case 'chance':
                finishedAnimatingAction = 'chance'
                break
            case 'tobanned':
                rollingPlayer.banned = true
                break
        }
    }
    window.requestAnimationFrame(updateGameArea)
}

/** done in src/object/Canvas.ts */
function addBoardLogo() {
    // Add middle image
    ctx.save()
    ctx.translate(500, 500)
    ctx.rotate((-48 * Math.PI) / 180)
    ctx.drawImage(images.boardMiddle, -240, -135, 480, 270)
    ctx.restore()
}

/** done in src/object/Canvas.ts */
function strokeRectangle(width, height, x, y, color) {
    ctx = game.context
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)
}

/** done in src/object/Game.ts */
function randomiseBoard() {
    $.each(slotTypes, function (index, slot) {
        slot.count = undefined
    })
    slots = []
    populateSlots()
}

/** done in src/object/Game.ts */
function toggleDLC() {
    if (gameSettings.dlc) {
        // If on, turn off
        gameSettings.dlc = false
        $('#toggleDLC').html('Turn DLC On')
        $.each(slotTypes, function (index, slotType) {
            if (slotType.no_dlc) {
                slotType.orig_pool = slotType.pool
                slotType.pool = slotType.no_dlc
            }
        })
        randomiseBoard()
    } else {
        gameSettings.dlc = true
        $('#toggleDLC').html('Turn DLC Off')
        $.each(slotTypes, function (index, slotType) {
            if (slotType.orig_pool) {
                slotType.pool = slotType.orig_pool
            }
        })
        randomiseBoard()
    }
}

/** DONE in src/object/Game.ts */
function populateSlots() {
    $.each(corners, function (index, item) {
        // First draw that corner
        let height = item.bottom - item.top,
            width = item.right - item.left
        strokeRectangle(width, height, item.left, item.top, 'red')
        // Now populate slots between with next
        let direction, startX, startY
        switch (item.type) {
            case 'go':
                direction = 'right_left'
                startX = item.left
                startY = item.top
                break
            case 'visiting':
                direction = 'bottom_top'
                startX = item.left
                startY = item.top
                break
            case 'free':
                direction = 'left_right'
                startX = item.right - standardWidth
                startY = item.top
                break
            case 'tobanned':
                direction = 'top_bottom'
                startX = item.left
                startY = item.bottom - standardWidth
                break
        }

        if (item.type === 'visiting') {
            item.name = item.pool[~~(Math.random() * 3)]
            item.friendlyName = friendlyNames[item.name]
                ? friendlyNames[item.name]
                : item.name.charAt(0).toUpperCase() + item.name.slice(1)
        } else if (item.type === 'banned') {
            item.name = slots[10].name
            item.friendlyName = slots[10].friendlyName
        }

        slots.push(item)

        $.each(item.next, function (index, nextType) {
            let character
            let slotType = slotTypes.find(function (type) {
                return type.type === nextType
            })
            if (typeof slotType.count == 'undefined') {
                // First time on this slot, randomise pool!
                slotType.pool.sort(() => 0.5 - Math.random())
                if (Array.isArray(slotType.pool[0])) {
                    slotType.pool[0].sort(() => 0.5 - Math.random())
                    character = slotType.pool[0][0]
                } else {
                    character = slotType.pool[0]
                }
                slotType.count = 0
            } else {
                slotType.count++
                if (Array.isArray(slotType.pool[0])) {
                    character = slotType.pool[0][slotType.count]
                } else {
                    character = slotType.pool[slotType.count]
                }
            }

            let width, height, ownLeft, ownTop, iconX, iconY
            switch (direction) {
                case 'right_left':
                    startX -= standardWidth
                    width = standardWidth
                    height = standardHeight
                    ownLeft = startX
                    ownTop = startY
                    iconX = startX + standardWidth / 2
                    iconY = startY + standardHeight - 35
                    break
                case 'bottom_top':
                    startY -= standardWidth
                    height = standardWidth
                    width = standardHeight
                    ownLeft = startX + standardHeight
                    ownTop = startY
                    iconX = startX + 35
                    iconY = startY + standardWidth / 2
                    break
                case 'left_right':
                    startX += standardWidth
                    width = standardWidth
                    height = standardHeight
                    ownLeft = startX + standardWidth
                    ownTop = startY + standardHeight
                    iconX = startX + standardWidth / 2
                    iconY = startY + 35
                    break
                case 'top_bottom':
                    startY += standardWidth
                    height = standardWidth
                    width = standardHeight
                    ownLeft = startX
                    ownTop = startY + standardWidth
                    iconX = startX + standardHeight - 35
                    iconY = startY + standardWidth / 2
                    break
            }
            let isProperty = !['chest', 'chance', 'banned', 'free', 'lowtiertax', 'lametax'].includes(nextType)
            let isHeavy = heavies.includes(character)
            let isTopTier = toptiers.includes(character)

            /*var icon = new Image();
      icon.onload = function(){
          /*var icon_slot = slots.find(function(slot){return slot.name == character});
          ctx.drawImage(icon, icon_slot.iconX-35, icon_slot.iconY-35, 70, 70);*/
            //}
            /*icon.onerror = function(){
          var icon_slot = slots.find(function(slot){return slot.name == character});
          icon_slot.icon = undefined;
      }
      var folder = ['station', 'chest', 'chance', 'visiting'].includes(type) ? type : 'slots';
      var extension = folder == 'slots' ? 'webp' : 'jpg';
      icon.src = folder+'/'+character+'.' + extension;*/
            let characterObj = {
                name: character,
                friendlyName: friendlyNames[character]
                    ? friendlyNames[character]
                    : character.charAt(0).toUpperCase() + character.slice(1),
                left: startX,
                right: startX + width,
                top: startY,
                bottom: startY + height,
                ownLeft: ownLeft,
                ownTop: ownTop,
                iconX: iconX,
                iconY: iconY,
                direction: direction,
                index: item.index + index + 1,
                property: isProperty,
                owner: undefined,
                //owner: isProperty ? index % 2 : undefined,
                house: false,
                //house: index % 2 == 0,
                hotel: false,
                //hotel: index % 2 == 1,
                heavy: isHeavy,
                toptier: isTopTier,
                type: nextType,
                drawSlot: true,
                opacity: 0,
            }
            slots.push(characterObj)
            strokeRectangle(width, height, startX, startY, 'blue')
        })
    })

    if (
        !slots.find(function (slot) {
            return slot.heavy
        })
    ) {
        let ridley = slots.find(function (slot) {
            return slot.name === 'ridley'
        })
        if (ridley) {
            ridley.heavy = true
            console.log('ridley is now a heavy')
        } else {
            $.each(slots, function (index, slot) {
                if (['samus', 'darksamus'].includes(slot.name)) {
                    slot.heavy = true
                }
            })
            console.log('samuses now heavies')
        }
    }

    updateGameArea(0, true)
}

/** done in src/object/Canvas.ts */
function drawSlots(showSeries) {
    ctx = game.context
    ctx.drawImage(images.parking, 0, 0, standardHeight, standardHeight)
    addBoardLogo()
    let seriesSeen = []
    let parkingCount = 0
    $.each(slots, function (index, item) {
        let rotateBy,
            offsetX = 0,
            offsetY = 0
        switch (item.direction) {
            case 'right_left':
                rotateBy = 0
                ctx.textAlign = 'left'
                ctx.textBaseline = 'top'
                offsetX += item.hotel ? 50 : 60
                offsetY += item.hotel ? 0 : 5
                break
            case 'bottom_top':
                rotateBy = Math.PI / 2
                ctx.textAlign = 'left'
                ctx.textBaseline = 'bottom'
                offsetY += item.hotel ? 0 : 5
                offsetX += item.hotel ? 50 : 60
                break
            case 'left_right':
                rotateBy = Math.PI
                ctx.textAlign = 'right'
                ctx.textBaseline = 'bottom'
                offsetX += item.hotel ? 50 : 60
                offsetY += item.hotel ? 0 : 5
                break
            case 'top_bottom':
                rotateBy = -Math.PI / 2
                ctx.textAlign = 'right'
                ctx.textBaseline = 'top'
                offsetY += item.hotel ? 0 : 5
                offsetX += item.hotel ? 50 : 60
                break
        }

        // Add text
        /*ctx.save();
    ctx.translate(item.ownLeft, item.ownTop);
    ctx.rotate(rotateBy);
    ctx.fillStyle = 'white';
    ctx.fillText(players[item.owner].name, 0, 0);
    ctx.restore();*/

        // Add icon & text
        if (item.drawSlot) {
            ctx.save()
            let x,
                y,
                w,
                h,
                addText = false
            if (['chest', 'chance', 'station'].includes(item.type)) {
                x = item.ownLeft
                y = item.ownTop
                w = standardWidth
                h = standardHeight
                addText = true
            } else if (['go', 'visiting', 'freecharacter', 'tobanned'].includes(item.type)) {
                x = item.left
                y = item.top
                w = standardHeight
                h = standardHeight
            } else {
                x = item.iconX
                y = item.iconY
                w = 70
                h = 70
                addText = true
            }
            ctx.translate(x, y)
            ctx.rotate(rotateBy)
            if (addText) {
                if (['chest', 'chance', 'station'].includes(item.type)) {
                    ctx.drawImage(images[item.name], 0, 0, w, h)
                    ctx.restore()
                    ctx.save()
                    ctx.translate(item.iconX, item.iconY)
                    ctx.rotate(rotateBy)
                } else {
                    if (['lowtiertax', 'lametax', 'utility'].includes(item.type)) {
                        ctx.drawImage(images[item.name], -40, -45, 80, 80)
                    } else {
                        // Normal slot
                        ctx.drawImage(images[item.name], -35, -35, w, h)
                        if (showSeries) {
                            let series = seriesNames.find(function (series) {
                                return series.characters.includes(item.name)
                            })
                            if (images.series[series.name] && !seriesSeen.includes(series.name)) {
                                seriesSeen.push(series.name)
                                ctx.drawImage(images.series[series.name], -160, -180, 206, 110)
                            }
                        }
                    }
                }

                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillStyle = 'black'
                ctx.font = '13px "Futura PT Medium"'
                switch (item.type) {
                    case 'utility':
                        ctx.fillText(item.friendlyName.toUpperCase(), 0, -75)
                        break
                    case 'lowtiertax':
                    case 'lametax':
                        ctx.font = '18px "Futura PT Medium"'
                        ctx.fillText(item.type === 'lowtiertax' ? 'LOW TIER' : 'LAME', 0, -75)
                        ctx.fillText('TAX', 0, -55)
                        break
                    case 'chest':
                        ctx.fillText('COMMUNITY', 0, -70)
                        ctx.fillText('CHEST', 0, -55)
                        break
                    case 'chance':
                        ctx.fillText('CHANCE', 0, -70)
                        break
                    case 'station':
                        ctx.fillText(item.name.toUpperCase(), 0, -75)
                        ctx.fillText('STATION', 0, -60)
                        break
                    default:
                        let characterText = item.friendlyName.toUpperCase()
                        if (characterText.length >= 10) {
                            characterText = characterText.split(' ')
                        } else {
                            characterText = [characterText]
                        }

                        if (characterText[1] === '&') {
                            // put & on shorter line
                            if (characterText[0].length < characterText[2].length) {
                                characterText[0] = characterText[0] + ' &'
                            } else {
                                characterText[2] = '& ' + characterText[2]
                            }
                            characterText.splice(1, 1)
                        }
                        if (characterText[1] === 'K.') {
                            characterText[0] = 'KING K.'
                            characterText.splice(1, 1)
                        }
                        if (characterText[1] === 'SUIT') {
                            characterText[0] = 'ZERO SUIT'
                            characterText.splice(1, 1)
                        }
                        for (let i = 0; i < characterText.length; i++) {
                            ctx.fillText(characterText[i], 0, -50 + i * 10)
                        }
                }

                /*if (item.type == 'utility'){
            ctx.fillText(item.type.toUpperCase(), 0, -70);
        } else if (item.type.includes('tax')){
            ctx.fillText(item.type == 'lowtiertax' ? 'LOW TIER' : 'LAME', 0, -80);
            ctx.fillText('TAX', 0, -65);
        } else if (['chest', 'chance', 'station'].includes(item.type)){
            ctx.fillText('CHANCE', 0, -70);
        } else {

        }*/
            } else {
                // Only actually the banned space
                ctx.drawImage(images[item.name], 0, 0, w, h)
            }

            ctx.restore()
        }

        // Place player icon
        if (item.owner || item.owner === 0) {
            if (item.owner === 'parking') {
                ctx.fillStyle = 'rgba(0,0,0,0.2)'
                ctx.fillRect(item.left, item.top, item.right - item.left, item.bottom - item.top)
                ctx.save()
                ctx.translate(item.ownLeft, item.ownTop)
                ctx.rotate(rotateBy)
                /*ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '12px "copperplate_gothic_boldRg"';
        ctx.fillText('In Parking', 5, 5);*/
                ctx.drawImage(images['parking_token'], standardWidth / 2 - 20, -5, 40, 40)
                ctx.restore()
                if (item.type === 'station') {
                    ctx.drawImage(
                        images[item.name],
                        0,
                        110,
                        197,
                        197,
                        parkingCoords[parkingCount][0],
                        parkingCoords[parkingCount][1],
                        20,
                        20
                    )
                } else {
                    ctx.drawImage(
                        images[item.name],
                        parkingCoords[parkingCount][0],
                        parkingCoords[parkingCount][1],
                        20,
                        20
                    )
                }
                parkingCount++
                if (parkingCount === parkingCoords.length) {
                    parkingCount = 0
                }
            } else {
                // Translucent rectangle over whole spot
                //ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
                if (item.owner === gameSettings.losingCharacterIndex && !item.locked) {
                    ctx.fillStyle = playerColours[item.owner].replace(')', ',' + item.opacity + ')')
                    item.opacity += 0.005
                    if (item.opacity > 0.4) {
                        item.opacity = 0
                    }
                } else if (
                    item.owner === gameSettings.upgradeCharacterIndex &&
                    !item.hotel &&
                    !['station', 'utility'].includes(item.type)
                ) {
                    ctx.fillStyle = playerColours[item.owner].replace(')', ',' + item.opacity + ')')
                    item.opacity += 0.005
                    if (item.opacity > 0.4) {
                        item.opacity = 0
                    }
                } else {
                    ctx.fillStyle = playerColours[item.owner].replace(')', ',0.2)')
                }

                ctx.fillRect(item.left, item.top, item.right - item.left, item.bottom - item.top)

                ctx.save()
                ctx.translate(item.ownLeft, item.ownTop)
                ctx.rotate(rotateBy)
                ctx.drawImage(images[players[item.owner].icon], 5, 5, 20, 20)
                if (item.hotel) {
                    ctx.drawImage(images.hotel, offsetX, offsetY, 30, 30)
                } else if (item.house) {
                    ctx.drawImage(images.house, offsetX, offsetY, 20, 20)
                }
                ctx.restore()
            }
        }
    })
}

/** done in src/object/Game.ts */
function addPlayerCards() {
    $('.owned_characters').html('')
    // Add any held cards to area
    $.each(players, function (index, player) {
        if (player.showChest || player.showChance) {
            let ownedElement = $('.player[data-number="' + player.playerIndex + '"] .owned_characters')
            if (player.showChest) {
                ownedElement.prepend(
                    '<img onclick="useCard(' +
                        player.playerIndex +
                        ',\'chest\')" class="pointer" style="width:120px;margin-bottom:3px;" src="cards/chest/CC ' +
                        player.showChest.fileIndex +
                        '.jpg" />'
                )
            }
            if (player.showChance) {
                ownedElement.prepend(
                    '<img onclick="useCard(' +
                        player.playerIndex +
                        ',\'chance\')" class="pointer" style="width:120px;margin-bottom:3px;margin-right:5px;" width="120px;" src="cards/chance/CHANCE ' +
                        player.showChance.fileIndex +
                        '.jpg" />'
                )
            }
        }
    })
    let cardOrder = [
        5, 15, 25, 35, 1, 3, 6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24, 26, 27, 29, 31, 32, 34, 37, 39, 12, 28,
    ]
    cardOrder.forEach(function (slotIndex) {
        let item = slots[slotIndex]
        let characterColour = getSlotProperty(item.type, 'colour')
        if (characterColour === undefined) {
            characterColour = ''
        }
        let characterCard =
            '<div class="character_card" style="background-color:' +
            characterColour +
            '"><img class="owned_' +
            item.type +
            '" src="' +
            images[item.name].src +
            '" width="30px;" /> ' +
            item.friendlyName
        if (item.hotel) {
            characterCard += ' <img src="img/hotel.png" />'
        } else if (item.house) {
            characterCard += ' <img src="img/house.png" />'
        }
        characterCard += '</div>'
        $('.player[data-number="' + item.owner + '"] .owned_characters').append(characterCard)
    })
}

/** done in src/object/Game.ts */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let clickedSlot = slots.filter(function (slot) {
        return slot.left < x && slot.right > x && slot.top < y && slot.bottom > y
    })
    if (clickedSlot.length) {
        console.log(clickedSlot[0].name)
        processClickedSlot(clickedSlot[0].index)
    }
}

/** done in src/object/Game.ts */
function processClickedSlot(slotIndex) {
    let clickedSlot = slots[slotIndex]
    if (gameSettings.losingCharacterIndex || gameSettings.losingCharacterIndex === 0) {
        if (clickedSlot.owner === gameSettings.losingCharacterIndex && !clickedSlot.locked) {
            //$('#top_board').html(gameSettings.recentWinner.name + ' has stolen ' + clickedSlot.friendlyName + '!<br />');
            newMessage(gameSettings.recentWinner.name + ' has stolen ' + clickedSlot.friendlyName, true)
            /*clickedSlot.owner = recentWinner.playerIndex;
      clickedSlot.house = false;
      clickedSlot.hotel = false;
      clickedSlot.justWon = true;*/
            players[gameSettings.losingCharacterIndex].charactersLost++
            let nextLoser = gameSettings.losingCharacterIndex + 1
            gameSettings.losingCharacterIndex = undefined
            gameSettings.currentlyAnimating = false
            allocateOwner(clickedSlot.index, gameSettings.recentWinner)
            if (!gameSettings.over) {
                loserCheck(nextLoser)
            }
        } else {
            //$('#top_board').html(players[gameSettings.losingCharacterIndex].name + ' does not own ' + clickedSlot.friendlyName + '!<br />');
            newMessage(
                players[gameSettings.losingCharacterIndex].name + ' does not own ' + clickedSlot.friendlyName + '!',
                true
            )
        }
    } else if (gameSettings.upgradeCharacterIndex || gameSettings.upgradeCharacterIndex === 0) {
        if (
            clickedSlot.owner === gameSettings.upgradeCharacterIndex &&
            !clickedSlot.hotel &&
            !['station', 'utility'].includes(clickedSlot.type)
        ) {
            if (!clickedSlot.house) {
                clickedSlot.house = true
                newMessage(
                    gameSettings.recentWinner.name + ' has upgraded ' + clickedSlot.friendlyName + ' to a house!'
                )
            } else {
                clickedSlot.hotel = true
                newMessage(
                    gameSettings.recentWinner.name + ' has upgraded ' + clickedSlot.friendlyName + ' to a hotel!'
                )
            }

            gameSettings.upgradeCharacterIndex = undefined
            gameSettings.currentlyAnimating = false
            allWinChecksDone()
        }
    }
}

/** done in src/object/Game.ts */
function getSlotProperty(type, property) {
    return slotTypes.find(function (types) {
        return types.type === type
    })[property]
}

/** done in src/object/Game.ts */
function rollDice() {
    $('#top_board').html('')
    $('#roll_dice').addClass('hidden')
    let loops = 0
    let pip = '<span class="pip"></span>'
    let dice_roll = setInterval(function () {
        let die1 = ~~(Math.random() * 6) + 1,
            die2 = ~~(Math.random() * 6) + 1
        $('#die_1').html(pip.repeat(die1))
        $('#die_2').html(pip.repeat(die2))
        loops++
        if (loops === 10) {
            clearInterval(dice_roll)

            if (gameSettings.dieResult > 0) {
                die1 = gameSettings.dieResult
                die2 = 0
                gameSettings.dieResult = 0
            }

            diceResult(die1, die2)
        }
    }, 50)
}

/** done in src/object/Game.ts */
function diceResult(die1, die2) {
    processingRoll = true
    rollingPlayer = players[gameSettings.currentTurn]

    gameSettings.currentTurn++

    rollingPlayer.diceTotal += die1 + die2

    if (die1 === die2 && rollingPlayer.banned) {
        //$('#top_board').html('Rolled doubles, unbanned!<br />');
        newMessage('Rolled doubles, unbanned!', true)
        rollingPlayer.banned = false
        rollingPlayer.index = 10
        rollingPlayer.targetIndex = 10
    }

    if (rollingPlayer.banned) {
        //$('#top_board').html(rollingPlayer.name + ' did not roll doubles, still banned!<br />');
        newMessage(rollingPlayer.name + ' did not roll doubles, still banned!', true)
        $('#roll_dice').removeClass('hidden')
        requestAnimationFrame(updateGameArea)
        return
    }

    game.total = die1 + die2
    if ($('#override').val()) {
        game.total = parseInt($('#override').val())
    }
    rollingPlayer.targetIndex += game.total
    if (rollingPlayer.targetIndex >= 40) {
        rollingPlayer.targetIndex -= 40
    }

    let newSlot = slots[rollingPlayer.targetIndex],
        slotType = newSlot.type

    switch (slotType) {
        case 'chest':
            finishedAnimatingAction = 'chest'
            break
        case 'chance':
            finishedAnimatingAction = 'chance'
            break
        case 'tobanned':
            rollingPlayer.banned = true
            break
    }

    gameSettings.currentlyAnimating = true
    window.requestAnimationFrame(updateGameArea)
}

/** done in src/object/Game.ts */
function processLandedSlot() {
    if (!rollingPlayer) {
        return
    }

    newMessage(rollingPlayer.name + ' landed on ' + slots[rollingPlayer.index].friendlyName)

    let slot = slots[rollingPlayer.index],
        slotType = slot.type,
        slotOwner = slot.owner

    let slotOwned =
        typeof slot.owner != 'undefined' && slot.owner !== rollingPlayer.playerIndex && slot.owner !== 'parking'
    let ownedCount = slotOwned
        ? slots.filter(function (slot) {
              return slot.owner === slotOwner && slot.type === slotType
          }).length
        : 0
    let setTotal = slots.filter(function (slot) {
        return slot.type === slotType
    }).length
    let characterToPlay = slot.friendlyName
    let handicap = 0
    switch (slotType) {
        case 'free':
        case 'go':
            //alert('free character!');
            claimRandomCharacter(rollingPlayer)
            if (slotType === 'free') {
                let parkingCharacters = slots.filter(function (slot) {
                    return slot.owner === 'parking'
                })
                $.each(parkingCharacters, function (index, character) {
                    //character.owner = rollingPlayer.playerIndex;
                    allocateOwner(character.index, rollingPlayer)
                    newMessage(rollingPlayer.name + ' has claimed ' + character.friendlyName + '!<br />')
                })
                characterToPlay = 'Captain Falcon'
            } else {
                characterToPlay = 'Terry'
            }

            // Actually, play Terry on Go and Falcon on free parking
            /*let characterIndex = claimRandomCharacter(rollingPlayer);
      if (!characterIndex){
          characterToPlay = 'Choice';
      } else {
          characterToPlay = slots[characterIndex].friendlyName;
      }*/

            break
        case 'lowtiertax':
        case 'lametax':
            rollingPlayer.text = 'Win, or lose a character!'
            break
        case 'utility':
            if (slotOwned) {
                // if someone else owns the utility
                if (ownedCount === 2) {
                    handicap = getSlotProperty(slotType, 'two')[game.total]
                } else {
                    handicap = getSlotProperty(slotType, 'one')[game.total]
                }
            }
            break
        case 'station':
            if (slotOwned) {
                handicap = getSlotProperty(slotType, 'handicaps')[ownedCount]
            }
            break
        default:
            if (slotOwned) {
                if (ownedCount === setTotal) {
                    handicap = getSlotProperty(slotType, 'handicapSet')
                } else {
                    handicap = getSlotProperty(slotType, 'handicap')
                }
            }
            console.log(slotType)
    }

    characterToPlay = characterToPlay.toUpperCase()
    rollingPlayer.character = characterToPlay
    addHandicap(rollingPlayer, handicap)
    addPlayerText(rollingPlayer)

    updateGameArea()

    //$('#top_board').html('You rolled ' + die1 + ' and ' + die2 + ': ' + total + ', landing on ' + slots[rollingPlayer.targetIndex].name);
}

/** done in src/object/Game.ts */
function addPlayerText(player) {
    if (player.character) {
        $('#p' + player.playerIndex + 'settings').html(
            player.character +
                '<br /><span class="handicap handicap-' +
                player.handicap +
                '">' +
                player.handicap +
                '%</span>'
        )
        if (player.text) {
            $('#p' + player.playerIndex + 'settings').append(
                '<br /><span style="font-size:16px;">' + player.text + '</span>'
            )
        }
    } else {
        $('#p' + player.playerIndex + 'settings').html('')
    }
}

/** done in src/object/Game.ts */
function addHandicap(player, add) {
    player.handicap += add
    if (!handicapBands.includes(player.handicap)) {
        player.handicap = handicapBands.find(function (band) {
            return band < player.handicap
        })
    }
}

/** done in src/object/Game.ts */
function addMatchSettings() {
    $('#match_settings .text').html('')
    gameSettings.matchSettings.forEach(function (text) {
        $('#match_settings .text').prepend('<br />' + text)
    })
}

/** done in src/obeject/Game.ts */
function claimRandomCharacter(claimer, type) {
    let charactersToClaim = slots.filter(function (character) {
        return character.property && typeof character.owner == 'undefined'
    })
    if (type) {
        charactersToClaim = slots.filter(function (character) {
            return character.property && typeof character.owner == 'undefined' && character.type === type
        })
    }
    let claimedIndex
    if (charactersToClaim.length) {
        claimedIndex = charactersToClaim[~~(Math.random() * charactersToClaim.length)].index
        //slots[claimedIndex].owner = claimer.playerIndex;
        allocateOwner(claimedIndex, claimer)
        newMessage(claimer.name + ' won ' + slots[claimedIndex].friendlyName + '!')
    } else {
        // None to claim, check owned characters who aren't already a house and not a station or utility
        charactersToClaim = slots.filter(function (character) {
            return (
                character.owner === claimer.playerIndex &&
                !character.house &&
                !['station', 'utility'].includes(character.type) &&
                !character.justWon
            )
        })
        if (type) {
            // Or that specific type
            charactersToClaim = slots.filter(function (character) {
                return (
                    character.owner === claimer.playerIndex &&
                    !character.house &&
                    character.type === type &&
                    !character.justWon
                )
            })
        }
        if (charactersToClaim.length) {
            claimedIndex = charactersToClaim[~~(Math.random() * charactersToClaim.length)].index
            slots[claimedIndex].house = true
            newMessage(slots[claimedIndex].friendlyName + ' has been upgraded to a house!')
        } else {
            charactersToClaim = slots.filter(function (character) {
                return (
                    character.owner === claimer.playerIndex &&
                    !character.hotel &&
                    !['station', 'utility'].includes(character.type) &&
                    !character.justWon
                )
            })
            if (type) {
                charactersToClaim = slots.filter(function (character) {
                    return (
                        character.owner === claimer.playerIndex &&
                        !character.hotel &&
                        character.type === type &&
                        !character.justWon
                    )
                })
            }
            if (charactersToClaim.length) {
                claimedIndex = charactersToClaim[~~(Math.random() * charactersToClaim.length)].index
                slots[claimedIndex].hotel = true
                newMessage(slots[claimedIndex].friendlyName + ' has been upgraded to a hotel!')
            } else {
                newMessage('No characters to claim or upgrade!')
            }
        }
    }

    return claimedIndex
}

/** done in src/object/Game.ts && src/events */
function Win(player) {
    $('.win').addClass('hidden')
    $('.settings_div').html('')
    $('#match_settings .text').html('')
    gameSettings.matchSettings.length = 0
    gameSettings.currentTurn = 0
    gameSettings.recentWinner = players[player]
    gameSettings.recentWinner.wins++
    //loser = player == 1 ? p2Token : p1Token;
    // Winner is unbanned
    if (gameSettings.recentWinner.banned) {
        newMessage(gameSettings.recentWinner.name + ' won, now unbanned!', true)
        gameSettings.recentWinner.banned = false
        gameSettings.recentWinner.index = 10
        gameSettings.recentWinner.targetIndex = 10
    } else {
        newMessage(gameSettings.recentWinner.name + ' won!', true)
    }

    // If the loser is on a property owned by opponent, winner steals a random character
    /*if (slots[loser.index].owner == winner.playerIndex){
      claimRandomCharacter(winner, loser);
  }*/
    // Other player checks
    loserCheck(0)
}

/** done in src/object/Game.ts */
function loserCheck(playerIndex) {
    console.log('loser check ' + playerIndex)
    if (playerIndex === players.length) {
        loserChecksDone()
        return
    }
    // Don't process winner, either jump to next or loser checks are done!
    if (playerIndex === gameSettings.recentWinner.playerIndex) {
        loserCheck(playerIndex + 1)
        return
    }
    let loser = players[playerIndex]
    // Update stats and clear variables
    loser.losses++
    loser.character = ''
    loser.handicap = 0
    loser.text = ''
    // If lost on a tax, cough up a character
    if (slots[loser.index].type.includes('tax')) {
        let loserOwns = slots.filter(function (slot) {
            return slot.owner === playerIndex && !slot.locked
        })
        if (loserOwns.length) {
            let lostCharacterIndex = loserOwns[~~(Math.random() * loserOwns.length)].index
            slots[lostCharacterIndex].owner = 'parking'
            loser.charactersLost++
            newMessage(loser.name + ' has lost ' + slots[lostCharacterIndex].friendlyName)
        } else {
            newMessage(loser.name + ' has no characters to lose!')
        }
    }
    // If lost on the winners hotel, they get to pick a character
    if (slots[loser.index].hotel && slots[loser.index].owner === gameSettings.recentWinner.playerIndex) {
        // Check if loser has any characters to lose!
        if (
            slots.filter(function (slot) {
                return slot.owner === playerIndex
            }).length
        ) {
            newMessage(gameSettings.recentWinner.name + ', pick one of ' + loser.name + "'s characters to steal!")
            gameSettings.losingCharacterIndex = playerIndex
            gameSettings.currentlyAnimating = true
            window.requestAnimationFrame(updateGameArea)
        } else {
            newMessage(loser.name + ' has no characters to steal!')
            loserCheck(playerIndex + 1)
        }
    } else if (slots[loser.index].house && slots[loser.index].owner === gameSettings.recentWinner.playerIndex) {
        // Losing on winners house, lose random not locked character
        let loserOwns = slots.filter(function (slot) {
            return slot.owner === playerIndex && !slot.locked
        })
        if (loserOwns.length) {
            let lostCharacterIndex = loserOwns[~~(Math.random() * loserOwns.length)].index
            allocateOwner(slots[lostCharacterIndex].index, gameSettings.recentWinner)
            loser.charactersLost++
            newMessage(loser.name + ' has lost ' + slots[lostCharacterIndex].name)
        } else {
            newMessage(loser.name + ' has no ' + slots[loser.index].type + ' characters to steal!')
        }
        loserCheck(playerIndex + 1)
    } else {
        loserCheck(playerIndex + 1)
    }
}

/** Done in src/object/Game.ts */
function loserChecksDone() {
    let gotSomething = false
    // If the slot the winner is on is an unclaimed property, they win it
    if (!slots[gameSettings.recentWinner.index].justWon) {
        if (
            typeof slots[gameSettings.recentWinner.index].owner == 'undefined' &&
            slots[gameSettings.recentWinner.index].property
        ) {
            //slots[gameSettings.recentWinner.index].owner = gameSettings.recentWinner.playerIndex;
            allocateOwner(gameSettings.recentWinner.index, gameSettings.recentWinner)
            gotSomething = true
        } else if (
            slots[gameSettings.recentWinner.index].owner === gameSettings.recentWinner.playerIndex &&
            !['station', 'utility'].includes(slots[gameSettings.recentWinner.index].type)
        ) {
            // If they won on their own property which isn't a station or utility
            if (!slots[gameSettings.recentWinner.index].house) {
                // Make a house if not yet
                slots[gameSettings.recentWinner.index].house = true
                gotSomething = true
            } else if (!slots[gameSettings.recentWinner.index].hotel) {
                // Otherwise make a hotel!
                slots[gameSettings.recentWinner.index].hotel = true
                gotSomething = true
            }
        }
    }
    // If they're on a chance or community chest, they win a random character
    if (['chance', 'chest'].includes(slots[gameSettings.recentWinner.index].type)) {
        gotSomething = true
        claimRandomCharacter(gameSettings.recentWinner)
    }
    if (gotSomething) {
        allWinChecksDone()
    } else if (
        !slots.filter(function (slot) {
            return slot.owner === gameSettings.recentWinner.playerIndex
        }).length
    ) {
        // Claim a free character if you have none!
        claimRandomCharacter(gameSettings.recentWinner)
        allWinChecksDone()
    } else if (
        slots.filter(function (slot) {
            return (
                slot.owner === gameSettings.recentWinner.playerIndex &&
                !['station', 'utility'].includes(slot.type) &&
                !slot.hotel
            )
        }).length
    ) {
        // Otherwise let them upgrade a character, if they have any that aren't hotels
        newMessage(gameSettings.recentWinner.name + ', pick a character to upgrade!')
        gameSettings.upgradeCharacterIndex = gameSettings.recentWinner.playerIndex
        gameSettings.currentlyAnimating = true
        window.requestAnimationFrame(updateGameArea)
    } else {
        allWinChecksDone()
    }
}

/** done in src/object/Game.ts */
function allWinChecksDone() {
    // Update stats and cleanup
    gameSettings.recentWinner.character = ''
    gameSettings.recentWinner.handicap = 0
    gameSettings.recentWinner.text = ''

    if (!gameSettings.over) {
        gameSettings.rounds++
    }

    $('.win').addClass('hidden')
    $('.roll').removeClass('hidden')
    updateGameArea()
    newMessage(
        '<button style="margin-top:20px;" type="button" onclick="loadGameState()" class="button-1">Undo</button>',
        false,
        true
    )
}

/** DONE in src/object/Game.ts */
function allocateOwner(slotIndex, newOwner) {
    // Set new owner, remove house or hotel if it had them
    newOwner.charactersWon++
    slots[slotIndex].owner = newOwner.playerIndex
    slots[slotIndex].house = false
    slots[slotIndex].hotel = false
    slots[slotIndex].justWon = true
    // See if this player owns the set and lock it if so
    let slotType = slots[slotIndex].type
    let slotSet = slots.filter(function (slot) {
        return slot.type === slotType
    })
    let ownedInSet = slotSet.filter(function (slot) {
        return slot.owner === newOwner.playerIndex
    }).length
    if (ownedInSet === slotSet.length) {
        newOwner.setCount++
        $.each(slotSet, function (index, item) {
            item.locked = true
        })
        if (newOwner.setCount === gameSettings.winCondition) {
            $('#match_settings .text').html(newOwner.name + ' has won by holding ' + newOwner.setCount + ' sets!')
            $('#bottom_board').addClass('hidden')
            gameSettings.losingCharacterIndex = undefined
            gameSettings.currentlyAnimating = false
            postGameStats()
        }
    }
}

/** DONE in src/object/Game.ts */
function postGameStats() {
    gameSettings.over = true
    $.each(players, function (index, player) {
        let playerSection = $('.player[data-number="' + index + '"] .owned_characters')
        playerSection.html('')
        playerSection.append('Match Wins: ' + player.wins + '<br />')
        playerSection.append('Match Losses: ' + player.losses + '<br />')
        playerSection.append('Dice Total: ' + player.diceTotal + '<br />')
        let averageRoll = player.diceTotal / gameSettings.rounds
        playerSection.append('Average Roll: ' + averageRoll.toFixed(2) + '<br />')
        playerSection.append('Characters Won: ' + player.charactersWon + '<br />')
        playerSection.append('Characters Lost: ' + player.charactersLost + '<br />')
        playerSection.append('Final Sets: ' + player.setCount + '<br />')
    })
}

/** done in src/object/(Game|Canvas).ts */
function updateGameArea(frameNo, showSeries) {
    game.clear()
    drawSlots(showSeries)
    $.each(slots, function (index, slot) {
        slot.justWon = false
    })
    $.each(players, function (index, player) {
        updatePlayerPosition(player)
    })
    if (gameSettings.currentlyAnimating) {
        window.requestAnimationFrame(updateGameArea)
    } else {
        finishedAnimatingCheck()
        if (!gameSettings.over) {
            addPlayerCards()
        }
    }
}
