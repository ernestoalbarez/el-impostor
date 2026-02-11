import { Player } from '@/types/game';

export interface VictoryResult {
  gameOver: boolean;
  civilsWin: boolean;
}

/**
 * Determine if the game is over after an elimination or timer expiry.
 * 
 * - Civils win: no impostors remain
 * - Impostors win: impostors >= civils (includes 1v1)
 */
export function checkVictoryCondition(players: Player[]): VictoryResult {
  const active = players.filter(p => !p.isEliminated);
  const impostors = active.filter(p => p.role === 'impostor').length;
  const civils = active.filter(p => p.role === 'civil' || p.role === 'falseImpostor').length;

  if (impostors === 0) {
    return { gameOver: true, civilsWin: true };
  }
  if (civils === 0 || impostors >= civils) {
    return { gameOver: true, civilsWin: false };
  }
  return { gameOver: false, civilsWin: false };
}
