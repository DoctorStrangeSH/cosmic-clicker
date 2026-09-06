import { useGameStore } from './GameState';

export class SaveSystem {
  private readonly SAVE_KEY = 'cosmic_clicker_save';
  private readonly OFFLINE_KEY = 'cosmic_clicker_offline';
  
  constructor() {
    this.initializeAutoSave();
  }
  
  save() {
    try {
      const state = useGameStore.getState();
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        data: {
          resources: state.resources,
          stats: state.stats,
          multipliers: state.multipliers,
          buildings: state.buildings,
          upgrades: state.upgrades,
          achievements: state.achievements,
          pets: state.pets,
          ships: state.ships,
        }
      };
      
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      
      // Сохраняем время последнего выхода
      localStorage.setItem(this.OFFLINE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }
  
  load(): boolean {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (!saveData) return false;
      
      const parsed = JSON.parse(saveData);
      
      useGameStore.setState((state) => {
        state.resources = parsed.data.resources;
        state.stats = parsed.data.stats;
        state.multipliers = parsed.data.multipliers;
        state.buildings = parsed.data.buildings;
        state.upgrades = parsed.data.upgrades;
        state.achievements = parsed.data.achievements;
        state.pets = parsed.data.pets;
        state.ships = parsed.data.ships;
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  }
  
  // Новый метод: расчёт оффлайн-заработка
  calculateOfflineEarnings(): { seconds: number; crystals: number } {
    try {
      const lastSaveTime = localStorage.getItem(this.OFFLINE_KEY);
      if (!lastSaveTime) return { seconds: 0, crystals: 0 };
      
      const now = Date.now();
      const lastTime = parseInt(lastSaveTime);
      const secondsPassed = Math.floor((now - lastTime) / 1000);
      
      // Максимум 24 часа оффлайн-заработка
      const maxSeconds = 24 * 60 * 60;
      const effectiveSeconds = Math.min(secondsPassed, maxSeconds);
      
      if (effectiveSeconds <= 0) return { seconds: 0, crystals: 0 };
      
      // Получаем производство из сохранённых данных
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (!saveData) return { seconds: 0, crystals: 0 };
      
      const parsed = JSON.parse(saveData);
      const buildings = parsed.data.buildings;
      
      // Считаем производство
      let productionPerSecond = 0;
      
      // Базовые здания
      const buildingProduction: Record<string, number> = {
        'hand_drill': 0.1,
        'crystal_garden': 2,
        'drone_scout': 1,
        'solar_panel': 5,
        'mini_robot': 7,
        'energy_condenser': 9,
      };
      
      Object.entries(buildings).forEach(([buildingId, count]) => {
        const baseProduction = buildingProduction[buildingId] || 0;
        productionPerSecond += baseProduction * (count as number);
      });
      
      // Применяем множители
      const multipliers = parsed.data.multipliers;
      productionPerSecond *= multipliers.productionMultiplier || 1;
      productionPerSecond *= multipliers.prestigeMultiplier || 1;
      productionPerSecond *= multipliers.globalMultiplier || 1;
      
      // 50% эффективность оффлайна
      productionPerSecond *= 0.5;
      
      const totalCrystals = productionPerSecond * effectiveSeconds;
      
      return {
        seconds: effectiveSeconds,
        crystals: Math.floor(totalCrystals)
      };
    } catch (error) {
      console.error('Failed to calculate offline earnings:', error);
      return { seconds: 0, crystals: 0 };
    }
  }
  
  // Применить оффлайн-заработок
  applyOfflineEarnings(): { seconds: number; crystals: number } {
    const earnings = this.calculateOfflineEarnings();
    
    if (earnings.crystals > 0) {
      useGameStore.getState().addCrystals(earnings.crystals);
    }
    
    // Обновляем время
    localStorage.setItem(this.OFFLINE_KEY, Date.now().toString());
    
    return earnings;
  }
  
  reset() {
    localStorage.removeItem(this.SAVE_KEY);
    localStorage.removeItem(this.OFFLINE_KEY);
    window.location.reload();
  }
  
  private initializeAutoSave() {
    // Сохраняем каждые 5 секунд
    setInterval(() => {
      this.save();
    }, 5000);
    
    // Сохраняем при закрытии
    window.addEventListener('beforeunload', () => {
      this.save();
    });
    
    // Сохраняем при скрытии вкладки
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.save();
      }
    });
  }
}