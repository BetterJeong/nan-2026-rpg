import type { GameState, TerminalLine } from './types'
import { createNewPlayer } from './player'

const SAVE_KEY = 'nan-2026-rpg-save'
const AUTOSAVE_KEY = 'nan-2026-rpg-autosave-min'

export const DEFAULT_AUTOSAVE_MIN = 5
export const MIN_AUTOSAVE_MIN = 1
export const MAX_AUTOSAVE_MIN = 60

export function createInitialState(): GameState {
  return {
    player: createNewPlayer(),
    mode: 'idle',
    combat: null,
    history: [],
    messages: [],
  }
}

export function pushMessage(state: GameState, kind: TerminalLine['kind'], text: string): void {
  state.messages.push({ kind, text })
}

export function clearMessages(state: GameState): void {
  state.messages = []
}

export function saveGame(state: GameState): string {
  const payload = {
    player: state.player,
    mode: state.mode === 'combat' ? 'idle' : state.mode,
    combat: null,
    savedAt: new Date().toISOString(),
  }
  // If saving mid-combat, drop combat and keep current location
  if (state.mode === 'combat') {
    payload.mode = 'idle'
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  return 'game saved. (localStorage)'
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as {
      player: GameState['player']
      mode?: GameState['mode']
    }
    const state = createInitialState()
    state.player = data.player
    state.mode = 'idle'
    state.combat = null
    return state
  } catch {
    return null
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY)
}

export function getAutosaveMinutes(): number {
  const raw = localStorage.getItem(AUTOSAVE_KEY)
  if (!raw) return DEFAULT_AUTOSAVE_MIN
  const n = parseInt(raw, 10)
  if (!Number.isFinite(n) || n < MIN_AUTOSAVE_MIN || n > MAX_AUTOSAVE_MIN) {
    return DEFAULT_AUTOSAVE_MIN
  }
  return n
}

/** Persist interval (1–60 min). Returns error message or null on success. */
export function setAutosaveMinutes(minutes: number): string | null {
  if (!Number.isInteger(minutes) || minutes < MIN_AUTOSAVE_MIN || minutes > MAX_AUTOSAVE_MIN) {
    return `error: autosave interval must be ${MIN_AUTOSAVE_MIN}-${MAX_AUTOSAVE_MIN} minutes`
  }
  localStorage.setItem(AUTOSAVE_KEY, String(minutes))
  return null
}

let autosaveTimer: ReturnType<typeof setInterval> | null = null
let autosaveTick: (() => void) | null = null

export function startAutosave(onTick: () => void): void {
  autosaveTick = onTick
  restartAutosaveTimer()
}

export function restartAutosaveTimer(): void {
  if (autosaveTimer != null) clearInterval(autosaveTimer)
  if (!autosaveTick) return
  const ms = getAutosaveMinutes() * 60 * 1000
  autosaveTimer = setInterval(autosaveTick, ms)
}
