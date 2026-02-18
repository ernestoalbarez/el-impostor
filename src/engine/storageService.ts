const KEYS = {
  PLAYERS: 'impostor-players',
  CONFIG: 'impostor-config',
  STATS: 'impostor-game-stats',
} as const;

export interface SavedConfig {
  lastMode: string;
  impostorCount: number;
  timerMinutes: number;
  selectedCategoryIds: string[];
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

// Players
export function loadPlayers(): string[] {
  return safeGet<string[]>(KEYS.PLAYERS, []);
}

export function savePlayers(players: string[]) {
  safeSet(KEYS.PLAYERS, players);
}

// Config
export function loadConfig(): SavedConfig | null {
  return safeGet<SavedConfig | null>(KEYS.CONFIG, null);
}

export function saveConfig(config: SavedConfig) {
  safeSet(KEYS.CONFIG, config);
}
