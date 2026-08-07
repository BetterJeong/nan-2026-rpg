import type { MonsterDef, SkillDef, ZoneDef } from '../types'

export const SKILLS: Record<string, SkillDef> = {
  slash: {
    id: 'slash',
    name: 'slash',
    mpCost: 5,
    power: 1.6,
    description: 'Heavy strike. 160% ATK damage. (MP 5)',
    unlockLevel: 1,
  },
  focus: {
    id: 'focus',
    name: 'focus',
    mpCost: 8,
    power: 1.3,
    bonus: 4,
    description: 'Focused hit. 130% ATK + 4 damage. (MP 8)',
    unlockLevel: 3,
  },
  mend: {
    id: 'mend',
    name: 'mend',
    mpCost: 10,
    heal: 35,
    description: 'Restore wounds. Heal 35 HP. (MP 10)',
    unlockLevel: 2,
  },
  bash: {
    id: 'bash',
    name: 'bash',
    mpCost: 12,
    power: 2.0,
    description: 'Crushing blow. 200% ATK damage. (MP 12)',
    unlockLevel: 5,
  },
}

export const MONSTERS: Record<string, MonsterDef> = {
  slime: {
    id: 'slime',
    name: 'slime',
    level: 1,
    hp: 22,
    atk: 6,
    def: 1,
    exp: 8,
    goldMin: 3,
    goldMax: 8,
    dropIds: ['cloth_cap', 'straw_boots', 'wood_sword', 'hp_potion_s'],
    dropChance: 0.28,
  },
  forest_bug: {
    id: 'forest_bug',
    name: 'forest-bug',
    level: 1,
    hp: 18,
    atk: 7,
    def: 0,
    exp: 7,
    goldMin: 2,
    goldMax: 7,
    dropIds: ['cloth_gloves', 'cloth_pants', 'mp_potion_s'],
    dropChance: 0.25,
  },
  wolf_pup: {
    id: 'wolf_pup',
    name: 'wolf-pup',
    level: 2,
    hp: 30,
    atk: 9,
    def: 2,
    exp: 14,
    goldMin: 5,
    goldMax: 12,
    dropIds: ['cloth_shirt', 'copper_ring', 'wood_necklace', 'rusty_dagger'],
    dropChance: 0.3,
  },
  wild_boar: {
    id: 'wild_boar',
    name: 'wild-boar',
    level: 3,
    hp: 42,
    atk: 12,
    def: 3,
    exp: 22,
    goldMin: 8,
    goldMax: 18,
    dropIds: ['leather_hood', 'leather_boots', 'leather_gloves', 'hp_potion_m'],
    dropChance: 0.32,
  },
  goblin: {
    id: 'goblin',
    name: 'goblin',
    level: 3,
    hp: 38,
    atk: 13,
    def: 2,
    exp: 24,
    goldMin: 10,
    goldMax: 20,
    dropIds: ['iron_blade', 'leather_vest', 'tin_ring', 'mp_potion_m'],
    dropChance: 0.3,
  },
  forest_spider: {
    id: 'forest_spider',
    name: 'forest-spider',
    level: 4,
    hp: 48,
    atk: 15,
    def: 4,
    exp: 30,
    goldMin: 12,
    goldMax: 24,
    dropIds: ['leather_pants', 'leather_gloves', 'copper_ring', 'hp_potion_m'],
    dropChance: 0.33,
  },
  elder_wolf: {
    id: 'elder_wolf',
    name: 'elder-wolf',
    level: 5,
    hp: 62,
    atk: 18,
    def: 5,
    exp: 40,
    goldMin: 16,
    goldMax: 32,
    dropIds: ['hunter_blade', 'forest_cloak', 'amber_necklace', 'tin_ring'],
    dropChance: 0.35,
  },
  treant_sapling: {
    id: 'treant_sapling',
    name: 'treant-sapling',
    level: 6,
    hp: 78,
    atk: 16,
    def: 8,
    exp: 48,
    goldMin: 18,
    goldMax: 36,
    dropIds: ['forest_cloak', 'amber_necklace', 'iron_blade', 'hp_potion_m'],
    dropChance: 0.36,
  },
}

export const ZONES: Record<string, ZoneDef> = {
  forest1: {
    id: 'forest1',
    name: 'forest1',
    minLevel: 1,
    description: 'Shallow woods for beginners. (rec. Lv.1+)',
    monsters: ['slime', 'forest_bug', 'wolf_pup'],
    forageItems: ['hp_potion_s', 'mp_potion_s', 'cloth_cap', 'straw_boots', 'wood_sword'],
    goldMin: 5,
    goldMax: 15,
    aliases: ['숲1'],
  },
  forest2: {
    id: 'forest2',
    name: 'forest2',
    minLevel: 3,
    description: 'Deeper forest with real threats. (rec. Lv.3+)',
    monsters: ['wild_boar', 'goblin', 'forest_spider'],
    forageItems: ['hp_potion_m', 'mp_potion_m', 'leather_hood', 'leather_boots', 'rusty_dagger'],
    goldMin: 12,
    goldMax: 28,
    aliases: ['숲2'],
  },
  forest3: {
    id: 'forest3',
    name: 'forest3',
    minLevel: 5,
    description: 'Primeval woods. Strong mobs. (rec. Lv.5+)',
    monsters: ['elder_wolf', 'treant_sapling', 'forest_spider'],
    forageItems: ['hp_potion_m', 'mp_potion_m', 'hunter_blade', 'forest_cloak', 'amber_necklace'],
    goldMin: 20,
    goldMax: 40,
    aliases: ['숲3'],
  },
}

/** Resolve zone by id, name, or alias */
export function findZone(query: string): ZoneDef | undefined {
  const q = query.trim().toLowerCase()
  return Object.values(ZONES).find(
    (z) =>
      z.id === q ||
      z.name.toLowerCase() === q ||
      z.name === query.trim() ||
      z.aliases?.some((a) => a === query.trim() || a.toLowerCase() === q),
  )
}

export const SHOP_CATALOG: string[] = [
  'hp_potion_s',
  'hp_potion_m',
  'mp_potion_s',
  'mp_potion_m',
  'shop_wood_sword',
  'shop_iron_sword',
  'shop_cloth_set_helm',
  'shop_cloth_armor',
  'shop_cloth_legs',
  'shop_boots',
  'shop_gloves',
  'shop_ring',
  'shop_necklace',
]

export function expToNext(level: number): number {
  return Math.floor(20 + (level - 1) * 18 + (level - 1) ** 1.5 * 4)
}
