export type GameMode = 'classic' | 'chaos' | 'extreme';

export type RoleType = 'civil' | 'impostor' | 'falseImpostor';

export interface Player {
  id: string;
  name: string;
  role?: RoleType;
  word?: string;
  isEliminated: boolean;
  isRoleRevealed: boolean;
}

export interface Word {
  principal: string;
  pista_principal: string;
  pistas_secundarias: string[];
}

export interface Category {
  id: string;
  nombre: string;
  palabras: Word[];
}

export interface GameConfig {
  mode: GameMode;
  players: Player[];
  impostorCount: number;
  timerMinutes: number;
  selectedCategory?: Category;
  selectedWord?: Word;
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

export interface PlayerStats {
  totalGames: number;
  winsAsCivil: number;
  winsAsImpostor: number;
  winsAsFalseImpostor: number;
}

export interface StatsRecord {
  [playerName: string]: PlayerStats;
}
