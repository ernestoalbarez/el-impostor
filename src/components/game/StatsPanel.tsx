import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsRecord } from '@/types/game';
import { getAllStats, clearStats } from '@/engine/statsManager';
import { BackgroundEffects } from './BackgroundEffects';
import { Button } from '@/components/ui/button';
import { BarChart3, Trash2, Trophy, Shield, Skull, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StatsPanel = () => {
  const [stats, setStats] = useState<StatsRecord>({});

  useEffect(() => {
    setStats(getAllStats());
  }, []);

  const entries = Object.entries(stats).sort((a, b) => b[1].totalGames - a[1].totalGames);

  const handleClear = () => {
    clearStats();
    setStats({});
  };

  return (
    <div className="space-y-6 relative z-10">
      <BackgroundEffects />
      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-3xl font-display font-extrabold text-gradient-fire">Estadísticas</h2>
        <p className="text-sm text-muted-foreground">Historial de partidas</p>
      </div>

      {entries.length === 0 ? (
        <div className="card-glass rounded-2xl p-10 text-center relative z-10">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">No hay estadísticas aún</p>
          <p className="text-xs text-muted-foreground mt-1">Jugá una partida para empezar</p>
        </div>
      ) : (
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            {entries.map(([name, s], i) => {
              const totalWins = s.winsAsCivil + s.winsAsImpostor + s.winsAsFalseImpostor;
              const winRate = s.totalGames > 0 ? Math.round((totalWins / s.totalGames) * 100) : 0;
              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-glass rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="w-4 h-4 text-primary" />}
                      <span className="font-semibold text-sm">{name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{winRate}% victorias</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-secondary/30">
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Partidas</p>
                      <p className="text-lg font-display font-bold">{s.totalGames}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-civil/10">
                      <div className="flex items-center justify-center gap-1 text-civil">
                        <Shield className="w-3 h-3" />
                        <span className="text-[10px]">Civil</span>
                      </div>
                      <p className="text-lg font-display font-bold text-civil">{s.winsAsCivil}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-impostor/10">
                      <div className="flex items-center justify-center gap-1 text-impostor">
                        <Skull className="w-3 h-3" />
                        <span className="text-[10px]">Imp.</span>
                      </div>
                      <p className="text-lg font-display font-bold text-impostor">{s.winsAsImpostor}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-warning/10">
                      <div className="flex items-center justify-center gap-1 text-warning">
                        <Eye className="w-3 h-3" />
                        <span className="text-[10px]">Falso</span>
                      </div>
                      <p className="text-lg font-display font-bold text-warning">{s.winsAsFalseImpostor}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />Borrar estadísticas
          </Button>
        </div>
      )}
    </div>
  );
};
