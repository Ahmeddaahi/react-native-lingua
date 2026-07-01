import { Language } from '@/types/learning';

export type LanguageWithMeta = Language & {
  learnerCount: string;
  /** flagcdn.com image URL — country code may differ from language id */
  flagImage: string;
  /** Language name in the target language itself (e.g., "Deutsch" for German) */
  nativeName: string;
};

// flagcdn.com serves high-quality flag PNGs at no cost, no auth required.
// Usage: https://flagcdn.com/w80/{country_code}.png
const flag = (cc: string) => `https://flagcdn.com/w80/${cc}.png`;

export const LANGUAGES: LanguageWithMeta[] = [
  {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flagUrl: '🇪🇸',
    flagImage: flag('es'),
    color: '#FFC107',
    learnerCount: '28.4M learners',
  },
  {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flagUrl: '🇫🇷',
    flagImage: flag('fr'),
    color: '#3B82F6',
    learnerCount: '19.4M learners',
  },
  {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flagUrl: '🇯🇵',
    flagImage: flag('jp'), // language: ja → country: jp
    color: '#EF4444',
    learnerCount: '12.7M learners',
  },
  {
    id: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flagUrl: '🇰🇷',
    flagImage: flag('kr'), // language: ko → country: kr
    color: '#1E3A8A',
    learnerCount: '9.3M learners',
  },
  {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flagUrl: '🇩🇪',
    flagImage: flag('de'),
    color: '#EF4444',
    learnerCount: '8.1M learners',
  },
  {
    id: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flagUrl: '🇨🇳',
    flagImage: flag('cn'), // language: zh → country: cn
    color: '#DC2626',
    learnerCount: '7.4M learners',
  },
];
