import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Player, RoleType } from '@/types/game';
import { BackgroundEffects } from './BackgroundEffects';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, ArrowLeft, Play, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
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

interface RoleRevealProps {
  players: Player[];
  revealedPlayerIds: Set<string>;
  onRevealPlayer: (playerId: string) => void;
  onStartGame: () => void;
  onRestartRound?: () => void;
  onGoHome?: () => void;
  hideRoles?: boolean;
}

export const RoleReveal = ({ players, revealedPlayerIds, onRevealPlayer, onStartGame, onRestartRound, onGoHome, hideRoles = false }: RoleRevealProps) => {
  const { t } = useLanguage();
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const allRevealed = revealedPlayerIds.size === players.length;

  const roleLabels: Record<RoleType, string> = {
    civil: t('role_civil'),
    impostor: t('role_impostor'),
    falseImpostor: t('role_false_impostor'),
  };

  const roleDescriptions: Record<RoleType, string> = {
    civil: t('role_civil_desc'),
    impostor: t('role_impostor_desc'),
    falseImpostor: t('role_false_impostor_desc'),
  };

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

  const isImpostorRole = (role?: RoleType) => role === 'impostor';

  if (viewingPlayer) {
    const shouldShowRole = !hideRoles;
    const displayRole = shouldShowRole && viewingPlayer.role ? roleLabels[viewingPlayer.role] : '';
    const description = shouldShowRole && viewingPlayer.role ? roleDescriptions[viewingPlayer.role] : '';
    const isImpostor = isImpostorRole(viewingPlayer.role);

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 relative z-10">
        <BackgroundEffects />
        <motion.div
          key="revealed"
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center space-y-6 w-full max-w-sm relative z-10"
        >
          <p className="text-foreground/70 text-sm uppercase tracking-widest font-bold">{viewingPlayer.name}</p>
          <div className={cn(
            'p-8 rounded-3xl card-glass border-2',
            hideRoles ? 'border-primary/40 glow-civil' :
            isImpostor ? 'border-impostor/40 glow-impostor' : 'border-civil/40 glow-civil'
          )}>
            {shouldShowRole && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="space-y-4">
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold">{t('your_role')}</p>
                <h3 className={cn('text-4xl md:text-5xl font-display font-black drop-shadow-lg', isImpostor ? 'text-impostor' : 'text-civil')}>{displayRole}</h3>
                <p className="text-foreground/50 text-sm font-medium">{description}</p>
              </motion.div>
            )}
            {hideRoles && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="space-y-4">
                <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold">{t('your_role')}</p>
                <h3 className="text-4xl md:text-5xl font-display font-black text-primary drop-shadow-lg">{t('role_hidden')}</h3>
                <p className="text-foreground/50 text-sm font-medium">{t('role_hidden_desc')}</p>
              </motion.div>
            )}
            {viewingPlayer.word && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 pt-6 border-t border-border/30">
                <p className="text-sm text-foreground/60 uppercase tracking-widest mb-2 font-semibold">{t('your_word')}</p>
                <p className="text-2xl md:text-3xl font-display font-black text-foreground drop-shadow-md">{viewingPlayer.word}</p>
              </motion.div>
            )}
            {!hideRoles && viewingPlayer.role === 'falseImpostor' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4 p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-xs text-accent font-medium">{t('false_impostor_hint')}</p>
              </motion.div>
            )}
          </div>
          <Button onClick={handleConfirmReveal} size="lg" className="btn-fire px-8 rounded-xl h-12">
            <ArrowLeft className="w-5 h-5 mr-2" />{t('understood_back')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 relative z-10">
      <BackgroundEffects />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 w-full max-w-sm relative z-10">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gradient-fire">{t('reveal_roles')}</h2>
          <p className="text-muted-foreground text-sm">{t('reveal_roles_desc')}</p>
        </div>
        <div className="space-y-3">
          {players.map((player) => {
            const revealed = revealedPlayerIds.has(player.id);
            return (
              <motion.button
                key={player.id}
                layout
                whileHover={!revealed ? { scale: 1.02, y: -1 } : {}}
                whileTap={!revealed ? { scale: 0.98 } : {}}
                onClick={() => handlePlayerClick(player)}
                disabled={revealed}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between',
                  revealed
                    ? 'opacity-30 border-border/20 bg-secondary/20 cursor-default'
                    : 'border-primary/20 bg-secondary/50 hover:border-primary/50 hover:bg-secondary/70 cursor-pointer backdrop-blur-sm'
                )}
              >
                <span className={cn('font-medium text-lg', revealed ? 'text-muted-foreground line-through' : 'text-foreground')}>{player.name}</span>
                {revealed ? <Eye className="w-5 h-5 text-muted-foreground/40" /> : <EyeOff className="w-5 h-5 text-primary" />}
              </motion.button>
            );
          })}
        </div>
        {allRevealed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={onStartGame} size="lg" className="w-full btn-fire rounded-xl h-12 text-base">
              <Play className="w-5 h-5 mr-2" />{t('start_match')}
            </Button>
          </motion.div>
        )}
        <div className="space-y-2 pt-2">
          {onRestartRound && (
            <Button
              variant="ghost"
              onClick={() => setShowRestartConfirm(true)}
              className="w-full rounded-xl h-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('restart_round')}
            </Button>
          )}
          {onGoHome && (
            <Button
              variant="ghost"
              onClick={onGoHome}
              className="w-full rounded-xl h-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('go_home')}
            </Button>
          )}
        </div>
      </motion.div>

      {onRestartRound && (
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
              <AlertDialogAction onClick={() => { setShowRestartConfirm(false); onRestartRound(); }} className="btn-fire rounded-xl">
                {t('restart')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
