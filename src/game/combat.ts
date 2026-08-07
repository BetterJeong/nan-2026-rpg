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
  getEffectiveMaxMp,
  getTotalAtk,
  getTotalDef,
  isErrorMsg,
  regenFraction,
  setVitalsFraction,
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
  const appearKey = m.isBoss ? 'combat.appearBoss' : 'combat.appear'
  return {
    monsterId,
    monsterHp: m.hp,
    monsterMaxHp: m.hp,
    playerDefending: false,
    turn: 'player',
    log: [t(appearKey, { name: monsterLabel(monsterId), level: m.level })],
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
  const chance = m.isBoss
    ? 0.08
    : Math.max(0.25, 0.55 - (m.level - player.level) * 0.08)
  if (Math.random() < chance) {
    return {
      messages: [t('combat.fleeOk')],
      ended: true,
      fled: true,
    }
  }
  const messages = [t(m.isBoss ? 'combat.fleeFailBoss' : 'combat.fleeFail')]
  combat.playerDefending = false
  return enemyTurn(player, combat, messages)
}

function enemyTurn(
  player: PlayerState,
  combat: CombatState,
  messages: string[],
): CombatResult {
  const m = MONSTERS[combat.monsterId]
  const name = monsterLabel(combat.monsterId)

  const useSkill =
    m.isBoss &&
    m.skills &&
    m.skills.length > 0 &&
    Math.random() < 0.4

  if (useSkill) {
    const skillId = m.skills![Math.floor(Math.random() * m.skills!.length)]
    const skill = SKILLS[skillId]
    if (skill?.heal) {
      const before = combat.monsterHp
      combat.monsterHp = Math.min(combat.monsterMaxHp, combat.monsterHp + skill.heal)
      messages.push(
        t('combat.bossHeal', {
          name,
          skill: skillLabel(skillId),
          heal: combat.monsterHp - before,
          hp: combat.monsterHp,
          max: combat.monsterMaxHp,
        }),
      )
      combat.playerDefending = false
      return { messages, ended: false }
    } else if (skill) {
      const power = skill.power ?? 1
      const bonus = skill.bonus ?? 0
      const atk = Math.floor(m.atk * power) + bonus
      let dmg = calcDamage(atk, getTotalDef(player), 0.12)
      if (combat.playerDefending) {
        dmg = Math.max(1, Math.floor(dmg * 0.5))
        messages.push(
          t('combat.bossSkillGuard', {
            name,
            skill: skillLabel(skillId),
            dmg,
          }),
        )
      } else {
        messages.push(
          t('combat.bossSkill', {
            name,
            skill: skillLabel(skillId),
            dmg,
          }),
        )
      }
      player.hp = Math.max(0, player.hp - dmg)
      messages.push(t('combat.yourHp', { hp: player.hp, max: getEffectiveMaxHp(player) }))
      combat.playerDefending = false
      if (player.hp <= 0) {
        return finishDefeat(player, messages)
      }
      return { messages, ended: false }
    }
  }

  let dmg = calcDamage(m.atk, getTotalDef(player))
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
    return finishDefeat(player, messages)
  }

  return { messages, ended: false }
}

function finishDefeat(player: PlayerState, messages: string[]): CombatResult {
  messages.push(t('combat.dead'))
  const loss = Math.floor(player.gold * 0.2)
  player.gold -= loss
  setVitalsFraction(player, 0.5)
  player.location = 'town'
  messages.push(t('combat.deadGold', { loss, gold: player.gold }))
  messages.push(
    t('combat.deadVitals', {
      hp: player.hp,
      maxHp: getEffectiveMaxHp(player),
      mp: player.mp,
      maxMp: getEffectiveMaxMp(player),
    }),
  )
  return { messages, ended: true, victory: false }
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

  if (m.isBoss) {
    if (!Array.isArray(player.bossesDefeated)) player.bossesDefeated = []
    if (!player.bossesDefeated.includes(m.id)) {
      player.bossesDefeated.push(m.id)
      if (m.id === 'grove_guardian') {
        messages.push(t('combat.bossUnlockSea'))
      } else if (m.id === 'tide_leviathan') {
        messages.push(t('combat.bossUnlockMountain'))
      } else if (m.id === 'tyrant') {
        messages.push(t('combat.bossClearPeak'))
      }
    } else {
      messages.push(t('combat.bossRechallenge'))
    }
  }

  const levelLogs = applyLevelUps(player)
  messages.push(...levelLogs)

  // level-up already full-heals; only regen if still not full
  const regen = regenFraction(player, 0.12)
  if (regen.hp > 0 || regen.mp > 0) {
    messages.push(
      t('combat.regen', {
        hp: regen.hp,
        mp: regen.mp,
        curHp: player.hp,
        maxHp: getEffectiveMaxHp(player),
        curMp: player.mp,
        maxMp: getEffectiveMaxMp(player),
      }),
    )
  }

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
