import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame, GameProvider } from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { GameMode, Category } from '@/types/game';
import { loadPlayers, savePlayers, loadConfig, saveConfig, incrementGameCount } from '@/engine/storageService';
import { GameModeCard } from '@/components/game/GameModeCard';
import { PlayerInput } from '@/components/game/PlayerInput';
import { ThemeManager } from '@/components/game/ThemeManager';
import { RoleReveal } from '@/components/game/RoleReveal';
import { GameTimer } from '@/components/game/GameTimer';
import { VotingPanel } from '@/components/game/VotingPanel';
import { EliminationResult } from '@/components/game/EliminationResult';
import { GameEnd } from '@/components/game/GameEnd';
import { StatsPanel } from '@/components/game/StatsPanel';
import { BackgroundEffects } from '@/components/game/BackgroundEffects';
import { LanguageSelector } from '@/components/game/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Play, Skull, BarChart3, Info, Heart, RotateCcw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const GameApp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    restartRound,
    handleImpostorGuess,
    canImpostorGuessNow,
  } = useGame();

  const [step, setStep] = useState<'mode' | 'players' | 'config' | 'game' | 'stats'>('mode');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [players, setPlayers] = useState<string[]>(() => loadPlayers());
  const [impostorCount, setImpostorCount] = useState(() => {
    const saved = loadConfig();
    return saved?.impostorCount ?? 1;
  });
  const [timerMinutes, setTimerMinutes] = useState(() => {
    const saved = loadConfig();
    return saved?.timerMinutes ?? 5;
  });
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(categories);
  const [hideImpostorHint, setHideImpostorHint] = useState(false);

  useEffect(() => { savePlayers(players); }, [players]);

  const [eliminationResult, setEliminationResult] = useState<{
    player: any;
    isImpostor: boolean;
    gameOver: boolean;
    civilsWin: boolean;
  } | null>(null);

  const [gameEnded, setGameEnded] = useState<{ civilsWin: boolean } | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showImpostorGuessConfirm, setShowImpostorGuessConfirm] = useState(false);

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
      saveConfig({
        lastMode: selectedMode,
        impostorCount,
        timerMinutes,
        selectedCategoryIds: selectedCategories.map(c => c.id),
      });
      initializeGame(selectedMode, players, impostorCount, timerMinutes, selectedCategories, hideImpostorHint);
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
      incrementGameCount();
    }
    setEliminationResult(null);
  };

  const handleTimeUp = () => {
    const result = checkVictory();
    if (result.gameOver) {
      setGameEnded({ civilsWin: result.civilsWin });
      incrementGameCount();
    }
  };

  const handleRestartRound = () => {
    setShowRestartConfirm(false);
    restartRound();
  };

  const handleImpostorGuessConfirm = () => {
    setShowImpostorGuessConfirm(false);
    const result = handleImpostorGuess();
    if (result.gameOver) {
      setGameEnded({ civilsWin: result.civilsWin });
      incrementGameCount();
    }
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
      const hideRoles = gameState.config.mode === 'chaos';
      return (
        <RoleReveal
          players={gameState.config.players}
          revealedPlayerIds={revealedPlayerIds}
          onRevealPlayer={revealPlayer}
          onStartGame={() => startGame()}
          onRestartRound={restartRound}
          onGoHome={handleGoHome}
          hideRoles={hideRoles}
        />
      );
    }

    if (gameState.phase === 'playing') {
      return (
        <div className="min-h-screen px-4 py-8 relative z-10">
          <BackgroundEffects />
          <div className="max-w-md mx-auto space-y-8 relative z-10">
            <motion.div {...pageTransition} className="text-center space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-foreground/70 uppercase tracking-widest font-semibold">{t('first_turn')}</p>
                <p className="text-3xl md:text-4xl font-display font-extrabold text-gradient-fire drop-shadow-lg">
                  {gameState.startingPlayer}
                </p>
              </div>
            </motion.div>
            <motion.div {...pageTransition} transition={{ delay: 0.1 }} className="card-glass rounded-2xl p-6">
              <GameTimer initialTime={gameState.config.timerMinutes * 60} onTimeUp={handleTimeUp} onTimeUpdate={updateTimer} />
            </motion.div>
            <motion.div {...pageTransition} transition={{ delay: 0.15 }} className="flex items-center justify-center gap-2 text-foreground/60">
              <Skull className="w-5 h-5" />
              <span className="text-sm font-semibold">{gameState.config.players.filter(p => !p.isEliminated).length} {t('remaining_players')}</span>
            </motion.div>
            <motion.div {...pageTransition} transition={{ delay: 0.2 }} className="card-glass rounded-2xl p-6">
              <VotingPanel players={gameState.config.players} onEliminate={handleEliminate} />
            </motion.div>

            {canImpostorGuessNow() && (
              <motion.div {...pageTransition} transition={{ delay: 0.25 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowImpostorGuessConfirm(true)}
                  className="w-full rounded-xl h-11 border-impostor/30 text-impostor hover:bg-impostor/10 hover:border-impostor/50"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {t('impostor_guessed_word')}
                </Button>
              </motion.div>
            )}

            <motion.div {...pageTransition} transition={{ delay: 0.3 }}>
              <Button
                variant="ghost"
                onClick={() => setShowRestartConfirm(true)}
                className="w-full rounded-xl h-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('restart_round')}
              </Button>
            </motion.div>
          </div>

          <AlertDialog open={showRestartConfirm} onOpenChange={setShowRestartConfirm}>
            <AlertDialogContent className="card-glass border-border/30 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-display font-extrabold">
                  {t('restart_round_title')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  {t('restart_round_desc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary hover:bg-secondary/80 rounded-xl">
                  {t('cancel')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRestartRound} className="btn-fire rounded-xl">
                  {t('restart')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showImpostorGuessConfirm} onOpenChange={setShowImpostorGuessConfirm}>
            <AlertDialogContent className="card-glass border-impostor/30 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-display font-extrabold text-impostor">
                  {t('impostor_guess_title')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  {t('impostor_guess_desc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-secondary hover:bg-secondary/80 rounded-xl">
                  {t('cancel')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleImpostorGuessConfirm} className="bg-impostor hover:bg-impostor/90 rounded-xl text-white">
                  {t('confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }
  }

  // Stats Screen
  if (step === 'stats') {
    return (
      <div className="min-h-screen px-4 py-8 relative z-10">
        <BackgroundEffects />
        <div className="max-w-md mx-auto space-y-6 relative z-10">
          <Button variant="ghost" onClick={() => setStep('mode')} className="mb-4 hover:bg-secondary/50">
            <ArrowLeft className="w-4 h-4 mr-2" />{t('back')}
          </Button>
          <StatsPanel />
        </div>
      </div>
    );
  }

  const modeNames: Record<string, string> = {
    classic: t('mode_classic'),
    chaos: t('mode_mystery'),
    extreme: t('mode_chaos'),
  };

  return (
    <div className="min-h-screen px-4 py-8 relative z-10">
      <BackgroundEffects />
      <div className="max-w-md mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step === 'mode' && (
            <motion.div key="mode" {...pageTransition} className="space-y-6">
              <div className="text-center mb-10 pt-8">
                <div className="flex justify-end mb-4">
                  <LanguageSelector />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="text-6xl md:text-7xl font-display font-extrabold text-gradient-fire mb-3 leading-tight">
                    El Impostor
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-sm tracking-widest uppercase"
                >
                  {t('home_subtitle')}
                </motion.p>
              </div>

              <div className="space-y-4">
                {[
                  { mode: 'classic' as GameMode, title: t('mode_classic'), desc: t('mode_classic_desc') },
                  { mode: 'chaos' as GameMode, title: t('mode_mystery'), desc: t('mode_mystery_desc') },
                  { mode: 'extreme' as GameMode, title: t('mode_chaos'), desc: t('mode_chaos_desc') },
                ].map((item, i) => (
                  <motion.div
                    key={item.mode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <GameModeCard
                      mode={item.mode}
                      title={item.title}
                      description={item.desc}
                      onClick={() => handleSelectMode(item.mode)}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Button
                  variant="outline"
                  className="w-full border-border/40 hover:bg-secondary/50 hover:border-border/60 transition-all"
                  onClick={() => setStep('stats')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />{t('stats')}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    onClick={() => navigate('/about')}
                  >
                    <Info className="w-4 h-4 mr-2" />{t('about')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    onClick={() => navigate('/support')}
                  >
                    <Heart className="w-4 h-4 mr-2" />{t('support')}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 'players' && (
            <motion.div key="players" {...pageTransition} className="space-y-8">
              <Button variant="ghost" onClick={() => setStep('mode')} className="mb-2 hover:bg-secondary/50">
                <ArrowLeft className="w-4 h-4 mr-2" />{t('back')}
              </Button>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-extrabold text-foreground mb-2">{t('players')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('mode_label')}: <span className={cn(
                    'font-semibold',
                    selectedMode === 'classic' && 'text-primary',
                    selectedMode === 'chaos' && 'text-accent',
                    selectedMode === 'extreme' && 'text-impostor'
                  )}>
                    {selectedMode ? modeNames[selectedMode] : ''}
                  </span>
                </p>
              </div>
              <div className="card-glass rounded-2xl p-6">
                <PlayerInput players={players} onAddPlayer={handleAddPlayer} onRemovePlayer={handleRemovePlayer} minPlayers={3} />
              </div>
              <Button onClick={() => setStep('config')} disabled={players.length < 3} className="w-full btn-fire rounded-xl h-12 text-base" size="lg">
                {t('continue')}<ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 'config' && (
            <motion.div key="config" {...pageTransition} className="space-y-8">
              <Button variant="ghost" onClick={() => setStep('players')} className="mb-2 hover:bg-secondary/50">
                <ArrowLeft className="w-4 h-4 mr-2" />{t('back')}
              </Button>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-display font-extrabold text-foreground">{t('config_title')}</h2>
              </div>
              {selectedMode === 'classic' && (
                <>
                  <div className="card-glass rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">{t('impostor_count')}</Label>
                      <span className="text-2xl font-display font-extrabold text-impostor">{impostorCount}</span>
                    </div>
                    <Slider value={[impostorCount]} onValueChange={([v]) => setImpostorCount(v)} min={1} max={Math.max(1, Math.floor(players.length / 2))} step={1} className="w-full" />
                    <p className="text-xs text-muted-foreground">{t('max_for_players', { max: Math.floor(players.length / 2), count: players.length })}</p>
                  </div>
                  <div className="card-glass rounded-2xl p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-foreground">{t('hide_impostor_hint')}</Label>
                        <p className="text-xs text-muted-foreground">{t('hide_impostor_hint_desc')}</p>
                      </div>
                      <Switch checked={hideImpostorHint} onCheckedChange={setHideImpostorHint} />
                    </div>
                  </div>
                </>
              )}
              <div className="card-glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">{t('game_duration')}</Label>
                  <span className="text-2xl font-display font-extrabold text-primary">{timerMinutes} {t('min_label')}</span>
                </div>
                <Slider value={[timerMinutes]} onValueChange={([v]) => setTimerMinutes(v)} min={2} max={15} step={1} className="w-full" />
              </div>
              <div className="card-glass rounded-2xl p-6">
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
              <Button onClick={handleStartSetup} disabled={selectedCategories.length === 0} className="w-full btn-fire rounded-xl h-12 text-base" size="lg">
                <Play className="w-5 h-5 mr-2" />{t('start_game')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
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
