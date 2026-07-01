import { Unit } from '@/types/learning';

export const UNITS: Unit[] = [
  {
    id: 'unit_es_1',
    title: 'Unit 1',
    description: 'Learn basic greetings and introductions in Spanish.',
    languageId: 'es',
    lessons: ['lesson_es_1_1', 'lesson_es_1_2'],
    order: 1,
  },
  {
    id: 'unit_fr_1',
    title: 'Unit 1',
    description: 'Start your French journey with essential phrases.',
    languageId: 'fr',
    lessons: ['lesson_fr_1_1'],
    order: 1,
  },
];
