import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player, RoleType } from '@/types/game';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, ArrowLeft, Play } from 'lucide-react';

interface RoleRevealProps {
  players: Player[];
  revealedPlayerIds: Set<string>;
  onRevealPlayer: (playerId: string) => void;
  onStartGame: () => void;
}

const roleLabels: Record<RoleType, string> = {
  civil: 'CIVIL',
  impostor: 'IMPOSTOR',
  falseImpostor: 'CIVIL',
  impostorNoWord: 'IMPOSTOR',
};

const roleDescriptions: Record<RoleType, string> = {
  civil: 'Encuentra a los impostores',
  impostor: 'No te descubran',
  falseImpostor: 'Encuentra a los impostores (NO sos impostor)',
  impostorNoWord: 'Sos impostor. No tenés palabra.',
};

export const RoleReveal = ({ players, revealedPlayerIds, onRevealPlayer, onStartGame }: RoleRevealProps) => {
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const allRevealed = revealedPlayerIds.size === players.length;

  const handlePlayerClick = (player: Player) => {
    if (revealedPlayerIds.has(player.id)) return;
    setViewingPlayer(player);
  };

  const handleConfirmReveal = () => {
    if (viewingPlayer) {
      onRevealPlayer(viewingPlayer.id);
      setViewingPlayer(null);
    }
  };

  const handleBack = () => {
    setViewingPlayer(null);
  };

  const isImpostorRole = (role?: RoleType) => role === 'impostor' || role === 'impostorNoWord';

  // Viewing a specific player's role
  if (viewingPlayer) {
    const displayRole = viewingPlayer.role ? roleLabels[viewingPlayer.role] : '';
    const description = viewingPlayer.role ? roleDescriptions[viewingPlayer.role] : '';
    const isImpostor = isImpostorRole(viewingPlayer.role);

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          key="revealed"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center space-y-6 w-full max-w-sm"
        >
          <p className="text-muted-foreground text-sm uppercase tracking-wider">
            {viewingPlayer.name}
          </p>

          <div
            className={cn(
              'p-8 rounded-2xl card-mystery border-2',
              isImpostor ? 'border-impostor/50 glow-impostor' : 'border-civil/50 glow-civil'
            )}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                Tu rol es
              </p>
              <h3
                className={cn(
                  'text-4xl md:text-5xl font-display',
                  isImpostor ? 'text-impostor' : 'text-civil'
                )}
              >
                {displayRole}
              </h3>
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            </motion.div>

            {viewingPlayer.word && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-6 border-t border-border/50"
              >
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Tu palabra
                </p>
                <p className="text-2xl md:text-3xl font-display text-foreground">
                  {viewingPlayer.word}
                </p>
              </motion.div>
            )}

            {viewingPlayer.role === 'impostorNoWord' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 pt-6 border-t border-border/50"
              >
                <p className="text-lg text-impostor font-semibold">
                  ¡Improvisa!
                </p>
              </motion.div>
            )}

            {viewingPlayer.role === 'falseImpostor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30"
              >
                <p className="text-xs text-accent">
                  ⚠️ Tu palabra es igual a la de un impostor, pero NO sos impostor
                </p>
              </motion.div>
            )}
          </div>

          <Button
            onClick={handleConfirmReveal}
            size="lg"
            className="btn-fire px-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Entendido, volver
          </Button>
        </motion.div>
      </div>
    );
  }

  // Player list view
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 w-full max-w-sm"
      >
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-display text-gradient-fire">
            Revelar roles
          </h2>
          <p className="text-muted-foreground text-sm">
            Cada jugador toca su nombre para ver su rol
          </p>
        </div>

        <div className="space-y-3">
          {players.map((player) => {
            const revealed = revealedPlayerIds.has(player.id);
            return (
              <motion.button
                key={player.id}
                layout
                whileHover={!revealed ? { scale: 1.02 } : {}}
                whileTap={!revealed ? { scale: 0.98 } : {}}
                onClick={() => handlePlayerClick(player)}
                disabled={revealed}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all duration-300',
                  'flex items-center justify-between',
                  revealed
                    ? 'opacity-40 border-border/30 bg-secondary/10 cursor-default'
                    : 'border-primary/30 bg-secondary/30 hover:border-primary/60 hover:bg-secondary/50 cursor-pointer card-mystery'
                )}
              >
                <span className={cn(
                  'font-medium text-lg',
                  revealed ? 'text-muted-foreground line-through' : 'text-foreground'
                )}>
                  {player.name}
                </span>
                {revealed ? (
                  <Eye className="w-5 h-5 text-muted-foreground/50" />
                ) : (
                  <EyeOff className="w-5 h-5 text-primary" />
                )}
              </motion.button>
            );
          })}
        </div>

        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={onStartGame}
              size="lg"
              className="w-full btn-fire"
            >
              <Play className="w-5 h-5 mr-2" />
              Comenzar partida
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
