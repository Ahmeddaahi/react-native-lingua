import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store adapter — works in Expo Go without a native build
const secureStorage: StateStorage = {
  getItem: async (name) => {
    return (await SecureStore.getItemAsync(name)) ?? null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

type LanguageStore = {
  selectedLanguageId: string | null;
  setSelectedLanguage: (id: string) => void;
  clearSelectedLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguage: (id) => set({ selectedLanguageId: id }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: 'lingua_language_store',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);

