import { Player, GameMode, RoleType, Word } from '@/types/game';
import { gameConfig } from './gameConfig';
import { getCivilWord, getImpostorHint } from './wordSelector';

interface AssignmentResult {
  players: Player[];
  actualImpostorCount: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Assign roles and words to players based on game mode — O(n)
 * @param hideImpostorHint - If true (classic mode option), impostors get no word at all.
 */
export function assignRoles(
  playerNames: string[],
  mode: GameMode,
  requestedImpostors: number,
  word: Word,
  hideImpostorHint: boolean = false
): AssignmentResult {
  const n = playerNames.length;
  let impostorCount: number;
  let falseImpostorCount = 0;

  // Determine impostor count
  if (mode === 'classic') {
    impostorCount = Math.min(requestedImpostors, n - 1);
  } else if (mode === 'chaos') {
    impostorCount = Math.max(1, Math.floor(Math.random() * Math.floor(n / 2)) + 1);
  } else {
    // extreme
    impostorCount = Math.max(1, Math.floor(Math.random() * Math.floor(n / 2)) + 1);
    if (gameConfig.permitirMultiplesFalsos && n >= 4) {
      const maxFalse = Math.min(
        gameConfig.maxFalsosImpostores,
        n - impostorCount - 1
      );
      if (maxFalse > 0) {
        falseImpostorCount = Math.floor(Math.random() * (maxFalse + 1));
      }
    }
  }

  const indices = shuffle(Array.from({ length: n }, (_, i) => i));

  const isRoleHidden = mode === 'chaos';

  const players: Player[] = playerNames.map((name, i) => ({
    id: `player-${i}`,
    name,
    isEliminated: false,
    isRoleRevealed: !isRoleHidden,
  }));

  let idx = 0;

  // Assign impostors
  const civilWord = getCivilWord(word);

  for (let i = 0; i < impostorCount; i++) {
    const pi = indices[idx++];
    players[pi].role = 'impostor';
    if (hideImpostorHint && mode === 'classic') {
      // No word for impostors when hint is hidden
      players[pi].word = undefined;
    } else if (mode === 'extreme') {
      const useSecondary = Math.random() < gameConfig.probabilidadSecundaria;
      players[pi].word = getImpostorHint(word, useSecondary);
    } else {
      // classic & chaos: all impostors get the same pista_principal
      players[pi].word = word.pista_principal;
    }
  }

  // Assign false impostors (extreme only)
  for (let i = 0; i < falseImpostorCount; i++) {
    const pi = indices[idx++];
    players[pi].role = 'falseImpostor';
    players[pi].word = word.pista_principal;
  }

  // Assign civilians
  for (let i = idx; i < n; i++) {
    const pi = indices[i];
    players[pi].role = 'civil';
    players[pi].word = civilWord;
  }

  return { players, actualImpostorCount: impostorCount };
}
