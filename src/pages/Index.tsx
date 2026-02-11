import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame, GameProvider } from '@/context/GameContext';
import { GameMode, Category } from '@/types/game';
import { GameModeCard } from '@/components/game/GameModeCard';
import { PlayerInput } from '@/components/game/PlayerInput';
import { ThemeManager } from '@/components/game/ThemeManager';
import { RoleReveal } from '@/components/game/RoleReveal';
import { GameTimer } from '@/components/game/GameTimer';
import { VotingPanel } from '@/components/game/VotingPanel';
import { EliminationResult } from '@/components/game/EliminationResult';
import { GameEnd } from '@/components/game/GameEnd';
import { StatsPanel } from '@/components/game/StatsPanel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, Play, Skull, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const GameApp = () => {
  const {
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
  } = useGame();

  const [step, setStep] = useState<'mode' | 'players' | 'config' | 'game' | 'stats'>('mode');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(categories);

  const [eliminationResult, setEliminationResult] = useState<{
    player: any;
    isImpostor: boolean;
    gameOver: boolean;
    civilsWin: boolean;
  } | null>(null);

  const [gameEnded, setGameEnded] = useState<{ civilsWin: boolean } | null>(null);

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setStep('players');
  };

  const handleAddPlayer = (name: string) => setPlayers([...players, name]);
  const handleRemovePlayer = (index: number) => setPlayers(players.filter((_, i) => i !== index));

  const handleToggleCategory = (cat: Category) => {
    setSelectedCategories(prev =>
      prev.some(c => c.id === cat.id) ? prev.filter(c => c.id !== cat.id) : [...prev, cat]
    );
  };

  const handleSelectAllCategories = () => setSelectedCategories([...categories]);
  const handleDeselectAllCategories = () => setSelectedCategories([]);

  const handleAddCategory = (cat: Category) => {
    setCategories([...categories, cat]);
    setSelectedCategories(prev => [...prev, cat]);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(categories.filter(c => c.id !== catId));
    setSelectedCategories(prev => prev.filter(c => c.id !== catId));
  };

  const handleStartSetup = () => {
    if (selectedMode && selectedCategories.length > 0 && players.length >= 3) {
      initializeGame(selectedMode, players, impostorCount, timerMinutes, selectedCategories);
      setStep('game');
    }
  };

  const handleEliminate = (playerId: string) => {
    if (!gameState) return;
    const player = gameState.config.players.find(p => p.id === playerId);
    if (!player) return;
    const result = eliminatePlayer(playerId);
    setEliminationResult({ player, ...result });
  };

  const handleContinueAfterElimination = () => {
    if (eliminationResult?.gameOver) {
      setGameEnded({ civilsWin: eliminationResult.civilsWin });
    }
    setEliminationResult(null);
  };

  const handleTimeUp = () => {
    const result = checkVictory();
    if (result.gameOver) setGameEnded({ civilsWin: result.civilsWin });
  };

  const handlePlayAgain = () => {
    resetGame();
    setGameEnded(null);
    setEliminationResult(null);
    setStep('config');
    setSelectedCategories([...categories]);
  };

  const handleGoHome = () => {
    resetGame();
    setGameEnded(null);
    setEliminationResult(null);
    setStep('mode');
    setSelectedMode(null);
    setPlayers([]);
    setSelectedCategories([...categories]);
  };

  const handleChangeMode = () => {
    resetGame();
    setGameEnded(null);
    setEliminationResult(null);
    setStep('mode');
    setSelectedCategories([...categories]);
  };

  // Game End Screen
  if (gameEnded && gameState) {
    return (
      <GameEnd
        players={gameState.config.players}
        civilsWin={gameEnded.civilsWin}
        mode={gameState.config.mode}
        selectedWord={gameState.config.selectedWord}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
        onChangeMode={handleChangeMode}
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

  // Game Screen
  if (step === 'game' && gameState) {
    if (gameState.phase === 'reveal') {
      return (
        <RoleReveal
          players={gameState.config.players}
          revealedPlayerIds={revealedPlayerIds}
          onRevealPlayer={revealPlayer}
          onStartGame={() => startGame()}
        />
      );
    }

    if (gameState.phase === 'playing') {
      return (
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-display text-gradient-fire">El Impostor</h1>
              <p className="text-sm text-muted-foreground">
                Primer turno: <span className="text-foreground font-medium">{gameState.startingPlayer}</span>
              </p>
            </div>
            <div className="card-mystery rounded-2xl p-6">
              <GameTimer initialTime={gameState.config.timerMinutes * 60} onTimeUp={handleTimeUp} onTimeUpdate={updateTimer} />
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Skull className="w-5 h-5" />
              <span>{gameState.config.players.filter(p => !p.isEliminated).length} jugadores restantes</span>
            </div>
            <div className="card-mystery rounded-2xl p-6">
              <VotingPanel players={gameState.config.players} onEliminate={handleEliminate} />
            </div>
          </div>
        </div>
      );
    }
  }

  // Stats Screen
  if (step === 'stats') {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <Button variant="ghost" onClick={() => setStep('mode')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
          <StatsPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display text-gradient-fire mb-2">El Impostor</h1>
          <p className="text-muted-foreground">El caos es diseño intencional</p>
        </motion.div>

        {step === 'mode' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <GameModeCard mode="classic" title="CLÁSICO" description="Tú defines la cantidad de impostores. Deducción tradicional." onClick={() => handleSelectMode('classic')} />
            <GameModeCard mode="chaos" title="CAOS" description="La cantidad de impostores es aleatoria. Nadie sabe cuántos hay." onClick={() => handleSelectMode('chaos')} />
            <GameModeCard mode="extreme" title="🔥 CAOS EXTREMO" description="Roles especiales, falsos impostores, pistas secundarias. El caos total." onClick={() => handleSelectMode('extreme')} />
            <Button variant="outline" className="w-full mt-4" onClick={() => setStep('stats')}>
              <BarChart3 className="w-4 h-4 mr-2" />Estadísticas
            </Button>
          </motion.div>
        )}

        {step === 'players' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <Button variant="ghost" onClick={() => setStep('mode')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-foreground mb-2">Agregar jugadores</h2>
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
              <PlayerInput players={players} onAddPlayer={handleAddPlayer} onRemovePlayer={handleRemovePlayer} minPlayers={3} />
            </div>
            <Button onClick={() => setStep('config')} disabled={players.length < 3} className="w-full btn-fire" size="lg">
              Continuar<ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 'config' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <Button variant="ghost" onClick={() => setStep('players')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />Volver
            </Button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display text-foreground">Configuración</h2>
            </div>
            {selectedMode === 'classic' && (
              <div className="card-mystery rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Cantidad de impostores</Label>
                  <span className="text-xl font-display text-impostor">{impostorCount}</span>
                </div>
                <Slider value={[impostorCount]} onValueChange={([v]) => setImpostorCount(v)} min={1} max={Math.max(1, Math.floor(players.length / 2))} step={1} className="w-full" />
                <p className="text-xs text-muted-foreground">Máximo: {Math.floor(players.length / 2)} para {players.length} jugadores</p>
              </div>
            )}
            <div className="card-mystery rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Duración de la partida</Label>
                <span className="text-xl font-display text-primary">{timerMinutes} min</span>
              </div>
              <Slider value={[timerMinutes]} onValueChange={([v]) => setTimerMinutes(v)} min={2} max={15} step={1} className="w-full" />
            </div>
            <div className="card-mystery rounded-2xl p-6">
              <ThemeManager
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onSelectAll={handleSelectAllCategories}
                onDeselectAll={handleDeselectAllCategories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
            <Button onClick={handleStartSetup} disabled={selectedCategories.length === 0} className="w-full btn-fire" size="lg">
              <Play className="w-5 h-5 mr-2" />Iniciar partida
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Index = () => (
  <GameProvider>
    <GameApp />
  </GameProvider>
);

export default Index;
