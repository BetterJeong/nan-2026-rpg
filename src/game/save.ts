import type { GameState, TerminalLine } from './types'
import { createNewPlayer } from './player'

const SAVE_KEY = 'nan-2026-rpg-save'

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
  // 전투 중 저장 시 전투는 취소하고 현재 위치 유지
  if (state.mode === 'combat') {
    payload.mode = 'idle'
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  return '게임을 저장했습니다. (localStorage)'
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
