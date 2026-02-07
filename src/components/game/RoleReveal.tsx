import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player, RoleType } from '@/types/game';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, ArrowRight, Play } from 'lucide-react';

interface RoleRevealProps {
  player: Player;
  isLast: boolean;
  onNext: () => void;
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

export const RoleReveal = ({ player, isLast, onNext, onStartGame }: RoleRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const isImpostorRole = player.role === 'impostor' || player.role === 'impostorNoWord';
  const displayRole = player.role ? roleLabels[player.role] : '';
  const description = player.role ? roleDescriptions[player.role] : '';

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    setIsRevealed(false);
    if (isLast) {
      onStartGame();
    } else {
      onNext();
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-8"
          >
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                Turno de revelar
              </p>
              <h2 className="text-4xl md:text-5xl font-display text-gradient-fire">
                {player.name}
              </h2>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-48 h-48 mx-auto rounded-2xl card-mystery',
                'flex items-center justify-center cursor-pointer',
                'border-2 border-primary/30 hover:border-primary/60 transition-colors'
              )}
              onClick={handleReveal}
            >
              <div className="text-center space-y-3">
                <EyeOff className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Toca para revelar</p>
              </div>
            </motion.div>

            <Button
              onClick={handleReveal}
              size="lg"
              className="btn-fire px-8"
            >
              <Eye className="w-5 h-5 mr-2" />
              Revelar mi rol
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center space-y-6 w-full max-w-sm"
          >
            <div
              className={cn(
                'p-8 rounded-2xl card-mystery border-2',
                isImpostorRole ? 'border-impostor/50 glow-impostor' : 'border-civil/50 glow-civil'
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
                    isImpostorRole ? 'text-impostor' : 'text-civil'
                  )}
                >
                  {displayRole}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {description}
                </p>
              </motion.div>

              {player.word && (
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
                    {player.word}
                  </p>
                </motion.div>
              )}

              {player.role === 'impostorNoWord' && (
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

              {player.role === 'falseImpostor' && (
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
              onClick={handleNext}
              size="lg"
              className="btn-fire px-8"
            >
              {isLast ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar partida
                </>
              ) : (
                <>
                  Siguiente jugador
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
