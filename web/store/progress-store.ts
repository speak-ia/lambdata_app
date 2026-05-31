import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContributionModule } from "@/types";

export type DailyCounts = Record<ContributionModule, number>;

interface ProgressState {
  date: string;
  daily: DailyCounts;
  increment: (module: ContributionModule) => void;
  getTodayCounts: () => DailyCounts;
}

const emptyDaily = (): DailyCounts => ({
  audio: 0,
  translation: 0,
  image: 0,
  video: 0,
  validation: 0,
  text: 0,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      date: todayISO(),
      daily: emptyDaily(),
      getTodayCounts: () => {
        const state = get();
        if (state.date !== todayISO()) {
          return emptyDaily();
        }
        return state.daily;
      },
      increment: (module) =>
        set((state) => {
          const today = todayISO();
          const daily =
            state.date === today ? { ...state.daily } : emptyDaily();
          daily[module] = (daily[module] ?? 0) + 1;
          return { date: today, daily };
        }),
    }),
    { name: "lambdata-progress" },
  ),
);
