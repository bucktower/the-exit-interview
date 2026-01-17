import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "ready" | "playing" | "ended";
export type GameResult = "win" | "lose" | null;

interface GameState {
  phase: GamePhase;
  result: GameResult;
  difficulty: number;
  level: number;
  
  // Actions
  start: () => void;
  restart: () => void;
  end: (result: Exclude<GameResult, null>) => void;
  advanceLevel: () => void;
  resetLevel: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    phase: "ready",
    result: null,
    difficulty: 0,
    level: 0,
    
    start: () => {
      set((state) => {
        // Only transition from ready to playing
        if (state.phase === "ready") {
          return { phase: "playing", result: null };
        }
        return {};
      });
    },
    
    restart: () => {
      set(() => ({ phase: "ready", result: null, level: 0 }));
    },
    
    end: (result) => {
      set((state) => {
        // Only transition from playing to ended
        if (state.phase === "playing") {
          return { phase: "ended", result };
        }
        return {};
      });
    },

    advanceLevel: () => {
      set((state) => {
        const nextLevel = Math.min(state.level + 1, 8);
        const nextDifficulty = Math.min(state.difficulty + 1, 8);
        return { level: nextLevel, difficulty: nextDifficulty };
      });
    },

    resetLevel: () => {
      set(() => ({ level: 0 }));
    },
  }))
);
