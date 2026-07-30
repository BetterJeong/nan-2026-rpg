import { MONSTERS, SKILLS } from './data/content'
import { getItem } from './data/items'
import type { CombatState, PlayerState } from './types'
import {
  addItem,
  applyLevelUps,
  getEffectiveMaxHp,
  getTotalAtk,
  getTotalDef,
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
    log: [`야생의 ${m.name}(Lv.${m.level})이(가) 나타났다!`],
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
  const messages = [`기본 공격! ${m.name}에게 ${dmg} 피해. (적 HP ${combat.monsterHp}/${combat.monsterMaxHp})`]
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
  if (!skill) return { messages: ['알 수 없는 스킬입니다.'], ended: false }
  if (!player.skills.includes(skillId)) {
    return { messages: ['아직 해금되지 않은 스킬입니다.'], ended: false }
  }
  if (player.mp < skill.mpCost) {
    return { messages: [`마나가 부족합니다. (필요 MP ${skill.mpCost}, 현재 ${player.mp})`], ended: false }
  }

  player.mp -= skill.mpCost
  combat.playerDefending = false
  const m = MONSTERS[combat.monsterId]
  const messages: string[] = []

  if (skill.heal) {
    const maxHp = getEffectiveMaxHp(player)
    const before = player.hp
    player.hp = Math.min(maxHp, player.hp + skill.heal)
    messages.push(
      `${skill.name}! HP ${before} → ${player.hp} (MP -${skill.mpCost})`,
    )
    return enemyTurn(player, combat, messages)
  }

  const power = skill.power ?? 1
  const bonus = skill.bonus ?? 0
  const atk = Math.floor(getTotalAtk(player) * power) + bonus
  const dmg = calcDamage(atk, m.def, 0.12)
  combat.monsterHp = Math.max(0, combat.monsterHp - dmg)
  messages.push(
    `${skill.name}! ${m.name}에게 ${dmg} 피해. (MP -${skill.mpCost}, 적 HP ${combat.monsterHp}/${combat.monsterMaxHp})`,
  )

  if (combat.monsterHp <= 0) {
    return finishVictory(player, combat, messages)
  }
  return enemyTurn(player, combat, messages)
}

export function playerDefend(player: PlayerState, combat: CombatState): CombatResult {
  combat.playerDefending = true
  const messages = ['방어 태세! 이번 적의 공격 피해가 절반이 됩니다.']
  return enemyTurn(player, combat, messages)
}

export function playerUseItem(
  player: PlayerState,
  combat: CombatState,
  itemId: string,
): CombatResult {
  const result = useConsumable(player, itemId)
  if (!result || result.includes('없습니다') || result.includes('아닙니다')) {
    return { messages: [result ?? '사용 실패'], ended: false }
  }
  combat.playerDefending = false
  return enemyTurn(player, combat, [result])
}

export function playerFlee(player: PlayerState, combat: CombatState): CombatResult {
  const m = MONSTERS[combat.monsterId]
  const chance = Math.max(0.25, 0.55 - (m.level - player.level) * 0.08)
  if (Math.random() < chance) {
    return {
      messages: [`도망에 성공했다!`],
      ended: true,
      fled: true,
    }
  }
  const messages = ['도망에 실패했다!']
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
  if (combat.playerDefending) {
    dmg = Math.max(1, Math.floor(dmg * 0.5))
    messages.push(`(방어) ${m.name}의 공격! ${dmg} 피해를 입었다.`)
  } else {
    messages.push(`${m.name}의 공격! ${dmg} 피해를 입었다.`)
  }
  combat.playerDefending = false
  player.hp = Math.max(0, player.hp - dmg)
  messages.push(`내 HP ${player.hp}/${getEffectiveMaxHp(player)}`)

  if (player.hp <= 0) {
    messages.push('당신은 쓰러졌다... 마을에서 부활합니다. (골드 20% 손실)')
    const loss = Math.floor(player.gold * 0.2)
    player.gold -= loss
    player.hp = Math.max(1, Math.floor(getEffectiveMaxHp(player) * 0.5))
    player.mp = Math.floor(player.mp * 0.5)
    player.location = 'town'
    messages.push(`골드 -${loss}G → ${player.gold}G | 마을로 이동했습니다.`)
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
  messages.push(`${m.name}을(를) 처치했다!`)

  const gold = randInt(m.goldMin, m.goldMax)
  player.gold += gold
  player.exp += m.exp
  messages.push(`경험치 +${m.exp} | 골드 +${gold}G`)

  if (Math.random() < m.dropChance && m.dropIds.length) {
    const dropId = m.dropIds[Math.floor(Math.random() * m.dropIds.length)]
    addItem(player, dropId, 1)
    const item = getItem(dropId)
    messages.push(`드롭: ${item?.name ?? dropId}`)
  }

  const levelLogs = applyLevelUps(player)
  messages.push(...levelLogs)

  return { messages, ended: true, victory: true }
}

export function resolveSkillQuery(query: string, player: PlayerState): string | null {
  const q = query.trim().toLowerCase()
  for (const id of player.skills) {
    const s = SKILLS[id]
    if (s.id === q || s.name.toLowerCase() === q || s.name === query.trim()) return id
  }
  // allow unlocking check by name even if not owned — return id if exists in SKILLS
  for (const s of Object.values(SKILLS)) {
    if (s.id === q || s.name.toLowerCase() === q || s.name === query.trim()) return s.id
  }
  return null
}

export function findConsumableId(player: PlayerState, query: string): string | null {
  const q = query.trim().toLowerCase()
  for (const e of player.inventory) {
    const item = getItem(e.itemId)
    if (!item || item.kind !== 'consumable') continue
    if (item.id === q || item.name.toLowerCase() === q || item.name === query.trim()) {
      return item.id
    }
  }
  return null
}
