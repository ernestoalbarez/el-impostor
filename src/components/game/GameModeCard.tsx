import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GameMode } from '@/types/game';
import { Flame, Shuffle, Zap } from 'lucide-react';

interface GameModeCardProps {
  mode: GameMode;
  title: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}

const modeIcons: Record<GameMode, React.ReactNode> = {
  classic: <Shuffle className="w-8 h-8" />,
  chaos: <Zap className="w-8 h-8" />,
  extreme: <Flame className="w-8 h-8" />,
};

const modeColors: Record<GameMode, string> = {
  classic: 'from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60',
  chaos: 'from-accent/20 to-accent/5 border-accent/30 hover:border-accent/60',
  extreme: 'from-impostor/20 to-impostor/5 border-impostor/30 hover:border-impostor/60',
};

const modeTextColors: Record<GameMode, string> = {
  classic: 'text-primary',
  chaos: 'text-accent',
  extreme: 'text-impostor',
};

export const GameModeCard = ({ mode, title, description, onClick, isSelected }: GameModeCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full p-6 rounded-xl border-2 bg-gradient-to-br transition-all duration-300',
        'text-left backdrop-blur-sm',
        modeColors[mode],
        isSelected && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
      )}
    >
      <div className={cn('mb-3', modeTextColors[mode])}>
        {modeIcons[mode]}
      </div>
      <h3 className={cn('text-xl font-display tracking-wide mb-2', modeTextColors[mode])}>
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.button>
  );
};
