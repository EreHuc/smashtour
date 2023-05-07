import setEvents from './events'
import { Game } from './object'

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game()
    console.log(game)
    setEvents(game)
})
