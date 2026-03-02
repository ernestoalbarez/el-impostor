import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameMode, Player, Category, GameState, Word } from '@/types/game';
import { assignRoles } from '@/engine/roleAssignment';
import { selectCategory, selectWord } from '@/engine/wordSelector';
import { checkVictoryCondition, impostorGuessedWord, canImpostorGuess } from '@/engine/votingEngine';
import { recordGame } from '@/engine/statsManager';
import defaultCategories from '@/data/themes.json';

interface GameContextType {
  gameState: GameState | null;
  categories: Category[];
  setCategories: (c: Category[]) => void;
  initializeGame: (mode: GameMode, players: string[], impostorCount: number, timerMinutes: number, categories: Category[], hideImpostorHint?: boolean) => void;
  revealPlayer: (playerId: string) => void;
  revealedPlayerIds: Set<string>;
  startGame: () => void;
  eliminatePlayer: (playerId: string) => { isImpostor: boolean; gameOver: boolean; civilsWin: boolean };
  updateTimer: (time: number) => void;
  checkVictory: () => { gameOver: boolean; civilsWin: boolean };
  resetGame: () => void;
  restartRound: () => void;
  handleImpostorGuess: () => { gameOver: boolean; civilsWin: boolean };
  canImpostorGuessNow: () => boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories as Category[]);
  const [revealedPlayerIds, setRevealedPlayerIds] = useState<Set<string>>(new Set());
  // Store init params for restart round
  const [lastInitParams, setLastInitParams] = useState<{
    mode: GameMode;
    playerNames: string[];
    impostorCount: number;
    timerMinutes: number;
    selectedCategories: Category[];
    hideImpostorHint: boolean;
  } | null>(null);

  const initializeGame = useCallback((
    mode: GameMode,
    playerNames: string[],
    impostorCount: number,
    timerMinutes: number,
    selectedCategories: Category[],
    hideImpostorHint: boolean = false
  ) => {
    const category = selectCategory(selectedCategories);
    const word = selectWord(category);
    const { players, actualImpostorCount } = assignRoles(playerNames, mode, impostorCount, word, hideImpostorHint);

    setLastInitParams({ mode, playerNames, impostorCount, timerMinutes, selectedCategories, hideImpostorHint });
    setRevealedPlayerIds(new Set());
    setGameState({
      config: {
        mode,
        players,
        impostorCount,
        timerMinutes,
        selectedCategory: category,
        selectedWord: word,
      },
      currentPlayerIndex: 0,
      phase: 'reveal',
      timeRemaining: timerMinutes * 60,
      actualImpostorCount,
      eliminatedPlayers: [],
    });
  }, []);

  const restartRound = useCallback(() => {
    if (!lastInitParams) return;
    const { mode, playerNames, impostorCount, timerMinutes, selectedCategories, hideImpostorHint } = lastInitParams;
    const category = selectCategory(selectedCategories);
    const word = selectWord(category);
    const { players, actualImpostorCount } = assignRoles(playerNames, mode, impostorCount, word, hideImpostorHint);

    setRevealedPlayerIds(new Set());
    setGameState({
      config: {
        mode,
        players,
        impostorCount,
        timerMinutes,
        selectedCategory: category,
        selectedWord: word,
      },
      currentPlayerIndex: 0,
      phase: 'reveal',
      timeRemaining: timerMinutes * 60,
      actualImpostorCount,
      eliminatedPlayers: [],
    });
  }, [lastInitParams]);

  const revealPlayer = useCallback((playerId: string) => {
    setRevealedPlayerIds(prev => new Set(prev).add(playerId));
  }, []);

  const startGame = useCallback(() => {
    if (!gameState) return;
    const activePlayers = gameState.config.players.filter(p => !p.isEliminated);
    const startingPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    setGameState(prev => prev ? { ...prev, phase: 'playing', startingPlayer: startingPlayer.name } : null);
  }, [gameState]);

  const eliminatePlayer = useCallback((playerId: string): { isImpostor: boolean; gameOver: boolean; civilsWin: boolean } => {
    if (!gameState) return { isImpostor: false, gameOver: false, civilsWin: false };
    const player = gameState.config.players.find(p => p.id === playerId);
    if (!player) return { isImpostor: false, gameOver: false, civilsWin: false };

    const isImpostor = player.role === 'impostor';

    setGameState(prev => {
      if (!prev) return null;
      const updatedPlayers = prev.config.players.map(p =>
        p.id === playerId ? { ...p, isEliminated: true, isRoleRevealed: true } : p
      );
      return {
        ...prev,
        config: { ...prev.config, players: updatedPlayers },
        eliminatedPlayers: [...prev.eliminatedPlayers, { ...player, isEliminated: true, isRoleRevealed: true }],
      };
    });

    const remainingPlayers = gameState.config.players.filter(
      p => !p.isEliminated && p.id !== playerId
    ).map(p => ({ ...p }));
    const result = checkVictoryCondition(remainingPlayers);

    if (result.gameOver) {
      const allPlayers = gameState.config.players.map(p =>
        p.id === playerId ? { ...p, isEliminated: true } : p
      );
      recordGame(allPlayers, result.civilsWin);
    }

    return { isImpostor, ...result };
  }, [gameState]);

  const updateTimer = useCallback((time: number) => {
    setGameState(prev => prev ? { ...prev, timeRemaining: time } : null);
  }, []);

  const checkVictory = useCallback((): { gameOver: boolean; civilsWin: boolean } => {
    if (!gameState) return { gameOver: false, civilsWin: false };
    const remaining = gameState.config.players.filter(p => !p.isEliminated);
    const result = checkVictoryCondition(remaining);

    if (gameState.timeRemaining <= 0 && !result.gameOver) {
      const impostors = remaining.filter(p => p.role === 'impostor').length;
      if (impostors > 0) return { gameOver: true, civilsWin: false };
      return { gameOver: true, civilsWin: true };
    }

    return result;
  }, [gameState]);

  const canImpostorGuessNow = useCallback((): boolean => {
    if (!gameState || gameState.phase !== 'playing') return false;
    return canImpostorGuess(gameState.config.players);
  }, [gameState]);

  const handleImpostorGuess = useCallback((): { gameOver: boolean; civilsWin: boolean } => {
    if (!gameState) return { gameOver: false, civilsWin: false };
    const result = impostorGuessedWord(gameState.config.players);
    if (result.gameOver) {
      recordGame(gameState.config.players, result.civilsWin);
    }
    return result;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setRevealedPlayerIds(new Set());
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      categories,
      setCategories,
      initializeGame,
      revealPlayer,
      revealedPlayerIds,
      startGame,
      eliminatePlayer,
      updateTimer,
      checkVictory,
      resetGame,
      restartRound,
      handleImpostorGuess,
      canImpostorGuessNow,
    }}>
      {children}
    </GameContext.Provider>
  );
};
