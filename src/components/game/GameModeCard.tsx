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
  classic: <Shuffle className="w-7 h-7" />,
  chaos: <Zap className="w-7 h-7" />,
  extreme: <Flame className="w-7 h-7" />,
};

const modeStyles: Record<GameMode, { border: string; icon: string; glow: string }> = {
  classic: {
    border: 'border-primary/20 hover:border-primary/50',
    icon: 'text-primary bg-primary/10',
    glow: 'hover:shadow-[0_0_30px_hsl(25_95%_58%_/_0.15)]',
  },
  chaos: {
    border: 'border-accent/20 hover:border-accent/50',
    icon: 'text-accent bg-accent/10',
    glow: 'hover:shadow-[0_0_30px_hsl(175_65%_48%_/_0.15)]',
  },
  extreme: {
    border: 'border-impostor/20 hover:border-impostor/50',
    icon: 'text-impostor bg-impostor/10',
    glow: 'hover:shadow-[0_0_30px_hsl(0_72%_52%_/_0.15)]',
  },
};

const modeTextColors: Record<GameMode, string> = {
  classic: 'text-primary',
  chaos: 'text-accent',
  extreme: 'text-impostor',
};

export const GameModeCard = ({ mode, title, description, onClick, isSelected }: GameModeCardProps) => {
  const style = modeStyles[mode];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full p-5 rounded-2xl border bg-secondary/20 backdrop-blur-sm transition-all duration-300',
        'text-left group',
        style.border,
        style.glow,
        isSelected && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl transition-colors', style.icon)}>
          {modeIcons[mode]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn('text-lg font-display font-extrabold tracking-wide mb-1', modeTextColors[mode])}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};
