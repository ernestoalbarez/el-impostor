import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface PlayerInputProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
  minPlayers?: number;
}

export const PlayerInput = ({ 
  players, 
  onAddPlayer, 
  onRemovePlayer, 
  minPlayers = 3 
}: PlayerInputProps) => {
  const { t } = useLanguage();
  const [newPlayer, setNewPlayer] = useState('');

  const handleAddPlayer = () => {
    if (newPlayer.trim() && !players.includes(newPlayer.trim())) {
      onAddPlayer(newPlayer.trim());
      setNewPlayer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPlayer();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Users className="w-5 h-5" />
        <span className="text-sm font-medium">
          {players.length} {t('players_count')}{' '}
          {players.length < minPlayers && <span className="text-xs ml-1 text-muted-foreground/70">({t('players_min')} {minPlayers})</span>}
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('player_name_placeholder')}
          className="flex-1 bg-secondary/30 border-border/30 focus:border-primary/50 rounded-xl h-11"
        />
        <Button
          onClick={handleAddPlayer}
          disabled={!newPlayer.trim() || players.includes(newPlayer.trim())}
          size="icon"
          className="shrink-0 rounded-xl h-11 w-11"
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => (
            <motion.div
              key={player}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/20"
            >
              <span className="font-medium text-sm">{player}</span>
              <Button
                onClick={() => onRemovePlayer(index)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
