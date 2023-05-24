import { Game } from './object'
import { GameSettings } from './object/GameSettings.ts'

window.addEventListener('DOMContentLoaded', () => {
    let canvasFont = new FontFace('Futura', 'url(/font/FuturaCyrillicMedium.woff)')

    canvasFont.load().then(() => {
        const gameSettings = new GameSettings()
        const game = new Game(gameSettings)

        const center = document.querySelector<HTMLDivElement>('#center')
        const asides = document.querySelectorAll<HTMLDivElement>('#game_div aside')
        if (center && asides) {
            const height = window.innerHeight
            const centerHeight = center.getBoundingClientRect().height
            center.style.transform = `scale(${height / centerHeight})`
            asides.forEach((aside) => {
                aside.style.width = `calc((100vw - ${center.getBoundingClientRect().width}px) / 2)`
            })

            const resizeObs = new ResizeObserver(() => {
                const height = window.innerHeight
                console.log('@main.ts -', centerHeight)
                center.style.transform = `scale(${height / centerHeight})`
                asides.forEach((aside) => {
                    aside.style.width = `calc((100vw - ${center.getBoundingClientRect().width}px) / 2)`
                })
            })

            resizeObs.observe(document.body)
        }

        /* GAME SETTINGS */
        const perspectiveInput = document.querySelector<HTMLInputElement>('input#perspective')
        if (perspectiveInput) {
            perspectiveInput.value = game.perspective.toString()
            perspectiveInput.addEventListener('change', (ev: Event) => {
                const target = ev.target as HTMLInputElement
                game.perspective = parseFloat(target.value)
                game.draw()
            })
        }

        const debugCheckbox = document.querySelector<HTMLInputElement>('input#debug')
        if (debugCheckbox) {
            debugCheckbox.checked = game.settings.debug
            debugCheckbox.addEventListener('change', (ev) => {
                const target = ev.target as HTMLInputElement
                game.settings.debug = target.checked
                game.draw()
            })
        }

        /* GAME BUTTONS */
        const startForm = document.querySelector<HTMLButtonElement>('form#start')
        if (startForm) {
            startForm.addEventListener('submit', (ev) => {
                ev.preventDefault()
                const target = ev.target as EventTarget &
                    Record<'player_1' | 'player_2' | 'player_3' | 'player_4', HTMLInputElement>
                if (target) {
                    const players = [
                        target['player_1'].value,
                        target['player_2'].value,
                        target['player_3'].value,
                        target['player_4'].value,
                    ].filter((name) => name !== '')
                    game.start(players)
                }
            })
        }

        const loadButton = document.querySelector<HTMLButtonElement>('button#load')
        if (loadButton) {
            loadButton.addEventListener('click', () => {
                game.resume()
            })
        }

        const randomBtn = document.querySelector<HTMLButtonElement>('button#randomise')
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                game.randomise()
            })
        }

        const rollBtn = document.querySelector<HTMLButtonElement>('button#roll')
        if (rollBtn) {
            rollBtn.addEventListener('click', () => {
                const playerIndex = rollBtn.getAttribute('data-player-index')
                if (playerIndex) {
                    game.rollDice(parseInt(playerIndex))
                    rollBtn.classList.add('hidden')
                }
            })
        }

        const battleBtnsContainer = document.querySelector<HTMLDivElement>('#winner_btn_container')
        const battleBtns = document.querySelectorAll<HTMLButtonElement>('.winner')
        if (battleBtnsContainer) {
            battleBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const playerIndex = btn.getAttribute('data-player-index')
                    if (playerIndex) {
                        game.setBattleWinner(parseInt(playerIndex))
                        battleBtnsContainer.classList.add('hidden')
                    }
                })
            })
        }
    })
})
