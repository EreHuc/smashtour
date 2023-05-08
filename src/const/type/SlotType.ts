import { SlotTypeName } from './SlotTypeName.enum.ts'
import { Character } from './Character.enum.ts'
import { Chest } from './Chest.enum.ts'
import { Chance } from './Chance.enum.ts'
import { Station } from './Station.enum.ts'

export type Pool = Character | Chest | Chance | Station

export interface PoolChampType<T extends Pool = Pool> {
    no_dlc: T[] | T[][]
    pool: T[] | T[][]
}

export interface SlotType extends Partial<PoolChampType> {
    type: string
    one?: number[]
    two?: number[]
    handicaps?: number[]
    colour?: string
    handicap?: number
    handicapSet?: number
    count?: number
    orig_pool?: Pool[] | Pool[][]
}

export interface RegularSlotType extends PoolChampType<Character> {
    type:
        | SlotTypeName.brown
        | SlotTypeName.lightblue
        | SlotTypeName.pink
        | SlotTypeName.orange
        | SlotTypeName.red
        | SlotTypeName.yellow
        | SlotTypeName.green
        | SlotTypeName.blue
    colour: string
    handicap: number
    handicapSet: number
}

export interface SlotChest extends PoolChampType<Chest> {
    type: SlotTypeName.chest
}

export interface SlotChance extends PoolChampType<Chance> {
    type: SlotTypeName.chance
}

export interface SlotStart {
    type: SlotTypeName.go
}

export interface SlotVisiting extends PoolChampType<Character> {
    type: SlotTypeName.visiting
}

export interface SlotBanned {
    type: SlotTypeName.banned
}

export interface SlotToBanned {
    type: SlotTypeName.tobanned
}

export interface SlotFree {
    type: SlotTypeName.free
}

export interface SlotLowTierTax extends PoolChampType<Character> {
    type: SlotTypeName.lowtiertax
}

export interface SlotLameTax extends PoolChampType<Character> {
    type: SlotTypeName.lametax
}

export interface SlotUtility extends PoolChampType<Character> {
    type: SlotTypeName.utility
    one: number[]
    two: number[]
}

export interface SlotStation extends PoolChampType<Station> {
    type: SlotTypeName.station
    handicaps: number[]
}
