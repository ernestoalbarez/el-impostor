import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Skull, ShieldCheck, ArrowRight, Trophy } from 'lucide-react';

interface EliminationResultProps {
  player: Player;
  isImpostor: boolean;
  gameOver: boolean;
  civilsWin: boolean;
  onContinue: () => void;
}

export const EliminationResult = ({
  player,
  isImpostor,
  gameOver,
  civilsWin,
  onContinue,
}: EliminationResultProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className={cn(
          'w-32 h-32 rounded-full flex items-center justify-center mb-8',
          isImpostor ? 'bg-impostor/20' : 'bg-civil/20'
        )}
      >
        {isImpostor ? (
          <Skull className="w-16 h-16 text-impostor" />
        ) : (
          <ShieldCheck className="w-16 h-16 text-civil" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-4 mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-display">
          {player.name}
        </h2>
        <p
          className={cn(
            'text-2xl font-display',
            isImpostor ? 'text-impostor' : 'text-civil'
          )}
        >
          {isImpostor
            ? 'Un impostor ha sido descubierto'
            : 'Se eliminó a un civil'}
        </p>
      </motion.div>

      {gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'p-6 rounded-2xl mb-8 text-center',
            civilsWin 
              ? 'bg-civil/10 border-2 border-civil/30' 
              : 'bg-impostor/10 border-2 border-impostor/30'
          )}
        >
          <Trophy className={cn(
            'w-12 h-12 mx-auto mb-4',
            civilsWin ? 'text-civil' : 'text-impostor'
          )} />
          <h3 className={cn(
            'text-3xl font-display',
            civilsWin ? 'text-civil' : 'text-impostor'
          )}>
            {civilsWin ? '¡Civiles ganan!' : '¡Impostores ganan!'}
          </h3>
        </motion.div>
      )}

      <Button
        onClick={onContinue}
        size="lg"
        className="btn-fire px-8"
      >
        {gameOver ? 'Ver resultados' : 'Continuar partida'}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
};
