import { ZONES } from './data/content'
import { getItem } from './data/items'
import type { GameState } from './types'
import { getUiView } from './settings'

export type SuggestChip = {
  /** exact CLI command to run */
  cmd: string
  /** short label on chip (usually same as cmd) */
  label: string
}

const MAX_CHIPS = 6

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
    if (state.player.level >= z.minLevel) return z.id
  }
  return null
}

/** Contextual command chips for the input dock (mobile-friendly). */
export function getSuggestChips(state: GameState): SuggestChip[] {
  if (getUiView() === 'settings') {
    return [
      { cmd: 'settings close', label: 'settings close' },
      { cmd: 'lang ko', label: 'lang ko' },
      { cmd: 'lang en', label: 'lang en' },
      { cmd: 'theme dark', label: 'theme dark' },
      { cmd: 'theme light', label: 'theme light' },
    ].slice(0, MAX_CHIPS)
  }

  if (state.mode === 'combat' && state.combat) {
    const chips: SuggestChip[] = [
      { cmd: 'attack', label: 'attack' },
    ]
    const skillId = state.player.skills[0]
    if (skillId) {
      chips.push({ cmd: `skill ${skillId}`, label: `skill ${skillId}` })
    }
    chips.push({ cmd: 'defend', label: 'defend' })
    const potion = firstConsumableCmd(state)
    if (potion) chips.push(potion)
    chips.push({ cmd: 'flee', label: 'flee' })
    chips.push({ cmd: 'status', label: 'status' })
    return chips.slice(0, MAX_CHIPS)
  }

  const loc = state.player.location
  const chips: SuggestChip[] = []

  if (loc === 'town') {
    chips.push({ cmd: 'shop', label: 'shop' })
    const zone = firstUnlockedZone(state)
    if (zone) chips.push({ cmd: `go ${zone}`, label: `go ${zone}` })
    chips.push(
      { cmd: 'status', label: 'status' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'help', label: 'help' },
      { cmd: 'save', label: 'save' },
    )
  } else if (loc === 'shop') {
    chips.push(
      { cmd: 'shop list', label: 'shop list' },
      { cmd: 'buy 1', label: 'buy 1' },
      { cmd: 'town', label: 'town' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'status', label: 'status' },
    )
  } else if (ZONES[loc]) {
    chips.push(
      { cmd: 'hunt', label: 'hunt' },
      { cmd: 'town', label: 'town' },
      { cmd: 'status', label: 'status' },
      { cmd: 'inv', label: 'inv' },
      { cmd: 'look', label: 'look' },
    )
    const potion = firstConsumableCmd(state)
    if (potion) chips.push(potion)
  } else {
    chips.push(
      { cmd: 'town', label: 'town' },
      { cmd: 'help', label: 'help' },
      { cmd: 'status', label: 'status' },
    )
  }

  return chips.slice(0, MAX_CHIPS)
}
