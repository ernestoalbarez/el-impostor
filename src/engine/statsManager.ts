import { Player, PlayerStats, StatsRecord, RoleType } from '@/types/game';

const STATS_KEY = 'impostor-game-stats';

export function loadStats(): StatsRecord {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStats(stats: StatsRecord) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function emptyStats(): PlayerStats {
  return { totalGames: 0, winsAsCivil: 0, winsAsImpostor: 0, winsAsFalseImpostor: 0 };
}

/**
 * Record the result of a game for all players.
 * Winners are determined by civilsWin flag + their role.
 */
export function recordGame(players: Player[], civilsWin: boolean): StatsRecord {
  const stats = loadStats();

  for (const p of players) {
    if (!stats[p.name]) stats[p.name] = emptyStats();
    const s = stats[p.name];
    s.totalGames++;

    const isImpostor = p.role === 'impostor';
    const isCivil = p.role === 'civil';
    const isFalse = p.role === 'falseImpostor';

    if (civilsWin && (isCivil || isFalse)) {
      if (isFalse) s.winsAsFalseImpostor++;
      else s.winsAsCivil++;
    } else if (!civilsWin && isImpostor) {
      s.winsAsImpostor++;
    }
  }

  saveStats(stats);
  return stats;
}

export function getPlayerStats(name: string): PlayerStats {
  const stats = loadStats();
  return stats[name] || emptyStats();
}

export function getAllStats(): StatsRecord {
  return loadStats();
}

export function clearStats() {
  localStorage.removeItem(STATS_KEY);
}
