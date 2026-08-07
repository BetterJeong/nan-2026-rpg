/** Equipment slot */
export type EquipSlot =
  | 'helmet'
  | 'armor'
  | 'legs'
  | 'boots'
  | 'gloves'
  | 'weapon'
  | 'ring'
  | 'necklace'

export type ItemKind = 'equipment' | 'consumable'

export type ConsumableEffect = {
  healHp?: number
  healMp?: number
}

export type ItemDef = {
  id: string
  name: string
  kind: ItemKind
  slot?: EquipSlot
  atk?: number
  def?: number
  hp?: number
  mp?: number
  effect?: ConsumableEffect
  /** Shop list price. Drop items use sellPrice only. */
  buyPrice?: number
  sellPrice: number
  description: string
  droppable?: boolean
  dropWeight?: number
  minZone?: number
}

export type InventoryEntry = {
  itemId: string
  qty: number
}

export type Equipment = Partial<Record<EquipSlot, string>>

export type SkillDef = {
  id: string
  name: string
  mpCost: number
  /** ATK multiplier */
  power?: number
  /** Flat bonus damage */
  bonus?: number
  heal?: number
  description: string
  unlockLevel: number
}

export type MonsterDef = {
  id: string
  name: string
  level: number
  hp: number
  atk: number
  def: number
  exp: number
  goldMin: number
  goldMax: number
  dropIds: string[]
  dropChance: number
}

export type ZoneDef = {
  id: string
  name: string
  minLevel: number
  description: string
  monsters: string[]
  forageItems: string[]
  goldMin: number
  goldMax: number
  /** Extra aliases (e.g. Korean names) */
  aliases?: string[]
}

export type Location = 'town' | 'shop' | string

export type CombatAction = 'attack' | 'skill' | 'defend' | 'use' | 'flee'

export type CombatState = {
  monsterId: string
  monsterHp: number
  monsterMaxHp: number
  playerDefending: boolean
  turn: 'player' | 'enemy'
  log: string[]
}

export type PlayerState = {
  name: string
  level: number
  exp: number
  gold: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  baseAtk: number
  baseDef: number
  inventory: InventoryEntry[]
  equipment: Equipment
  location: Location
  skills: string[]
}

export type GameMode = 'idle' | 'combat' | 'dead'

export type GameState = {
  player: PlayerState
  mode: GameMode
  combat: CombatState | null
  history: string[]
  messages: TerminalLine[]
}

export type TerminalLine = {
  kind: 'system' | 'input' | 'output' | 'combat' | 'loot' | 'error' | 'success'
  text: string
}

export const SLOT_LABELS: Record<EquipSlot, string> = {
  helmet: 'helmet',
  armor: 'armor',
  legs: 'legs',
  boots: 'boots',
  gloves: 'gloves',
  weapon: 'weapon',
  ring: 'ring',
  necklace: 'necklace',
}

export const SLOT_ORDER: EquipSlot[] = [
  'helmet',
  'armor',
  'legs',
  'boots',
  'gloves',
  'weapon',
  'ring',
  'necklace',
]
