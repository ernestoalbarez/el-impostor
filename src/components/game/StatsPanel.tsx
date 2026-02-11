import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsRecord } from '@/types/game';
import { getAllStats, clearStats } from '@/engine/statsManager';
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-gradient-fire">Estadísticas</h2>
        <p className="text-sm text-muted-foreground">Historial de partidas</p>
      </div>

      {entries.length === 0 ? (
        <div className="card-mystery rounded-2xl p-8 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No hay estadísticas aún</p>
          <p className="text-xs text-muted-foreground mt-1">Jugá una partida para empezar</p>
        </div>
      ) : (
        <>
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
                  className="card-mystery rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="w-4 h-4 text-primary" />}
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{winRate}% victorias</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-secondary/30">
                      <p className="text-muted-foreground">Partidas</p>
                      <p className="text-lg font-display">{s.totalGames}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-civil/10">
                      <div className="flex items-center justify-center gap-1 text-civil">
                        <Shield className="w-3 h-3" />
                        <span>Civil</span>
                      </div>
                      <p className="text-lg font-display text-civil">{s.winsAsCivil}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-impostor/10">
                      <div className="flex items-center justify-center gap-1 text-impostor">
                        <Skull className="w-3 h-3" />
                        <span>Imp.</span>
                      </div>
                      <p className="text-lg font-display text-impostor">{s.winsAsImpostor}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-warning/10">
                      <div className="flex items-center justify-center gap-1 text-warning">
                        <Eye className="w-3 h-3" />
                        <span>Falso</span>
                      </div>
                      <p className="text-lg font-display text-warning">{s.winsAsFalseImpostor}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />Borrar estadísticas
          </Button>
        </>
      )}
    </div>
  );
};
