import { ITEMS, getItem } from './data/items'
import { SKILLS, expToNext } from './data/content'
import { itemLabel, itemMatchesQuery, skillEffectDesc, skillLabel, t } from './i18n'
import type { EquipSlot, InventoryEntry, PlayerState } from './types'
import { SLOT_ORDER } from './types'

export function createNewPlayer(name = 'player'): PlayerState {
  return {
    name,
    level: 1,
    exp: 0,
    gold: 50,
    hp: 50,
    maxHp: 50,
    mp: 30,
    maxMp: 30,
    baseAtk: 5,
    baseDef: 5,
    inventory: [
      { itemId: 'hp_potion_s', qty: 3 },
      { itemId: 'mp_potion_s', qty: 2 },
    ],
    equipment: {},
    location: 'town',
    skills: ['slash'],
    bossesDefeated: [],
    npcAffinity: {},
    npcGiftStage: {},
    npcDialogueSeen: {},
  }
}

/** Hidden admin fixture — tuned for a ~45s demo recording flow. */
export function createAdminTestPlayer(name = 'tester'): PlayerState {
  const level = 5
  const gained = level - 1
  const player: PlayerState = {
    name,
    level,
    exp: 20,
    gold: 420,
    hp: 50 + gained * 10,
    maxHp: 50 + gained * 10,
    mp: 30 + gained * 5,
    maxMp: 30 + gained * 5,
    baseAtk: 5 + gained * 2,
    baseDef: 5 + gained * 1,
    inventory: [
      { itemId: 'hp_potion_m', qty: 5 },
      { itemId: 'mp_potion_m', qty: 5 },
      { itemId: 'hp_potion_s', qty: 3 },
      { itemId: 'mp_potion_s', qty: 3 },
      { itemId: 'iron_blade', qty: 1 },
      { itemId: 'leather_vest', qty: 1 },
    ],
    equipment: {
      weapon: 'hunter_blade',
      armor: 'forest_cloak',
      helmet: 'leather_hood',
      legs: 'leather_pants',
      boots: 'leather_boots',
      gloves: 'leather_gloves',
      ring: 'tin_ring',
      necklace: 'amber_necklace',
    },
    location: 'town',
    skills: Object.values(SKILLS)
      .filter((s) => !s.hidden && s.unlockLevel <= level)
      .map((s) => s.id),
    bossesDefeated: [],
    // Mild affinity so talk UI looks alive on first chat
    npcAffinity: { mira: 12, bram: 8 },
    npcGiftStage: {},
    npcDialogueSeen: {},
  }
  clampVitals(player)
  player.hp = getEffectiveMaxHp(player)
  player.mp = getEffectiveMaxMp(player)
  return player
}

export function getEquipBonus(player: PlayerState): {
  atk: number
  def: number
  hp: number
  mp: number
} {
  let atk = 0
  let def = 0
  let hp = 0
  let mp = 0
  for (const slot of SLOT_ORDER) {
    const id = player.equipment[slot]
    if (!id) continue
    const item = getItem(id)
    if (!item) continue
    atk += item.atk ?? 0
    def += item.def ?? 0
    hp += item.hp ?? 0
    mp += item.mp ?? 0
  }
  return { atk, def, hp, mp }
}

export function getTotalAtk(player: PlayerState): number {
  return player.baseAtk + getEquipBonus(player).atk
}

export function getTotalDef(player: PlayerState): number {
  return player.baseDef + getEquipBonus(player).def
}

export function getEffectiveMaxHp(player: PlayerState): number {
  return player.maxHp + getEquipBonus(player).hp
}

export function getEffectiveMaxMp(player: PlayerState): number {
  return player.maxMp + getEquipBonus(player).mp
}

export function clampVitals(player: PlayerState): void {
  const maxHp = getEffectiveMaxHp(player)
  const maxMp = getEffectiveMaxMp(player)
  player.hp = Math.min(player.hp, maxHp)
  player.mp = Math.min(player.mp, maxMp)
  player.hp = Math.max(0, player.hp)
  player.mp = Math.max(0, player.mp)
}

/** Full HP/MP restore (town rest). */
export function fullRest(player: PlayerState): void {
  player.hp = getEffectiveMaxHp(player)
  player.mp = getEffectiveMaxMp(player)
}

/** Heal a fraction of max HP/MP (e.g. 0.1 = 10%). Returns actual deltas. */
export function regenFraction(
  player: PlayerState,
  fraction: number,
): { hp: number; mp: number } {
  const maxHp = getEffectiveMaxHp(player)
  const maxMp = getEffectiveMaxMp(player)
  const gainHp = Math.max(1, Math.floor(maxHp * fraction))
  const gainMp = Math.max(1, Math.floor(maxMp * fraction))
  const beforeHp = player.hp
  const beforeMp = player.mp
  player.hp = Math.min(maxHp, player.hp + gainHp)
  player.mp = Math.min(maxMp, player.mp + gainMp)
  return { hp: player.hp - beforeHp, mp: player.mp - beforeMp }
}

/** Set HP/MP to a fraction of max (defeat respawn). HP at least 1. */
export function setVitalsFraction(player: PlayerState, fraction: number): void {
  const maxHp = getEffectiveMaxHp(player)
  const maxMp = getEffectiveMaxMp(player)
  player.hp = Math.max(1, Math.floor(maxHp * fraction))
  player.mp = Math.max(0, Math.floor(maxMp * fraction))
}

export function inventoryQty(player: PlayerState, itemId: string): number {
  return player.inventory.find((e) => e.itemId === itemId)?.qty ?? 0
}

export function addItem(player: PlayerState, itemId: string, qty = 1): void {
  if (!ITEMS[itemId]) return
  const entry = player.inventory.find((e) => e.itemId === itemId)
  if (entry) entry.qty += qty
  else player.inventory.push({ itemId, qty })
}

export function removeItem(player: PlayerState, itemId: string, qty = 1): boolean {
  const idx = player.inventory.findIndex((e) => e.itemId === itemId)
  if (idx < 0) return false
  const entry = player.inventory[idx]
  if (entry.qty < qty) return false
  entry.qty -= qty
  if (entry.qty <= 0) player.inventory.splice(idx, 1)
  return true
}

export function useConsumable(player: PlayerState, itemId: string): string | null {
  const item = getItem(itemId)
  if (!item || item.kind !== 'consumable' || !item.effect) {
    return t('player.errNotConsumable')
  }
  if (inventoryQty(player, itemId) < 1) return t('player.errNoItem')

  removeItem(player, itemId, 1)
  const maxHp = getEffectiveMaxHp(player)
  const maxMp = getEffectiveMaxMp(player)
  const parts: string[] = []

  if (item.effect.healHp) {
    const before = player.hp
    player.hp = Math.min(maxHp, player.hp + item.effect.healHp)
    parts.push(`HP ${before} -> ${player.hp}`)
  }
  if (item.effect.healMp) {
    const before = player.mp
    player.mp = Math.min(maxMp, player.mp + item.effect.healMp)
    parts.push(`MP ${before} -> ${player.mp}`)
  }

  return t('player.used', { item: itemLabel(item), parts: parts.join(', ') })
}

export function equipItem(player: PlayerState, itemId: string): string {
  const item = getItem(itemId)
  if (!item || item.kind !== 'equipment' || !item.slot) {
    return t('player.errNotEquip')
  }
  if (inventoryQty(player, itemId) < 1) return t('player.errNoItem')

  const slot = item.slot as EquipSlot
  const prev = player.equipment[slot]
  removeItem(player, itemId, 1)
  if (prev) addItem(player, prev, 1)
  player.equipment[slot] = itemId
  clampVitals(player)
  const prevText = prev
    ? t('player.unequippedPrev', { item: itemLabel(prev) })
    : ''
  return t('player.equipped', { item: itemLabel(item), prev: prevText })
}

export function unequipItem(player: PlayerState, slotOrName: string): string {
  const slot = resolveSlot(slotOrName)
  if (!slot) {
    return t('player.errSlot')
  }
  const id = player.equipment[slot]
  if (!id) return t('player.errEmptySlot')
  delete player.equipment[slot]
  addItem(player, id, 1)
  clampVitals(player)
  return t('player.unequipped', { item: itemLabel(id) })
}

function resolveSlot(q: string): EquipSlot | null {
  const map: Record<string, EquipSlot> = {
    helmet: 'helmet',
    모자: 'helmet',
    armor: 'armor',
    상의: 'armor',
    legs: 'legs',
    하의: 'legs',
    boots: 'boots',
    신발: 'boots',
    gloves: 'gloves',
    장갑: 'gloves',
    weapon: 'weapon',
    무기: 'weapon',
    ring: 'ring',
    반지: 'ring',
    necklace: 'necklace',
    목걸이: 'necklace',
  }
  return map[q.toLowerCase()] ?? map[q] ?? null
}

export function applyLevelUps(player: PlayerState): string[] {
  const logs: string[] = []
  while (player.exp >= expToNext(player.level)) {
    player.exp -= expToNext(player.level)
    player.level += 1
    player.baseAtk += 2
    player.baseDef += 1
    player.maxHp += 10
    player.maxMp += 5
    player.hp = getEffectiveMaxHp(player)
    player.mp = getEffectiveMaxMp(player)

    for (const skill of Object.values(SKILLS)) {
      if (skill.hidden) continue
      if (skill.unlockLevel === player.level && !player.skills.includes(skill.id)) {
        player.skills.push(skill.id)
        logs.push(
          t('player.skillUnlock', {
            skill: skillLabel(skill.id),
            effect: skillEffectDesc(skill.id),
          }),
        )
      }
    }

    logs.push(
      t('player.levelUp', {
        level: player.level,
        atk: player.baseAtk,
        def: player.baseDef,
      }),
    )
  }
  return logs
}

export function findInventoryItem(player: PlayerState, query: string): InventoryEntry | undefined {
  return player.inventory.find((e) => {
    const item = getItem(e.itemId)
    if (!item) return false
    return itemMatchesQuery(item, query)
  })
}

export function findOwnedOrEquipped(player: PlayerState, query: string): string | null {
  const inv = findInventoryItem(player, query)
  if (inv) return inv.itemId
  for (const slot of SLOT_ORDER) {
    const id = player.equipment[slot]
    if (!id) continue
    const item = getItem(id)
    if (item && itemMatchesQuery(item, query)) return id
  }
  return null
}

export function isErrorMsg(msg: string | null | undefined): boolean {
  return !!msg && msg.startsWith('error:')
}
