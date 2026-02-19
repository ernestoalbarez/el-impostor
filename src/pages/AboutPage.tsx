import { motion } from 'framer-motion';
import { ArrowLeft, Code2, MessageCircle, Search, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackgroundEffects } from '@/components/game/BackgroundEffects';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 relative z-10">
      <BackgroundEffects />
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-2 hover:bg-secondary/50">
          <ArrowLeft className="w-4 h-4 mr-2" />Volver
        </Button>

        <motion.div {...pageTransition} className="text-center space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-gradient-fire">Acerca del proyecto</h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">El Impostor</p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.1 }} className="card-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-bold text-foreground">¿Qué es El Impostor?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El Impostor es un juego social de deducción diseñado para jugar en persona con amigos.
            Un grupo de jugadores recibe una palabra secreta, pero entre ellos se esconden impostores
            que no la conocen. A través de la conversación, la observación y la estrategia, el grupo
            debe identificar quién miente… antes de que sea demasiado tarde.
          </p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.15 }} className="card-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-bold text-foreground">Filosofía de diseño</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <li>🎭 <strong className="text-foreground">Incertidumbre:</strong> El caos es intencional. Nunca sabés con certeza quién es quién.</li>
            <li>💬 <strong className="text-foreground">Conversación:</strong> El juego sucede entre las personas, no en la pantalla.</li>
            <li>🧠 <strong className="text-foreground">Deducción social:</strong> Observar, preguntar y analizar son las herramientas del jugador.</li>
          </ul>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.25 }} className="card-glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-bold text-foreground">Proyecto independiente</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Este proyecto es completamente independiente. No contiene publicidad, no recopila datos
            personales y no tiene fines comerciales. Fue creado por pasión al diseño de juegos y la
            programación.
          </p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.3 }} className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Hecho con 🔥 por <span className="text-foreground font-semibold">Ernesto Albarez</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
