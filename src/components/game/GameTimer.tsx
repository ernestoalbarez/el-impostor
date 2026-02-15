import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Timer, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameTimerProps {
  initialTime: number;
  onTimeUp: () => void;
  onTimeUpdate: (time: number) => void;
  isPaused?: boolean;
}

export const GameTimer = ({ 
  initialTime, 
  onTimeUp, 
  onTimeUpdate,
  isPaused: externalPaused 
}: GameTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(externalPaused ?? false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        const newTime = prev - 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, onTimeUpdate]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (timeRemaining / initialTime) * 100;
  const isLowTime = timeRemaining <= 60;
  const isCriticalTime = timeRemaining <= 30;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className={cn(
            'w-5 h-5 transition-colors',
            isCriticalTime ? 'text-impostor animate-pulse' : 
            isLowTime ? 'text-warning' : 'text-muted-foreground'
          )} />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Tiempo restante
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className="h-9 w-9 rounded-xl hover:bg-secondary/50"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
      </div>

      <motion.div
        className={cn(
          'text-6xl md:text-7xl font-display font-extrabold text-center tabular-nums tracking-tight',
          isCriticalTime ? 'text-impostor' : 
          isLowTime ? 'text-warning' : 'text-foreground'
        )}
        animate={isCriticalTime ? { scale: [1, 1.04, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </motion.div>

      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isCriticalTime ? 'bg-impostor' : 
            isLowTime ? 'bg-warning' : 'bg-primary'
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {isPaused && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-muted-foreground uppercase tracking-widest"
        >
          Partida pausada
        </motion.p>
      )}
    </div>
  );
};
