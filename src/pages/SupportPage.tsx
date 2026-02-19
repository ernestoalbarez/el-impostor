import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Coffee, Bitcoin, Copy, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BackgroundEffects } from '@/components/game/BackgroundEffects';
import { supportConfig } from '@/config/supportConfig';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const CryptoAddress = ({ label, network, address }: { label: string; network: string; address: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
          {network}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-secondary/60 text-muted-foreground px-3 py-2 rounded-lg flex-1 overflow-hidden text-ellipsis border border-border/30">
          {address}
        </code>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0 h-9 w-9">
          {copied ? <CheckCheck className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      {/* Espacio reservado para QR */}
      <div className="w-full h-24 rounded-lg border border-dashed border-border/40 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">QR próximamente</span>
      </div>
    </div>
  );
};

const SupportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 relative z-10">
      <BackgroundEffects />
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-2 hover:bg-secondary/50">
          <ArrowLeft className="w-4 h-4 mr-2" />Volver
        </Button>

        <motion.div {...pageTransition} className="text-center space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-gradient-fire">Apoyar el proyecto</h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">Cada aporte cuenta</p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.1 }} className="card-glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-display font-bold text-foreground">¿Por qué apoyar?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            El Impostor se mantiene <strong className="text-foreground">sin publicidad</strong> y sin funciones bloqueadas.
            Las contribuciones voluntarias ayudan a cubrir los costos de hosting, dominio y mantenimiento.
            Es completamente opcional — si disfrutás el juego, tu apoyo nos ayuda a seguir mejorándolo.
          </p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.15 }} className="card-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Coffee className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-bold text-foreground">MercadoPago</h2>
          </div>
          <a
            href={supportConfig.mercadoPago.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full btn-fire rounded-xl h-12 text-base">
              <Coffee className="w-5 h-5 mr-2" />
              {supportConfig.mercadoPago.label}
            </Button>
          </a>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.2 }} className="card-glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Bitcoin className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-display font-bold text-foreground">Criptomonedas</h2>
          </div>
          <CryptoAddress
            label="USDT"
            network={supportConfig.crypto.usdt.network}
            address={supportConfig.crypto.usdt.address}
          />
          <CryptoAddress
            label="BTC"
            network={supportConfig.crypto.btc.network}
            address={supportConfig.crypto.btc.address}
          />
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.25 }} className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Gracias por ser parte de esto 🔥
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
