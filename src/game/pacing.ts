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

function applyPace(ms: number): number {
  if (ms <= 0) return 0
  return getSettings().fastMode ? ms : Math.round(ms * NORMAL_SCALE)
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
  if (cmd === 'hunt' || cmd === 'explore' || cmd === 'search') return 'search'
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
export function leadDelay(kind: PaceKind, inCombat: boolean): number {
  let ms = 0
  if (inCombat && (kind === 'combat' || kind === 'action')) ms = 320
  else {
    switch (kind) {
      case 'instant':
        ms = 40
        break
      case 'quick':
        ms = 90
        break
      case 'action':
        ms = 220
        break
      case 'search':
        ms = 520
        break
      case 'combat':
        ms = 300
        break
    }
  }
  return applyPace(ms)
}

/** Gap before revealing each result line. (fast baseline) */
export function lineDelay(
  kind: PaceKind,
  msg: TerminalLine,
  index: number,
  inCombat: boolean,
): number {
  if (msg.kind === 'input') return 0

  let ms = 0
  if (msg.kind === 'error') ms = 60
  else if (kind === 'instant') {
    ms = index === 0 ? 30 : 18
  } else if (kind === 'quick') {
    ms = msg.kind === 'success' ? 120 : 70
  } else if (kind === 'search') {
    if (msg.kind === 'combat') ms = 380
    else if (msg.kind === 'loot') ms = 420
    else if (msg.kind === 'system') ms = 220
    else ms = 280
  } else if (kind === 'combat' || (inCombat && kind === 'action')) {
    if (msg.kind === 'combat') ms = 480
    else if (msg.kind === 'success') ms = 360
    else if (msg.kind === 'loot') ms = 400
    else if (msg.kind === 'system') ms = 260
    else ms = 300
  } else {
    // action (travel, shop, equip…)
    if (msg.kind === 'success') ms = 240
    else if (msg.kind === 'loot') ms = 360
    else if (msg.kind === 'output') ms = 140
    else ms = 180
  }

  return applyPace(ms)
}

export function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve) => setTimeout(resolve, ms))
}
