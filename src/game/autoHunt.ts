import { playerAttack, type CombatResult } from './combat'
import type { GameState } from './types'

/** Auto-hunt only uses basic attacks (no skills / potions / defend). */
export function autoCombatTurn(state: GameState): CombatResult | null {
  if (!state.combat || state.mode !== 'combat') return null
  return playerAttack(state.player, state.combat)
}
