import { MONSTERS, SKILLS } from './data/content'
import { getItem } from './data/items'
import {
  itemLabel,
  itemMatchesQuery,
  monsterLabel,
  skillLabel,
  skillMatchesQuery,
  t,
} from './i18n'
import type { CombatState, PlayerState } from './types'
import {
  addItem,
  applyLevelUps,
  getEffectiveMaxHp,
  getTotalAtk,
  getTotalDef,
  isErrorMsg,
  useConsumable,
} from './player'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calcDamage(atk: number, def: number, variance = 0.15): number {
  const raw = atk - def * 0.5
  const base = Math.max(1, Math.floor(raw))
  const factor = 1 + (Math.random() * 2 - 1) * variance
  return Math.max(1, Math.floor(base * factor))
}

export function startCombat(monsterId: string): CombatState {
  const m = MONSTERS[monsterId]
  return {
    monsterId,
    monsterHp: m.hp,
    monsterMaxHp: m.hp,
    playerDefending: false,
    turn: 'player',
    log: [t('combat.appear', { name: monsterLabel(monsterId), level: m.level })],
  }
}

export type CombatResult = {
  messages: string[]
  ended: boolean
  victory?: boolean
  fled?: boolean
}

export function playerAttack(player: PlayerState, combat: CombatState): CombatResult {
  const m = MONSTERS[combat.monsterId]
  const dmg = calcDamage(getTotalAtk(player), m.def)
  combat.monsterHp = Math.max(0, combat.monsterHp - dmg)
  const messages = [
    t('combat.attack', {
      name: monsterLabel(combat.monsterId),
      dmg,
      hp: combat.monsterHp,
      max: combat.monsterMaxHp,
    }),
  ]
  combat.playerDefending = false

  if (combat.monsterHp <= 0) {
    return finishVictory(player, combat, messages)
  }
  return enemyTurn(player, combat, messages)
}

export function playerSkill(
  player: PlayerState,
  combat: CombatState,
  skillId: string,
): CombatResult {
  const skill = SKILLS[skillId]
  if (!skill) return { messages: [t('combat.errSkill')], ended: false }
  if (!player.skills.includes(skillId)) {
    return { messages: [t('combat.errLocked')], ended: false }
  }
  if (player.mp < skill.mpCost) {
    return {
      messages: [t('combat.errMp', { need: skill.mpCost, have: player.mp })],
      ended: false,
    }
  }

  player.mp -= skill.mpCost
  combat.playerDefending = false
  const m = MONSTERS[combat.monsterId]
  const messages: string[] = []
  const sName = skillLabel(skillId)

  if (skill.heal) {
    const maxHp = getEffectiveMaxHp(player)
    const before = player.hp
    player.hp = Math.min(maxHp, player.hp + skill.heal)
    messages.push(
      t('combat.skillHeal', {
        skill: sName,
        before,
        after: player.hp,
        mp: skill.mpCost,
      }),
    )
    return enemyTurn(player, combat, messages)
  }

  const power = skill.power ?? 1
  const bonus = skill.bonus ?? 0
  const atk = Math.floor(getTotalAtk(player) * power) + bonus
  const dmg = calcDamage(atk, m.def, 0.12)
  combat.monsterHp = Math.max(0, combat.monsterHp - dmg)
  messages.push(
    t('combat.skillDmg', {
      skill: sName,
      name: monsterLabel(combat.monsterId),
      dmg,
      mp: skill.mpCost,
      hp: combat.monsterHp,
      max: combat.monsterMaxHp,
    }),
  )

  if (combat.monsterHp <= 0) {
    return finishVictory(player, combat, messages)
  }
  return enemyTurn(player, combat, messages)
}

export function playerDefend(player: PlayerState, combat: CombatState): CombatResult {
  combat.playerDefending = true
  const messages = [t('combat.defend')]
  return enemyTurn(player, combat, messages)
}

export function playerUseItem(
  player: PlayerState,
  combat: CombatState,
  itemId: string,
): CombatResult {
  const result = useConsumable(player, itemId)
  if (isErrorMsg(result)) {
    return { messages: [result ?? t('combat.errUse')], ended: false }
  }
  combat.playerDefending = false
  return enemyTurn(player, combat, [result!])
}

export function playerFlee(player: PlayerState, combat: CombatState): CombatResult {
  const m = MONSTERS[combat.monsterId]
  const chance = Math.max(0.25, 0.55 - (m.level - player.level) * 0.08)
  if (Math.random() < chance) {
    return {
      messages: [t('combat.fleeOk')],
      ended: true,
      fled: true,
    }
  }
  const messages = [t('combat.fleeFail')]
  combat.playerDefending = false
  return enemyTurn(player, combat, messages)
}

function enemyTurn(
  player: PlayerState,
  combat: CombatState,
  messages: string[],
): CombatResult {
  const m = MONSTERS[combat.monsterId]
  let dmg = calcDamage(m.atk, getTotalDef(player))
  const name = monsterLabel(combat.monsterId)
  if (combat.playerDefending) {
    dmg = Math.max(1, Math.floor(dmg * 0.5))
    messages.push(t('combat.hitGuard', { name, dmg }))
  } else {
    messages.push(t('combat.hit', { name, dmg }))
  }
  combat.playerDefending = false
  player.hp = Math.max(0, player.hp - dmg)
  messages.push(t('combat.yourHp', { hp: player.hp, max: getEffectiveMaxHp(player) }))

  if (player.hp <= 0) {
    messages.push(t('combat.dead'))
    const loss = Math.floor(player.gold * 0.2)
    player.gold -= loss
    player.hp = Math.max(1, Math.floor(getEffectiveMaxHp(player) * 0.5))
    player.mp = Math.floor(player.mp * 0.5)
    player.location = 'town'
    messages.push(t('combat.deadGold', { loss, gold: player.gold }))
    return { messages, ended: true, victory: false }
  }

  return { messages, ended: false }
}

function finishVictory(
  player: PlayerState,
  combat: CombatState,
  messages: string[],
): CombatResult {
  const m = MONSTERS[combat.monsterId]
  messages.push(t('combat.win', { name: monsterLabel(combat.monsterId) }))

  const gold = randInt(m.goldMin, m.goldMax)
  player.gold += gold
  player.exp += m.exp
  messages.push(t('combat.reward', { exp: m.exp, gold }))

  if (Math.random() < m.dropChance && m.dropIds.length) {
    const dropId = m.dropIds[Math.floor(Math.random() * m.dropIds.length)]
    addItem(player, dropId, 1)
    messages.push(t('combat.drop', { item: itemLabel(dropId) }))
  }

  const levelLogs = applyLevelUps(player)
  messages.push(...levelLogs)

  return { messages, ended: true, victory: true }
}

export function resolveSkillQuery(query: string, player: PlayerState): string | null {
  for (const id of player.skills) {
    if (skillMatchesQuery(id, query)) return id
  }
  for (const s of Object.values(SKILLS)) {
    if (skillMatchesQuery(s.id, query)) return s.id
  }
  return null
}

export function findConsumableId(player: PlayerState, query: string): string | null {
  for (const e of player.inventory) {
    const item = getItem(e.itemId)
    if (!item || item.kind !== 'consumable') continue
    if (itemMatchesQuery(item, query)) return item.id
  }
  return null
}
