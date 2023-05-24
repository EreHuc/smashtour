import { handicaps } from '../const/handicaps.ts'

export const closestHandicap = (handicap: number) => handicaps.findLast((h) => h <= handicap) ?? handicap
