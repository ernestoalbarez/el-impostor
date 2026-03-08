import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupportPrompt } from '@/hooks/useSupportPrompt';
import { useLanguage } from '@/context/LanguageContext';

export const SupportPrompt = () => {
    const { t } = useLanguage();
    const { shouldShow, handleSupport, handleLater, handleNeverShowAgain } = useSupportPrompt();

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="w-full"
                >
                    <div className="card-glass border-2 border-primary/20 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                    <Heart className="w-6 h-6 text-primary animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-display font-bold text-lg">{t('like_the_game')}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t('support_desc')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    onClick={handleSupport}
                                    className="w-full btn-fire rounded-xl h-11"
                                >
                                    {t('support_project')}
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={handleLater}
                                        className="flex-1 rounded-xl h-10 hover:bg-secondary/50 text-sm"
                                    >
                                        {t('later')}
                                    </Button>
                                    <button
                                        onClick={handleNeverShowAgain}
                                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 px-2"
                                    >
                                        {t('never_show')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
