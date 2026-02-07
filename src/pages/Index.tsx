import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame, GameProvider } from '@/context/GameContext';
import { GameMode, Theme } from '@/types/game';
import { GameModeCard } from '@/components/game/GameModeCard';
import { PlayerInput } from '@/components/game/PlayerInput';
import { ThemeManager } from '@/components/game/ThemeManager';
import { RoleReveal } from '@/components/game/RoleReveal';
import { GameTimer } from '@/components/game/GameTimer';
import { VotingPanel } from '@/components/game/VotingPanel';
import { EliminationResult } from '@/components/game/EliminationResult';
import { GameEnd } from '@/components/game/GameEnd';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Play, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

const GameApp = () => {
  const {
    gameState,
    themes,
    setThemes,
    initializeGame,
    revealNextPlayer,
    startGame,
    eliminatePlayer,
    updateTimer,
    checkVictory,
    resetGame,
  } = useGame();

  const [step, setStep] = useState<'mode' | 'players' | 'config' | 'game'>('mode');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const [eliminationResult, setEliminationResult] = useState<{
    player: any;
    isImpostor: boolean;
    gameOver: boolean;
    civilsWin: boolean;
  } | null>(null);

  const [gameEnded, setGameEnded] = useState<{
    civilsWin: boolean;
  } | null>(null);

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setStep('players');
  };

  const handleAddPlayer = (name: string) => {
    setPlayers([...players, name]);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleAddTheme = (theme: Theme) => {
    setThemes([...themes, theme]);
  };

  const handleDeleteTheme = (themeId: string) => {
    setThemes(themes.filter(t => t.id !== themeId));
    if (selectedTheme?.id === themeId) {
      setSelectedTheme(null);
    }
  };

  const handleStartSetup = () => {
    if (selectedMode && selectedTheme && players.length >= 3) {
      initializeGame(selectedMode, players, impostorCount, timerMinutes, selectedTheme);
      setStep('game');
    }
  };

  const handleNextReveal = () => {
    revealNextPlayer();
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleEliminate = (playerId: string) => {
    if (!gameState) return;
    
    const player = gameState.config.players.find(p => p.id === playerId);
    if (!player) return;

    const result = eliminatePlayer(playerId);
    setEliminationResult({
      player,
      ...result,
    });
  };

  const handleContinueAfterElimination = () => {
    if (eliminationResult?.gameOver) {
      setGameEnded({ civilsWin: eliminationResult.civilsWin });
    }
    setEliminationResult(null);
  };

  const handleTimeUp = () => {
    const result = checkVictory();
    if (result.gameOver) {
      setGameEnded({ civilsWin: result.civilsWin });
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    setGameEnded(null);
    setEliminationResult(null);
    setStep('mode');
    setSelectedMode(null);
    setPlayers([]);
    setSelectedTheme(null);
  };

  const handleGoHome = () => {
    handlePlayAgain();
  };

  // Game End Screen
  if (gameEnded && gameState) {
    return (
      <GameEnd
        players={gameState.config.players}
        civilsWin={gameEnded.civilsWin}
        mode={gameState.config.mode}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  // Elimination Result Screen
  if (eliminationResult && gameState) {
    return (
      <EliminationResult
        player={eliminationResult.player}
        isImpostor={eliminationResult.isImpostor}
        gameOver={eliminationResult.gameOver}
        civilsWin={eliminationResult.civilsWin}
        onContinue={handleContinueAfterElimination}
      />
    );
  }

  // Game Screen (Reveal or Playing)
  if (step === 'game' && gameState) {
    if (gameState.phase === 'reveal') {
      const currentPlayer = gameState.config.players[gameState.currentPlayerIndex];
      const isLast = gameState.currentPlayerIndex === gameState.config.players.length - 1;
      
      return (
        <RoleReveal
          player={currentPlayer}
          isLast={isLast}
          onNext={handleNextReveal}
          onStartGame={handleStartGame}
        />
      );
    }

    if (gameState.phase === 'playing') {
      return (
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-display text-gradient-fire">El Impostor</h1>
              <p className="text-sm text-muted-foreground">
                Primer turno: <span className="text-foreground font-medium">{gameState.startingPlayer}</span>
              </p>
            </div>

            {/* Timer */}
            <div className="card-mystery rounded-2xl p-6">
              <GameTimer
                initialTime={gameState.config.timerMinutes * 60}
                onTimeUp={handleTimeUp}
                onTimeUpdate={updateTimer}
              />
            </div>

            {/* Active Players Count */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Skull className="w-5 h-5" />
              <span>
                {gameState.config.players.filter(p => !p.isEliminated).length} jugadores restantes
              </span>
            </div>

            {/* Voting Panel */}
            <div className="card-mystery rounded-2xl p-6">
              <VotingPanel
                players={gameState.config.players}
                onEliminate={handleEliminate}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display text-gradient-fire mb-2">
            El Impostor
          </h1>
          <p className="text-muted-foreground">
            El caos es diseño intencional
          </p>
        </motion.div>

        {/* Mode Selection */}
        {step === 'mode' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <GameModeCard
              mode="classic"
              title="CLÁSICO"
              description="Tú defines la cantidad de impostores. Deducción tradicional."
              onClick={() => handleSelectMode('classic')}
            />
            <GameModeCard
              mode="chaos"
              title="CAOS"
              description="La cantidad de impostores es aleatoria. Nadie sabe cuántos hay."
              onClick={() => handleSelectMode('chaos')}
            />
            <GameModeCard
              mode="extreme"
              title="🔥 CAOS EXTREMO"
              description="Nada es confiable. Roles especiales, impostores sin palabra, falsos impostores. El caos total."
              onClick={() => handleSelectMode('extreme')}
            />
          </motion.div>
        )}

        {/* Player Setup */}
        {step === 'players' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <Button
              variant="ghost"
              onClick={() => setStep('mode')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-foreground mb-2">
                Agregar jugadores
              </h2>
              <p className="text-sm text-muted-foreground">
                Modo: <span className={cn(
                  selectedMode === 'classic' && 'text-primary',
                  selectedMode === 'chaos' && 'text-accent',
                  selectedMode === 'extreme' && 'text-impostor'
                )}>
                  {selectedMode === 'classic' && 'Clásico'}
                  {selectedMode === 'chaos' && 'Caos'}
                  {selectedMode === 'extreme' && '🔥 Caos Extremo'}
                </span>
              </p>
            </div>

            <div className="card-mystery rounded-2xl p-6">
              <PlayerInput
                players={players}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
                minPlayers={3}
              />
            </div>

            <Button
              onClick={() => setStep('config')}
              disabled={players.length < 3}
              className="w-full btn-fire"
              size="lg"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Configuration */}
        {step === 'config' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <Button
              variant="ghost"
              onClick={() => setStep('players')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-foreground">
                Configuración
              </h2>
            </div>

            {/* Impostor Count (only for classic mode) */}
            {selectedMode === 'classic' && (
              <div className="card-mystery rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Cantidad de impostores</Label>
                  <span className="text-xl font-display text-impostor">
                    {impostorCount}
                  </span>
                </div>
                <Slider
                  value={[impostorCount]}
                  onValueChange={([value]) => setImpostorCount(value)}
                  min={1}
                  max={Math.max(1, Math.floor(players.length / 2))}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Máximo: {Math.floor(players.length / 2)} para {players.length} jugadores
                </p>
              </div>
            )}

            {/* Timer */}
            <div className="card-mystery rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Duración de la partida</Label>
                <span className="text-xl font-display text-primary">
                  {timerMinutes} min
                </span>
              </div>
              <Slider
                value={[timerMinutes]}
                onValueChange={([value]) => setTimerMinutes(value)}
                min={2}
                max={15}
                step={1}
                className="w-full"
              />
            </div>

            {/* Theme Selection */}
            <div className="card-mystery rounded-2xl p-6">
              <ThemeManager
                themes={themes}
                selectedTheme={selectedTheme || undefined}
                onSelectTheme={setSelectedTheme}
                onAddTheme={handleAddTheme}
                onDeleteTheme={handleDeleteTheme}
              />
            </div>

            <Button
              onClick={handleStartSetup}
              disabled={!selectedTheme}
              className="w-full btn-fire"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar partida
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
};

export default Index;
