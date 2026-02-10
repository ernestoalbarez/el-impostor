import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Theme } from '@/types/game';
import { cn } from '@/lib/utils';
import { Plus, Book, Save, Trash2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ThemeManagerProps {
  themes: Theme[];
  selectedThemes: Theme[];
  onToggleTheme: (theme: Theme) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAddTheme: (theme: Theme) => void;
  onDeleteTheme: (themeId: string) => void;
}

export const ThemeManager = ({
  themes,
  selectedThemes,
  onToggleTheme,
  onSelectAll,
  onDeselectAll,
  onAddTheme,
  onDeleteTheme,
}: ThemeManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTheme, setNewTheme] = useState({
    nombre: '',
    palabra_principal: '',
    variaciones_civil: '',
    palabras_relacionadas: '',
  });

  const isSelected = (theme: Theme) => selectedThemes.some(t => t.id === theme.id);
  const allSelected = selectedThemes.length === themes.length;

  const handleAddTheme = () => {
    if (newTheme.nombre && newTheme.palabra_principal) {
      const theme: Theme = {
        id: `custom-${Date.now()}`,
        nombre: newTheme.nombre,
        palabra_principal: newTheme.palabra_principal,
        variaciones_civil: newTheme.variaciones_civil
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        palabras_relacionadas: newTheme.palabras_relacionadas
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      };
      
      if (theme.variaciones_civil.length === 0) {
        theme.variaciones_civil = [theme.palabra_principal];
      }
      
      onAddTheme(theme);
      setNewTheme({
        nombre: '',
        palabra_principal: '',
        variaciones_civil: '',
        palabras_relacionadas: '',
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Book className="w-5 h-5" />
          <span className="text-sm uppercase tracking-wider">Temáticas</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-xs"
          >
            {allSelected ? 'Ninguna' : 'Todas'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="card-mystery border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">Nueva temática</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nombre">Nombre de la temática</Label>
                  <Input
                    id="nombre"
                    value={newTheme.nombre}
                    onChange={(e) => setNewTheme({ ...newTheme, nombre: e.target.value })}
                    placeholder="Ej: Objetos de cocina"
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="palabra">Palabra principal</Label>
                  <Input
                    id="palabra"
                    value={newTheme.palabra_principal}
                    onChange={(e) => setNewTheme({ ...newTheme, palabra_principal: e.target.value })}
                    placeholder="Ej: cuchara"
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="variaciones">Variaciones para civiles (separadas por coma)</Label>
                  <Input
                    id="variaciones"
                    value={newTheme.variaciones_civil}
                    onChange={(e) => setNewTheme({ ...newTheme, variaciones_civil: e.target.value })}
                    placeholder="Ej: cuchara, cuchara sopera, cucharita"
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="relacionadas">Palabras para impostores (separadas por coma)</Label>
                  <Input
                    id="relacionadas"
                    value={newTheme.palabras_relacionadas}
                    onChange={(e) => setNewTheme({ ...newTheme, palabras_relacionadas: e.target.value })}
                    placeholder="Ej: tenedor, cuchillo, espátula"
                    className="bg-secondary/50"
                  />
                </div>
                <Button onClick={handleAddTheme} className="w-full btn-fire">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar temática
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedThemes.length} de {themes.length} seleccionadas
      </p>

      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => onToggleTheme(theme)}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                'bg-secondary/30 hover:bg-secondary/50',
                isSelected(theme)
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 hover:border-primary/50'
              )}
            >
              {isSelected(theme) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <p className="font-medium text-sm mb-1 pr-6">{theme.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {theme.palabras_relacionadas.length} palabras
              </p>
              {theme.id.startsWith('custom-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTheme(theme.id);
                  }}
                  className="absolute bottom-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
