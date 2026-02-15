import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types/game';
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
  categories: Category[];
  selectedCategories: Category[];
  onToggleCategory: (cat: Category) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAddCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
}

export const ThemeManager = ({
  categories,
  selectedCategories,
  onToggleCategory,
  onSelectAll,
  onDeselectAll,
  onAddCategory,
  onDeleteCategory,
}: ThemeManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCat, setNewCat] = useState({ nombre: '', principal: '', pista: '', secundarias: '' });

  const isSelected = (cat: Category) => selectedCategories.some(c => c.id === cat.id);
  const allSelected = selectedCategories.length === categories.length;

  const handleAdd = () => {
    if (newCat.nombre && newCat.principal && newCat.pista) {
      const cat: Category = {
        id: `custom-${Date.now()}`,
        nombre: newCat.nombre,
        palabras: [{
          principal: newCat.principal,
          pista_principal: newCat.pista,
          pistas_secundarias: newCat.secundarias.split(',').map(s => s.trim()).filter(Boolean),
        }],
      };
      onAddCategory(cat);
      setNewCat({ nombre: '', principal: '', pista: '', secundarias: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Book className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-medium">Categorías</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={allSelected ? onDeselectAll : onSelectAll} className="text-xs hover:bg-secondary/50 rounded-lg">
            {allSelected ? 'Ninguna' : 'Todas'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-secondary/50 rounded-lg"><Plus className="w-4 h-4 mr-1" />Nueva</Button>
            </DialogTrigger>
            <DialogContent className="card-glass border-border/30 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-extrabold">Nueva categoría</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="nombre" className="text-xs text-muted-foreground uppercase tracking-wider">Nombre</Label>
                  <Input id="nombre" value={newCat.nombre} onChange={e => setNewCat({ ...newCat, nombre: e.target.value })} placeholder="Ej: Países" className="bg-secondary/30 border-border/30 rounded-xl mt-1" />
                </div>
                <div>
                  <Label htmlFor="principal" className="text-xs text-muted-foreground uppercase tracking-wider">Palabra principal</Label>
                  <Input id="principal" value={newCat.principal} onChange={e => setNewCat({ ...newCat, principal: e.target.value })} placeholder="Ej: Argentina" className="bg-secondary/30 border-border/30 rounded-xl mt-1" />
                </div>
                <div>
                  <Label htmlFor="pista" className="text-xs text-muted-foreground uppercase tracking-wider">Pista principal</Label>
                  <Input id="pista" value={newCat.pista} onChange={e => setNewCat({ ...newCat, pista: e.target.value })} placeholder="Ej: tango" className="bg-secondary/30 border-border/30 rounded-xl mt-1" />
                </div>
                <div>
                  <Label htmlFor="secundarias" className="text-xs text-muted-foreground uppercase tracking-wider">Pistas secundarias (separadas por coma)</Label>
                  <Input id="secundarias" value={newCat.secundarias} onChange={e => setNewCat({ ...newCat, secundarias: e.target.value })} placeholder="Ej: mate, asado, fútbol" className="bg-secondary/30 border-border/30 rounded-xl mt-1" />
                </div>
                <Button onClick={handleAdd} className="w-full btn-fire rounded-xl h-11">
                  <Save className="w-4 h-4 mr-2" />Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedCategories.length} de {categories.length} seleccionadas
      </p>

      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleCategory(cat)}
              className={cn(
                'relative p-4 rounded-xl border text-left transition-all duration-200',
                'bg-secondary/20 hover:bg-secondary/40 backdrop-blur-sm',
                isSelected(cat) ? 'border-primary/50 bg-primary/10' : 'border-border/30 hover:border-primary/30'
              )}
            >
              {isSelected(cat) && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <p className="font-semibold text-sm mb-1 pr-6">{cat.nombre}</p>
              <p className="text-[11px] text-muted-foreground">{cat.palabras.length} palabras</p>
              {cat.id.startsWith('custom-') && (
                <button
                  onClick={e => { e.stopPropagation(); onDeleteCategory(cat.id); }}
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
