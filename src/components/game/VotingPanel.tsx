import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { UserX, AlertTriangle, Check } from 'lucide-react';
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

interface VotingPanelProps {
  players: Player[];
  onEliminate: (playerId: string) => void;
}

export const VotingPanel = ({ players, onEliminate }: VotingPanelProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const activePlayers = players.filter(p => !p.isEliminated);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleVote = () => {
    if (selectedPlayer) {
      setShowConfirm(true);
    }
  };

  const confirmElimination = () => {
    if (selectedPlayer) {
      onEliminate(selectedPlayer.id);
      setSelectedPlayer(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <UserX className="w-5 h-5" />
        <span className="text-sm uppercase tracking-widest font-medium">Votación</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {activePlayers.map((player) => (
            <motion.button
              key={player.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePlayerSelect(player)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200',
                'bg-secondary/20 hover:bg-secondary/40 backdrop-blur-sm',
                selectedPlayer?.id === player.id
                  ? 'border-impostor/50 bg-impostor/10 ring-1 ring-impostor/30'
                  : 'border-border/30 hover:border-primary/40'
              )}
            >
              <span className="font-medium text-sm">{player.name}</span>
              {selectedPlayer?.id === player.id && (
                <Check className="w-4 h-4 inline ml-2 text-impostor" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Button
        onClick={handleVote}
        disabled={!selectedPlayer}
        className="w-full btn-fire rounded-xl h-11"
        size="lg"
      >
        <AlertTriangle className="w-5 h-5 mr-2" />
        Eliminar a {selectedPlayer?.name || '...'}
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="card-glass border-impostor/30 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-extrabold">
              ¿Eliminar a {selectedPlayer?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta acción no se puede deshacer. El jugador será eliminado de la partida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80 rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmElimination} className="btn-fire rounded-xl">
              Confirmar eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
