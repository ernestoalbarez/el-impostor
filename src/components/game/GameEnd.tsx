import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player, GameMode, Word } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, RotateCcw, Home, Skull, Shield, Shuffle, Eye } from 'lucide-react';

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Victory Banner */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className={cn(
            'text-center p-8 rounded-2xl',
            civilsWin ? 'bg-civil/10 border-2 border-civil/30 glow-civil' : 'bg-impostor/10 border-2 border-impostor/30 glow-impostor'
          )}
        >
          <Trophy className={cn('w-16 h-16 mx-auto mb-4', civilsWin ? 'text-civil' : 'text-impostor')} />
          <h1 className={cn('text-4xl md:text-5xl font-display mb-2', civilsWin ? 'text-civil' : 'text-impostor')}>
            {civilsWin ? '¡Civiles ganan!' : '¡Impostores ganan!'}
          </h1>
        </motion.div>

        {/* Word reveal */}
        {selectedWord && (
          <div className="text-center card-mystery rounded-2xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">La palabra era</p>
            <p className="text-2xl font-display text-foreground">{selectedWord.principal}</p>
            <p className="text-sm text-muted-foreground">Pista: {selectedWord.pista_principal}</p>
          </div>
        )}

        {mode !== 'extreme' && (
          <div className="text-center text-muted-foreground text-sm">
            <p>Impostores en esta partida: {impostors.length}</p>
          </div>
        )}

        {/* Player Roles */}
        <div className="space-y-3">
          <h2 className="text-xl font-display text-center text-muted-foreground">Roles revelados</h2>
          <div className="space-y-2">
            {players.map((player, index) => {
              const isImpostorRole = player.role === 'impostor';
              const isFalseImpostor = player.role === 'falseImpostor';
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-4 rounded-xl border bg-secondary/30',
                    player.isEliminated && 'opacity-60',
                    isImpostorRole ? 'border-impostor/30' : isFalseImpostor ? 'border-warning/30' : 'border-civil/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        isImpostorRole ? 'bg-impostor/20' : isFalseImpostor ? 'bg-warning/20' : 'bg-civil/20'
                      )}>
                        {isImpostorRole ? <Skull className="w-4 h-4 text-impostor" /> :
                         isFalseImpostor ? <Eye className="w-4 h-4 text-warning" /> :
                         <Shield className="w-4 h-4 text-civil" />}
                      </div>
                      <div>
                        <p className="font-medium">
                          {player.name}
                          {player.isEliminated && <span className="text-xs text-muted-foreground ml-2">(eliminado)</span>}
                        </p>
                        <p className={cn('text-sm', isImpostorRole ? 'text-impostor' : isFalseImpostor ? 'text-warning' : 'text-civil')}>
                          {player.role ? roleLabels[player.role] : 'Desconocido'}
                        </p>
                      </div>
                    </div>
                    {player.word && <span className="text-sm text-muted-foreground italic">"{player.word}"</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onPlayAgain} className="w-full btn-fire" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />Jugar otra ronda
          </Button>
          {onChangeMode && (
            <Button onClick={onChangeMode} variant="outline" className="w-full" size="lg">
              <Shuffle className="w-5 h-5 mr-2" />Cambiar modo de juego
            </Button>
          )}
          <Button onClick={onGoHome} variant="ghost" className="w-full" size="lg">
            <Home className="w-5 h-5 mr-2" />Inicio
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
