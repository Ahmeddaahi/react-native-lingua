import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import {
    createJSONStorage,
    persist,
    type StateStorage,
} from "zustand/middleware";

const secureStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === "web") {
      return (await AsyncStorage.getItem(name)) ?? null;
    }

    return (await SecureStore.getItemAsync(name)) ?? null;
  },
  setItem: async (name, value) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(name, value);
      return;
    }

    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(name);
      return;
    }

    await SecureStore.deleteItemAsync(name);
  },
};

type LanguageStore = {
  selectedLanguageId: string | null;
  isHydrated: boolean;
  setSelectedLanguage: (id: string) => void;
  clearSelectedLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      isHydrated: false,
      setSelectedLanguage: (id) => set({ selectedLanguageId: id }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: "lingua_language_store",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    },
  ),
);
