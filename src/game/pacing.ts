import type { TerminalLine } from './types'
import { getSettings } from './settings'

/** Command pacing categories — longer = more “game feel”. */
export type PaceKind =
  | 'instant' // help, status, settings, clear…
  | 'quick' // look, zones, lang, theme…
  | 'action' // go, town, shop, equip, buy, sell, use…
  | 'search' // hunt / explore
  | 'combat' // attack, skill, defend, flee, combat use

/** Current timings = fast mode. Normal is slower. */
const NORMAL_SCALE = 1.9
/** Auto-hunt ignores fast mode and runs a bit slower than normal. */
const AUTO_HUNT_SCALE = NORMAL_SCALE * 1.25

function applyPace(ms: number): number {
  if (ms <= 0) return 0
  return getSettings().fastMode ? ms : Math.round(ms * NORMAL_SCALE)
}

/** Dedicated pacing for auto-hunt (never uses fast mode). */
export function applyAutoHuntPace(ms: number): number {
  if (ms <= 0) return 0
  return Math.round(ms * AUTO_HUNT_SCALE)
}

export function classifyCommand(raw: string): PaceKind {
  const cmd = raw.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  if (
    !cmd ||
    cmd === 'help' ||
    cmd === '?' ||
    cmd === 'man' ||
    cmd === 'clear' ||
    cmd === 'cls' ||
    cmd === 'history' ||
    cmd === 'status' ||
    cmd === 'st' ||
    cmd === 'stat' ||
    cmd === 'inv' ||
    cmd === 'inventory' ||
    cmd === 'i' ||
    cmd === 'skills' ||
    cmd === 'name' ||
    cmd === 'rename' ||
    cmd === '닉네임' ||
    cmd === 'nick' ||
    cmd === 'nickname' ||
    cmd === 'settings' ||
    cmd === 'setting' ||
    cmd === 'preferences' ||
    cmd === 'prefs' ||
    cmd === 'config'
  ) {
    return 'instant'
  }
  if (
    cmd === 'look' ||
    cmd === 'ls' ||
    cmd === 'pwd' ||
    cmd === 'zones' ||
    cmd === 'maps' ||
    cmd === 'lang' ||
    cmd === 'language' ||
    cmd === 'locale' ||
    cmd === 'theme' ||
    cmd === 'fontsize' ||
    cmd === 'font-size' ||
    cmd === 'autosave' ||
    cmd === 'inspector' ||
    cmd === 'hud' ||
    cmd === 'hints' ||
    cmd === 'combathints' ||
    cmd === 'fast' ||
    cmd === 'pace' ||
    cmd === 'speed' ||
    cmd === 'explorer' ||
    cmd === 'save' ||
    cmd === 'load' ||
    cmd === 'reset'
  ) {
    return 'quick'
  }
  if (
    cmd === 'hunt' ||
    cmd === 'explore' ||
    cmd === 'search' ||
    cmd === 'auto' ||
    cmd === 'autohunt' ||
    cmd === '자동전투' ||
    cmd === 'stop' ||
    cmd === '중지'
  ) {
    return cmd === 'auto' || cmd === 'autohunt' || cmd === '자동전투' || cmd === 'stop' || cmd === '중지'
      ? 'quick'
      : 'search'
  }
  if (cmd === 'boss' || cmd === 'challenge') return 'search'
  if (
    cmd === 'attack' ||
    cmd === 'a' ||
    cmd === 'hit' ||
    cmd === 'skill' ||
    cmd === 's' ||
    cmd === 'cast' ||
    cmd === 'defend' ||
    cmd === 'd' ||
    cmd === 'guard' ||
    cmd === 'flee' ||
    cmd === 'run' ||
    cmd === 'escape'
  ) {
    return 'combat'
  }
  if (cmd === 'go' ||
    cmd === 'goto' ||
    cmd === 'move' ||
    cmd === 'cd' ||
    cmd === 'town' ||
    cmd === 'home' ||
    cmd === 'rest' ||
    cmd === 'sleep' ||
    cmd === 'recover' ||
    cmd === 'shop' ||
    cmd === 'buy' ||
    cmd === 'sell' ||
    cmd === 'equip' ||
    cmd === 'unequip' ||
    cmd === 'use' ||
    cmd === 'talk' ||
    cmd === 'npc' ||
    cmd === 'speak' ||
    cmd === 'npcs' ||
    cmd === 'lookaround' ||
    cmd === 'around' ||
    cmd === '둘러보기' ||
    cmd === 'people' ||
    cmd === 'reply' ||
    cmd === 'answer' ||
    cmd === 'choose' ||
    cmd === '선택'
  ) {
    return 'action'
  }
  return 'action'
}

/** Pause after echoing the input line, before first result. (fast baseline) */
export function leadDelayBaseline(kind: PaceKind, inCombat: boolean): number {
  if (inCombat && (kind === 'combat' || kind === 'action')) return 320
  switch (kind) {
    case 'instant':
      return 40
    case 'quick':
      return 90
    case 'action':
      return 220
    case 'search':
      return 520
    case 'combat':
      return 300
    default:
      return 220
  }
}

export function leadDelay(kind: PaceKind, inCombat: boolean): number {
  return applyPace(leadDelayBaseline(kind, inCombat))
}

/** Gap before revealing each result line. (fast baseline) */
export function lineDelayBaseline(
  kind: PaceKind,
  msg: TerminalLine,
  index: number,
  inCombat: boolean,
): number {
  if (msg.kind === 'input') return 0

  if (msg.kind === 'error') return 60
  if (kind === 'instant') {
    return index === 0 ? 30 : 18
  }
  if (kind === 'quick') {
    return msg.kind === 'success' ? 120 : 70
  }
  if (kind === 'search') {
    if (msg.kind === 'combat') return 380
    if (msg.kind === 'loot') return 420
    if (msg.kind === 'system') return 220
    return 280
  }
  if (kind === 'combat' || (inCombat && kind === 'action')) {
    if (msg.kind === 'combat') return 480
    if (msg.kind === 'success') return 360
    if (msg.kind === 'loot') return 400
    if (msg.kind === 'system') return 260
    return 300
  }
  // action (travel, shop, equip…)
  if (msg.kind === 'success') return 240
  if (msg.kind === 'loot') return 360
  if (msg.kind === 'output') return 140
  return 180
}

export function lineDelay(
  kind: PaceKind,
  msg: TerminalLine,
  index: number,
  inCombat: boolean,
): number {
  return applyPace(lineDelayBaseline(kind, msg, index, inCombat))
}

export function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}
