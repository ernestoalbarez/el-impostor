import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameMode, Player, Theme, GameState, RoleType } from '@/types/game';
import defaultThemes from '@/data/themes.json';

interface GameContextType {
  gameState: GameState | null;
  themes: Theme[];
  setThemes: (themes: Theme[]) => void;
  initializeGame: (mode: GameMode, players: string[], impostorCount: number, timerMinutes: number, themes: Theme[]) => void;
  revealPlayer: (playerId: string) => void;
  revealedPlayerIds: Set<string>;
  startGame: () => void;
  eliminatePlayer: (playerId: string) => { isImpostor: boolean; gameOver: boolean; civilsWin: boolean };
  updateTimer: (time: number) => void;
  checkVictory: () => { gameOver: boolean; civilsWin: boolean };
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [themes, setThemes] = useState<Theme[]>(defaultThemes as Theme[]);
  const [revealedPlayerIds, setRevealedPlayerIds] = useState<Set<string>>(new Set());

  const assignRoles = useCallback((
    players: string[],
    mode: GameMode,
    requestedImpostors: number,
    selectedThemes: Theme[]
  ): { assignedPlayers: Player[]; actualImpostorCount: number } => {
    // Pick a random theme from selected ones
    const theme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
    const playerCount = players.length;
    let impostorCount: number;
    let falseImpostorCount = 0;
    let impostorNoWordCount = 0;

    if (mode === 'classic') {
      impostorCount = Math.min(requestedImpostors, playerCount - 1);
    } else if (mode === 'chaos') {
      impostorCount = Math.floor(Math.random() * playerCount);
    } else {
      // Extreme chaos
      impostorCount = Math.floor(Math.random() * playerCount);
      if (playerCount >= 4 && Math.random() > 0.5) {
        falseImpostorCount = Math.floor(Math.random() * Math.min(2, playerCount - impostorCount - 1)) + 1;
      }
      if (impostorCount > 0 && Math.random() > 0.6) {
        impostorNoWordCount = Math.min(1, impostorCount);
      }
    }

    // Create shuffled indices for role assignment
    const indices = Array.from({ length: playerCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const assignedPlayers: Player[] = players.map((name, i) => ({
      id: `player-${i}`,
      name,
      isEliminated: false,
    }));

    let assignedCount = 0;

    // Assign impostors without word first
    for (let i = 0; i < impostorNoWordCount && assignedCount < impostorCount; i++) {
      const playerIndex = indices[assignedCount];
      assignedPlayers[playerIndex].role = 'impostorNoWord';
      assignedPlayers[playerIndex].word = undefined;
      assignedCount++;
    }

    // Assign regular impostors
    const regularImpostors = impostorCount - impostorNoWordCount;
    for (let i = 0; i < regularImpostors; i++) {
      const playerIndex = indices[assignedCount];
      assignedPlayers[playerIndex].role = 'impostor';
      assignedPlayers[playerIndex].word = theme.palabras_relacionadas[
        Math.floor(Math.random() * theme.palabras_relacionadas.length)
      ];
      assignedCount++;
    }

    // Assign false impostors
    for (let i = 0; i < falseImpostorCount; i++) {
      const playerIndex = indices[assignedCount];
      assignedPlayers[playerIndex].role = 'falseImpostor';
      assignedPlayers[playerIndex].word = theme.palabras_relacionadas[
        Math.floor(Math.random() * theme.palabras_relacionadas.length)
      ];
      assignedCount++;
    }

    // Assign civilians
    for (let i = assignedCount; i < playerCount; i++) {
      const playerIndex = indices[i];
      assignedPlayers[playerIndex].role = 'civil';
      assignedPlayers[playerIndex].word = theme.variaciones_civil[
        Math.floor(Math.random() * theme.variaciones_civil.length)
      ];
    }

    return { assignedPlayers, actualImpostorCount: impostorCount };
  }, []);

  const initializeGame = useCallback((
    mode: GameMode,
    playerNames: string[],
    impostorCount: number,
    timerMinutes: number,
    selectedThemes: Theme[]
  ) => {
    const { assignedPlayers, actualImpostorCount } = assignRoles(playerNames, mode, impostorCount, selectedThemes);
    const chosenTheme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];

    setRevealedPlayerIds(new Set());
    setGameState({
      config: {
        mode,
        players: assignedPlayers,
        impostorCount,
        timerMinutes,
        selectedTheme: chosenTheme,
      },
      currentPlayerIndex: 0,
      phase: 'reveal',
      timeRemaining: timerMinutes * 60,
      actualImpostorCount,
      eliminatedPlayers: [],
    });
  }, [assignRoles]);

  const revealPlayer = useCallback((playerId: string) => {
    setRevealedPlayerIds(prev => new Set(prev).add(playerId));
  }, []);

  const startGame = useCallback(() => {
    if (!gameState) return;
    
    const activePlayers = gameState.config.players.filter(p => !p.isEliminated);
    const startingPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    
    setGameState(prev => prev ? {
      ...prev,
      phase: 'playing',
      startingPlayer: startingPlayer.name,
    } : null);
  }, [gameState]);

  const eliminatePlayer = useCallback((playerId: string): { isImpostor: boolean; gameOver: boolean; civilsWin: boolean } => {
    if (!gameState) return { isImpostor: false, gameOver: false, civilsWin: false };
    
    const player = gameState.config.players.find(p => p.id === playerId);
    if (!player) return { isImpostor: false, gameOver: false, civilsWin: false };
    
    const isImpostor = player.role === 'impostor' || player.role === 'impostorNoWord';
    
    setGameState(prev => {
      if (!prev) return null;
      const updatedPlayers = prev.config.players.map(p => 
        p.id === playerId ? { ...p, isEliminated: true } : p
      );
      return {
        ...prev,
        config: { ...prev.config, players: updatedPlayers },
        eliminatedPlayers: [...prev.eliminatedPlayers, player],
        phase: 'result',
      };
    });

    // Check victory conditions
    const remainingImpostors = gameState.config.players.filter(
      p => !p.isEliminated && p.id !== playerId && (p.role === 'impostor' || p.role === 'impostorNoWord')
    ).length;

    const gameOver = remainingImpostors === 0;
    const civilsWin = gameOver;

    return { isImpostor, gameOver, civilsWin };
  }, [gameState]);

  const updateTimer = useCallback((time: number) => {
    setGameState(prev => prev ? { ...prev, timeRemaining: time } : null);
  }, []);

  const checkVictory = useCallback((): { gameOver: boolean; civilsWin: boolean } => {
    if (!gameState) return { gameOver: false, civilsWin: false };
    
    const remainingImpostors = gameState.config.players.filter(
      p => !p.isEliminated && (p.role === 'impostor' || p.role === 'impostorNoWord')
    ).length;

    if (remainingImpostors === 0) {
      return { gameOver: true, civilsWin: true };
    }

    if (gameState.timeRemaining <= 0 && remainingImpostors > 0) {
      return { gameOver: true, civilsWin: false };
    }

    return { gameOver: false, civilsWin: false };
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setRevealedPlayerIds(new Set());
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      themes,
      setThemes,
      initializeGame,
      revealPlayer,
      revealedPlayerIds,
      startGame,
      eliminatePlayer,
      updateTimer,
      checkVictory,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};
