import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProgressStore = {
  xp: number;
  dailyGoalXp: number;
  streakDays: number;
  completedLessonIds: string[];
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      xp: 15,
      dailyGoalXp: 20,
      streakDays: 12,
      completedLessonIds: ['lesson_es_1_1'], // First lesson completed as a demo
      addXp: (amount) => set((state) => ({ xp: Math.min(state.xp + amount, state.dailyGoalXp) })),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
    }),
    {
      name: 'lingua_progress_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
