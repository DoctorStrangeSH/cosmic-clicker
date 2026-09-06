import { useGameStore } from './GameState';

export class SaveSystem {
  private readonly SAVE_KEY = 'cosmic_clicker_save';
  private readonly AUTO_SAVE_INTERVAL = 30000;
  
  constructor() {
    this.initializeAutoSave();
  }
  
  save() {
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
    
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      console.log('Game saved');
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
      
      console.log('Game loaded');
      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  }
  
  reset() {
    localStorage.removeItem(this.SAVE_KEY);
    window.location.reload();
  }
  
  private initializeAutoSave() {
    setInterval(() => {
      this.save();
    }, this.AUTO_SAVE_INTERVAL);
    
    window.addEventListener('beforeunload', () => {
      this.save();
    });
  }
}