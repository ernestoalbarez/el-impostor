export type GameMode = 'classic' | 'chaos' | 'extreme';

export type RoleType = 'civil' | 'impostor' | 'falseImpostor' | 'impostorNoWord';

export interface Player {
  id: string;
  name: string;
  role?: RoleType;
  word?: string;
  isEliminated: boolean;
}

export interface Theme {
  id: string;
  nombre: string;
  palabra_principal: string;
  variaciones_civil: string[];
  palabras_relacionadas: string[];
}

export interface GameConfig {
  mode: GameMode;
  players: Player[];
  impostorCount: number;
  timerMinutes: number;
  selectedTheme?: Theme;
}

export interface GameState {
  config: GameConfig;
  currentPlayerIndex: number;
  phase: 'setup' | 'reveal' | 'playing' | 'voting' | 'result' | 'end';
  startingPlayer?: string;
  timeRemaining: number;
  actualImpostorCount: number;
  eliminatedPlayers: Player[];
}

// Los temas se cargan desde src/data/themes.json
