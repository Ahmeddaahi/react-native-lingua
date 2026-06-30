import { Lesson } from '@/types/learning';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson_es_1_1',
    title: 'Hello, World!',
    description: 'Learn how to say hello and goodbye in Spanish.',
    unitId: 'unit_es_1',
    order: 1,
    goals: [
      { id: 'goal_es_1_1_1', description: 'Say hello and goodbye' },
      { id: 'goal_es_1_1_2', description: 'Introduce yourself' },
    ],
    activities: [
      {
        id: 'act_es_1_1_1',
        type: 'vocabulary',
        prompt: 'What does "Hola" mean?',
        vocabulary: {
          id: 'vocab_es_hola',
          word: 'Hola',
          translation: 'Hello',
        },
        options: ['Hello', 'Goodbye', 'Please', 'Thank you'],
        correctAnswer: 'Hello',
      },
      {
        id: 'act_es_1_1_2',
        type: 'phrase',
        prompt: 'Translate this phrase',
        phrase: {
          id: 'phrase_es_buenos_dias',
          phrase: 'Buenos días',
          translation: 'Good morning',
        },
        options: ['Good morning', 'Good night', 'Hello', 'Goodbye'],
        correctAnswer: 'Good morning',
      },
      {
        id: 'act_es_1_1_3',
        type: 'video_teacher',
        aiTeacherPrompt:
          'You are a friendly Spanish teacher. Introduce yourself and teach the user how to say "Hola" (Hello) and "Adiós" (Goodbye). Keep it brief, energetic, and encouraging.',
      },
    ],
  },
  {
    id: 'lesson_es_1_2',
    title: 'How are you?',
    description: 'Learn to ask and answer "How are you?".',
    unitId: 'unit_es_1',
    order: 2,
    goals: [
      { id: 'goal_es_1_2_1', description: 'Ask how someone is doing' },
      { id: 'goal_es_1_2_2', description: 'Reply to how you are doing' },
    ],
    activities: [
      {
        id: 'act_es_1_2_1',
        type: 'vocabulary',
        prompt: 'Translate "How are you?"',
        vocabulary: {
          id: 'vocab_es_como_estas',
          word: '¿Cómo estás?',
          translation: 'How are you?',
        },
        options: [
          '¿Cómo estás?',
          '¿Qué tal?',
          '¿Cómo te llamas?',
          '¿De dónde eres?',
        ],
        correctAnswer: '¿Cómo estás?',
      },
      {
        id: 'act_es_1_2_2',
        type: 'chat_tutor',
        aiTeacherPrompt:
          'You are a Spanish conversation tutor. Start a simple text chat with the user asking them how they are doing in Spanish ("¿Cómo estás?"). Correct their response gently if needed and keep the conversation going for 2-3 turns.',
      },
    ],
  },
  {
    id: 'lesson_fr_1_1',
    title: 'Bonjour!',
    description: 'Learn basic greetings in French.',
    unitId: 'unit_fr_1',
    order: 1,
    goals: [
      { id: 'goal_fr_1_1_1', description: 'Say hello in French' },
    ],
    activities: [
      {
        id: 'act_fr_1_1_1',
        type: 'vocabulary',
        prompt: 'Translate "Bonjour"',
        vocabulary: {
          id: 'vocab_fr_bonjour',
          word: 'Bonjour',
          translation: 'Hello',
        },
        options: ['Hello', 'Goodbye', 'Yes', 'No'],
        correctAnswer: 'Hello',
      },
      {
        id: 'act_fr_1_1_2',
        type: 'video_teacher',
        aiTeacherPrompt:
          'You are a French teacher. Teach the user the difference between "Bonjour" (Good morning/Hello) and "Bonsoir" (Good evening).',
      },
    ],
  },
];
