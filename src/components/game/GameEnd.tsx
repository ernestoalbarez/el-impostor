import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player, GameMode, Word } from '@/types/game';
import { BackgroundEffects } from './BackgroundEffects';
import { cn } from '@/lib/utils';
import { Trophy, RotateCcw, Home, Skull, Shield, Shuffle, Eye } from 'lucide-react';
import { SupportPrompt } from './SupportPrompt';

interface GameEndProps {
  players: Player[];
  civilsWin: boolean;
  mode: GameMode;
  selectedWord?: Word;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onChangeMode?: () => void;
}

const roleLabels: Record<string, string> = {
  civil: 'Civil',
  impostor: 'Impostor',
  falseImpostor: 'Falso Impostor',
};

export const GameEnd = ({
  players,
  civilsWin,
  mode,
  selectedWord,
  onPlayAgain,
  onGoHome,
  onChangeMode,
}: GameEndProps) => {
  const impostors = players.filter(p => p.role === 'impostor');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen px-4 py-8 relative z-10">
      <BackgroundEffects />
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        {/* Victory Banner */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className={cn(
            'text-center p-10 rounded-3xl card-glass',
            civilsWin ? 'border-2 border-civil/30 glow-civil' : 'border-2 border-impostor/30 glow-impostor'
          )}
        >
          <Trophy className={cn('w-16 h-16 mx-auto mb-4', civilsWin ? 'text-civil' : 'text-impostor')} />
          <h1 className={cn('text-4xl md:text-5xl font-display font-extrabold mb-2', civilsWin ? 'text-civil' : 'text-impostor')}>
            {civilsWin ? '¡Civiles ganan!' : '¡Impostores ganan!'}
          </h1>
        </motion.div>

        {/* Word reveal */}
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center card-glass rounded-2xl p-5 space-y-1"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest">La palabra era</p>
            <p className="text-3xl font-display font-extrabold text-foreground">{selectedWord.principal}</p>
            <p className="text-sm text-muted-foreground">Pista: {selectedWord.pista_principal}</p>
          </motion.div>
        )}

        {mode !== 'extreme' && (
          <div className="text-center text-muted-foreground text-sm">
            <p>Impostores en esta partida: {impostors.length}</p>
          </div>
        )}

        {/* Player Roles */}
        <div className="space-y-3">
          <h2 className="text-xl font-display font-bold text-center text-muted-foreground">Roles revelados</h2>
          <div className="space-y-2">
            {players.map((player, index) => {
              const isImpostorRole = player.role === 'impostor';
              const isFalseImpostor = player.role === 'falseImpostor';
              // At game end, always reveal all roles
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                  className={cn(
                    'p-4 rounded-xl border bg-secondary/20 backdrop-blur-sm',
                    player.isEliminated && 'opacity-50',
                    isImpostorRole ? 'border-impostor/30' : isFalseImpostor ? 'border-warning/30' : 'border-civil/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center',
                        isImpostorRole ? 'bg-impostor/15' : isFalseImpostor ? 'bg-warning/15' : 'bg-civil/15'
                      )}>
                        {isImpostorRole ? <Skull className="w-4 h-4 text-impostor" /> :
                          isFalseImpostor ? <Eye className="w-4 h-4 text-warning" /> :
                            <Shield className="w-4 h-4 text-civil" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {player.name}
                          {player.isEliminated && <span className="text-xs text-muted-foreground ml-2">(eliminado)</span>}
                        </p>
                        <p className={cn('text-xs font-medium', isImpostorRole ? 'text-impostor' : isFalseImpostor ? 'text-warning' : 'text-civil')}>
                          {player.role ? roleLabels[player.role] : 'Desconocido'}
                        </p>
                      </div>
                    </div>
                    {player.word && <span className="text-xs text-muted-foreground italic">"{player.word}"</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <Button onClick={onPlayAgain} className="w-full btn-fire rounded-xl h-12 text-base" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />Jugar otra ronda
          </Button>
          {onChangeMode && (
            <Button onClick={onChangeMode} variant="outline" className="w-full rounded-xl h-12 border-border/40 hover:bg-secondary/50" size="lg">
              <Shuffle className="w-5 h-5 mr-2" />Cambiar modo de juego
            </Button>
          )}
          <Button onClick={onGoHome} variant="ghost" className="w-full rounded-xl h-12 hover:bg-secondary/50" size="lg">
            <Home className="w-5 h-5 mr-2" />Inicio
          </Button>
        </div>

        <SupportPrompt />
      </div>
    </motion.div>
  );
};
