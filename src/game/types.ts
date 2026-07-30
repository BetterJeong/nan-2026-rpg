/** 장비 슬롯 */
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
  /** 상점 정가. 드롭 아이템은 sellValue만 사용 */
  buyPrice?: number
  sellPrice: number
  description: string
  /** 드롭 가능 여부 */
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
  /** 공격력 배수 (공격 스킬) */
  power?: number
  /** 고정 추가 피해 */
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
  /** 아이템 줍기 이벤트용 풀 */
  forageItems: string[]
  goldMin: number
  goldMax: number
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
  helmet: '모자',
  armor: '상의',
  legs: '하의',
  boots: '신발',
  gloves: '장갑',
  weapon: '무기',
  ring: '반지',
  necklace: '목걸이',
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
