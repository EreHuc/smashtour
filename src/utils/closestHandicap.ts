import { handicaps } from '../const'

export const closestHandicap = (handicap: number) => handicaps.findLast((h) => h <= handicap) ?? handicap
