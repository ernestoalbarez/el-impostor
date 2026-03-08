import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Coffee, Coins, Copy, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BackgroundEffects } from '@/components/game/BackgroundEffects';
import { supportConfig } from '@/config/supportConfig';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/context/LanguageContext';

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

  const getChainId = () => {
    if (network.toLowerCase().includes('polygon')) return 137;
    if (network.toLowerCase().includes('ethereum')) return 1;
    return 1;
  };

  const getTokenContract = () => {
    const token = label.toUpperCase();
    if (network.toLowerCase().includes('ethereum')) {
      if (token === 'USDC') return '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      if (token === 'USDT') return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    }
    if (network.toLowerCase().includes('polygon')) {
      if (token === 'USDC') return '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
      if (token === 'USDT') return '0xc2132D05D31c914a87C6611C10748AaCb9e1aFaE';
    }
    return null;
  };

  const chainId = getChainId();
  const tokenContract = getTokenContract();
  const qrValue = tokenContract
    ? `ethereum:${tokenContract}@${chainId}/transfer?address=${address}`
    : `ethereum:${address}`;

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
      <div className="w-full flex items-center justify-center bg-white p-3 rounded-lg">
        <QRCodeSVG value={qrValue} size={140} bgColor="#ffffff" fgColor="#000000" level="M" />
      </div>
    </div>
  );
};

const SupportPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen px-4 py-8 relative z-10">
      <BackgroundEffects />
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-2 hover:bg-secondary/50">
          <ArrowLeft className="w-4 h-4 mr-2" />{t('back')}
        </Button>

        <motion.div {...pageTransition} className="text-center space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-gradient-fire">{t('support_title')}</h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">{t('support_subtitle')}</p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.1 }} className="card-glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-display font-bold text-foreground">{t('support_why_title')}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('support_why_desc')}
          </p>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.15 }} className="card-glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Coffee className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-bold text-foreground">{t('support_coffee_title')}</h2>
          </div>
          <a href={supportConfig.mercadoPago.url} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full btn-fire rounded-xl h-12 text-base">
              <Coffee className="w-5 h-5 mr-2" />
              {supportConfig.mercadoPago.label}
            </Button>
          </a>
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.2 }} className="card-glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-display font-bold text-foreground">{t('support_crypto_title')}</h2>
          </div>
          {Object.entries(supportConfig.crypto).map(([networkKey, network]) => (
            <div key={networkKey} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">{network.label}</h3>
              {Object.entries(network.tokens).map(([tokenKey, token]) => (
                <CryptoAddress
                  key={`${networkKey}-${tokenKey}`}
                  label={tokenKey.toUpperCase()}
                  network={token.network}
                  address={token.address}
                />
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div {...pageTransition} transition={{ delay: 0.25 }} className="text-center py-4">
          <p className="text-xs text-muted-foreground">{t('support_thanks')}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
