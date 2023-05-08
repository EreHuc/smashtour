import { Pool } from './SlotType.ts'
import { CornerName } from './CornerName.enum.ts'
import { SlotTypeName } from './SlotTypeName.enum.ts'
import { Series } from './Series.enum.ts'

export * from './SlotType.ts'
export type Name = Pool | CornerName | SlotTypeName | Series
