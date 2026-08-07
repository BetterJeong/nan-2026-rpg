import { BOSS_BY_ZONE, getBossForZone, hasDefeatedBoss, requiredBossForZone, ZONES } from './data/content'
import { getItem } from './data/items'
import { NPCS, npcLabel } from './data/npcs'
import { goCmd, lookaroundCmd } from './i18n'
import type { GameState } from './types'
import { getEffectiveMaxHp, getEffectiveMaxMp } from './player'
import { getSettings, getUiView } from './settings'

export type SuggestChip = {
  /** exact CLI command to run */
  cmd: string
  /** short label on chip (usually same as cmd) */
  label: string
}

const MAX_CHIPS = 6

function langPickerChips(): SuggestChip[] {
  return [
    { cmd: 'lang ko', label: '한국어' },
    { cmd: 'lang en', label: 'English' },
  ]
}

function prependLangPicker(chips: SuggestChip[]): SuggestChip[] {
  if (getSettings().languageChosen) return chips
  const out: SuggestChip[] = []
  pushUnique(out, langPickerChips())
  pushUnique(out, chips)
  return out.slice(0, MAX_CHIPS)
}

function lastRawCmd(state: GameState): string {
  return state.history[state.history.length - 1]?.trim().toLowerCase() ?? ''
}

function isInvFocus(state: GameState): boolean {
  const last = lastRawCmd(state)
  if (!last) return false
  if (last === 'inv' || last === 'inventory' || last === 'i') return true
  if (last.startsWith('equip ') || last.startsWith('unequip ') || last.startsWith('use ')) {
    return true
  }
  return false
}

function equipChips(state: GameState, limit = 4): SuggestChip[] {
  const chips: SuggestChip[] = []
  const seenSlots = new Set<string>()
  for (const e of state.player.inventory) {
    if (chips.length >= limit) break
    const item = getItem(e.itemId)
    if (!item || item.kind !== 'equipment' || !item.slot || e.qty < 1) continue
    // one suggest per slot (best first in bag order)
    if (seenSlots.has(item.slot)) continue
    seenSlots.add(item.slot)
    chips.push({ cmd: `equip ${item.name}`, label: `equip ${item.name}` })
  }
  return chips
}

function firstConsumableCmd(state: GameState): SuggestChip | null {
  for (const e of state.player.inventory) {
    const item = getItem(e.itemId)
    if (item?.kind === 'consumable' && e.qty > 0) {
      return { cmd: `use ${item.name}`, label: `use ${item.name}` }
    }
  }
  return null
}

function firstUnlockedZone(state: GameState): string | null {
  for (const z of Object.values(ZONES)) {
    if (state.player.level < z.minLevel) continue
    const need = requiredBossForZone(z)
    if (need && !hasDefeatedBoss(state.player.bossesDefeated, need)) continue
    return z.id
  }
  return null
}

function nextRegionEntry(state: GameState): string | null {
  const defeated = state.player.bossesDefeated
  if (
    hasDefeatedBoss(defeated, 'grove_guardian') &&
    !hasDefeatedBoss(defeated, 'tide_leviathan') &&
    state.player.level >= ZONES.saltshore.minLevel
  ) {
    return 'saltshore'
  }
  if (
    hasDefeatedBoss(defeated, 'tide_leviathan') &&
    state.player.level >= ZONES.foothill.minLevel
  ) {
    return 'foothill'
  }
  return null
}

function pushUnique(chips: SuggestChip[], next: SuggestChip[]): SuggestChip[] {
  const seen = new Set(chips.map((c) => c.cmd))
  for (const c of next) {
    if (seen.has(c.cmd)) continue
    chips.push(c)
    seen.add(c.cmd)
    if (chips.length >= MAX_CHIPS) break
  }
  return chips
}

function goChip(zoneId: string): SuggestChip {
  const cmd = goCmd(zoneId)
  return { cmd, label: cmd }
}

function lookChip(): SuggestChip {
  const cmd = lookaroundCmd()
  return { cmd, label: cmd }
}

function talkChip(npcId: string): SuggestChip | null {
  const n = NPCS[npcId]
  if (!n) return null
  const name = npcLabel(n)
  const cmd = `talk ${name}`
  return { cmd, label: cmd }
}

/** Contextual command chips for the input dock (mobile-friendly). */
export function getSuggestChips(state: GameState): SuggestChip[] {
  if (getUiView() === 'settings') {
    return [
      { cmd: 'settings close', label: 'settings close' },
      { cmd: 'lang ko', label: '한국어' },
      { cmd: 'lang en', label: 'English' },
      { cmd: 'theme dark', label: 'theme dark' },
      { cmd: 'theme light', label: 'theme light' },
    ].slice(0, MAX_CHIPS)
  }

  if (state.mode === 'combat' && state.combat) {
    const chips: SuggestChip[] = [{ cmd: 'attack', label: 'attack' }]
    const skillId = state.player.skills[0]
    if (skillId) {
      chips.push({ cmd: `skill ${skillId}`, label: `skill ${skillId}` })
    }
    chips.push({ cmd: 'defend', label: 'defend' })
    const potion = firstConsumableCmd(state)
    if (potion) chips.push(potion)
    chips.push({ cmd: 'flee', label: 'flee' }, { cmd: 'status', label: 'status' })
    return chips.slice(0, MAX_CHIPS)
  }

  // After inv / equip: prioritize equipping gear from bag
  if (isInvFocus(state)) {
    const chips: SuggestChip[] = []
    pushUnique(chips, equipChips(state, 4))
    const potion = firstConsumableCmd(state)
    if (potion) pushUnique(chips, [potion])
    pushUnique(chips, [
      { cmd: 'status', label: 'status' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'help', label: 'help' },
    ])
    return prependLangPicker(chips)
  }

  const loc = state.player.location
  const chips: SuggestChip[] = []
  const gear = equipChips(state, 2)
  const maxHp = getEffectiveMaxHp(state.player)
  const maxMp = getEffectiveMaxMp(state.player)
  const needsRest = state.player.hp < maxHp || state.player.mp < maxMp

  if (loc === 'town') {
    const zone = firstUnlockedZone(state)
    if (state.townSocial?.pending) {
      return prependLangPicker([
        { cmd: '1', label: '1' },
        { cmd: '2', label: '2' },
        { cmd: '3', label: '3' },
        { cmd: 'status', label: 'status' },
      ])
    }
    if (zone) chips.push(goChip(zone))
    chips.push(lookChip())
    chips.push({ cmd: 'shop', label: 'shop' })
    if (needsRest) chips.push({ cmd: 'rest', label: 'rest' })
    if (state.townSocial && !state.townSocial.talked && state.townSocial.present.length) {
      const talk = talkChip(state.townSocial.present[0])
      if (talk) chips.push(talk)
    }
    pushUnique(chips, gear)
    pushUnique(chips, [
      { cmd: 'status', label: 'status' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'help', label: 'help' },
      { cmd: 'save', label: 'save' },
    ])
    if (!needsRest) pushUnique(chips, [{ cmd: 'rest', label: 'rest' }])
  } else if (loc === 'shop') {
    if (state.townSocial?.pending) {
      return prependLangPicker([
        { cmd: '1', label: '1' },
        { cmd: '2', label: '2' },
        { cmd: '3', label: '3' },
      ])
    }
    chips.push(
      { cmd: 'shop list', label: 'shop list' },
      { cmd: 'buy 1', label: 'buy 1' },
      lookChip(),
      { cmd: 'town', label: 'town' },
    )
    pushUnique(chips, gear)
    pushUnique(chips, [
      { cmd: 'inv', label: 'inv' },
      { cmd: 'status', label: 'status' },
    ])
  } else if (ZONES[loc]) {
    chips.push({ cmd: 'hunt', label: 'hunt' })
    if (getBossForZone(loc)) {
      chips.push({ cmd: 'boss', label: 'boss' })
    }
    const next = nextRegionEntry(state)
    if (next && loc in BOSS_BY_ZONE) {
      chips.push(goChip(next))
    }
    chips.push({ cmd: 'town', label: 'town' })
    pushUnique(chips, gear)
    pushUnique(chips, [
      { cmd: 'status', label: 'status' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'look', label: 'look' },
    ])
    const potion = firstConsumableCmd(state)
    if (potion) pushUnique(chips, [potion])
  } else {
    pushUnique(chips, gear)
    pushUnique(chips, [
      { cmd: 'town', label: 'town' },
      { cmd: 'help', label: 'help' },
      { cmd: 'status', label: 'status' },
    ])
  }

  return prependLangPicker(chips)
}
