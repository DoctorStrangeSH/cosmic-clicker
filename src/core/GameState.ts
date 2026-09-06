import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GameState {
  resources: {
    crystals: number;
    energy: number;
    maxEnergy: number;
    darkMatter: number;
    starDust: number;
    quantumShards: number;
    alienArtifacts: number;
  };
  
  stats: {
    totalClicks: number;
    totalCrystals: number;
    totalBuildings: number;
    totalPrestiges: number;
    playTime: number;
    currentCombo: number;
    maxCombo: number;
  };
  
  multipliers: {
    clickMultiplier: number;
    productionMultiplier: number;
    critMultiplier: number;
    globalMultiplier: number;
    prestigeMultiplier: number;
  };
  
  buildings: Record<string, number>;
  upgrades: Record<string, boolean>;
  achievements: Record<string, boolean>;
  pets: Record<string, number>;
  ships: Record<string, number>;
  
  addCrystals: (amount: number) => void;
  spendCrystals: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  resetForPrestige: () => void;
}

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    resources: {
      crystals: 0,
      energy: 100,
      maxEnergy: 100,
      darkMatter: 0,
      starDust: 0,
      quantumShards: 0,
      alienArtifacts: 0,
    },
    
    stats: {
      totalClicks: 0,
      totalCrystals: 0,
      totalBuildings: 0,
      totalPrestiges: 0,
      playTime: 0,
      currentCombo: 0,
      maxCombo: 0,
    },
    
    multipliers: {
      clickMultiplier: 1,
      productionMultiplier: 1,
      critMultiplier: 5,
      globalMultiplier: 1,
      prestigeMultiplier: 1,
    },
    
    buildings: {},
    upgrades: {},
    achievements: {},
    pets: {},
    ships: {},
    
    addCrystals: (amount) => set((state) => {
      const bonus = amount * state.multipliers.globalMultiplier;
      state.resources.crystals += bonus;
      state.stats.totalCrystals += bonus;
    }),
    
    spendCrystals: (amount) => {
      const state = get();
      if (state.resources.crystals >= amount) {
        set((s) => {
          s.resources.crystals -= amount;
        });
        return true;
      }
      return false;
    },
    
    addEnergy: (amount) => set((state) => {
      state.resources.energy = Math.min(
        state.resources.energy + amount,
        state.resources.maxEnergy
      );
    }),
    
    spendEnergy: (amount) => {
      const state = get();
      if (state.resources.energy >= amount) {
        set((s) => {
          s.resources.energy -= amount;
        });
        return true;
      }
      return false;
    },
    
    resetForPrestige: () => set((state) => {
      const prestigeGain = Math.sqrt(
        state.resources.crystals / 1_000_000
      );
      
      state.resources.darkMatter += prestigeGain;
      state.resources.crystals = 0;
      state.buildings = {};
      state.upgrades = {};
      state.stats.totalPrestiges++;
      state.multipliers.prestigeMultiplier = 
        1 + (state.resources.darkMatter * 0.1);
    }),
  }))
);