import { Player } from '@/types/game';

export interface VictoryResult {
  gameOver: boolean;
  civilsWin: boolean;
}

/** Helper functions */
export function getAlivePlayers(players: Player[]): Player[] {
  return players.filter(p => !p.isEliminated);
}

export function getAliveImpostors(players: Player[]): Player[] {
  return getAlivePlayers(players).filter(p => p.role === 'impostor');
}

export function getAliveCivilians(players: Player[]): Player[] {
  return getAlivePlayers(players).filter(p => p.role === 'civil' || p.role === 'falseImpostor');
}

/**
 * Determine if the game is over after an elimination or timer expiry.
 * 
 * - Civils win: no impostors remain (impostors === 0)
 * - Impostors win: only 1 civil left and at least 1 impostor alive
 */
export function checkVictoryCondition(players: Player[]): VictoryResult {
  const impostors = getAliveImpostors(players).length;
  const civils = getAliveCivilians(players).length;

  if (impostors === 0) {
    return { gameOver: true, civilsWin: true };
  }
  if (civils <= 1 && impostors >= 1) {
    return { gameOver: true, civilsWin: false };
  }
  return { gameOver: false, civilsWin: false };
}
