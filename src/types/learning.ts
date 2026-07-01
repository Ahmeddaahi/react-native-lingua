export type Language = {
  id: string;
  name: string;
  flagUrl?: string; // Optional: can be an emoji or asset path later
  color?: string; // Hex color for the language card
};

export type ActivityType =
  | 'vocabulary'
  | 'phrase'
  | 'audio'
  | 'video_teacher'
  | 'chat_tutor';

export type Vocabulary = {
  id: string;
  word: string;
  translation: string;
  audioUrl?: string;
};

export type Phrase = {
  id: string;
  phrase: string;
  translation: string;
  audioUrl?: string;
};

export type Activity = {
  id: string;
  type: ActivityType;
  prompt?: string; // General instruction for the activity (e.g., "Translate this sentence")
  vocabulary?: Vocabulary;
  phrase?: Phrase;
  aiTeacherPrompt?: string; // Prompt specifically for the Vision Agent video teacher
  options?: string[]; // Multiple choice options, if applicable
  correctAnswer?: string;
};

export type LessonGoal = {
  id: string;
  description: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  unitId: string;
  goals: LessonGoal[];
  activities: Activity[];
  order: number;
};

export type Unit = {
  id: string;
  title: string;
  description: string;
  languageId: string;
  lessons: string[]; // Array of Lesson IDs
  order: number;
};
