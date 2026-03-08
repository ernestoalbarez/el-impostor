import { useLanguage } from '@/context/LanguageContext';
import { Language, languageLabels } from '@/i18n/translations';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const flagEmojis: Record<Language, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  de: '🇩🇪',
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/50">
          <Globe className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="card-glass border-border/40 rounded-xl min-w-[140px]">
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={cn(
              'rounded-lg cursor-pointer',
              language === lang && 'bg-primary/10 text-primary font-semibold'
            )}
          >
            <span className="mr-2">{flagEmojis[lang]}</span>
            {languageLabels[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
