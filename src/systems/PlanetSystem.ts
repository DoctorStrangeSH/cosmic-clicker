import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Planet } from '../config/planets/CrystallisX9';
import { CrystallisX9 } from '../config/planets/CrystallisX9';

export class PlanetSystem {
  private planets: Planet[] = [];
  private currentPlanet: Planet | null = null;
  
  constructor() {
    this.loadPlanets();
    this.initializeListeners();
  }
  
  private loadPlanets() {
    this.planets = [CrystallisX9];
    
    // Устанавливаем стартовую планету
    this.currentPlanet = this.planets.find(p => p.unlockCost === 0) || null;
  }
  
  private initializeListeners() {
    eventBus.on('planet:change', (data) => {
      this.changePlanet(data.planetId);
    });
    
    eventBus.on('planet:colonize', (data) => {
      this.colonizePlanet(data.planetId);
    });
  }
  
  changePlanet(planetId: string): boolean {
    const planet = this.planets.find(p => p.id === planetId);
    if (!planet) return false;
    
    const state = useGameStore.getState();
    if (state.resources.crystals < planet.unlockCost) return false;
    
    this.currentPlanet = planet;
    eventBus.emit('planet:changed', planet);
    return true;
  }
  
  colonizePlanet(planetId: string): boolean {
    const planet = this.planets.find(p => p.id === planetId);
    if (!planet) return false;
    
    const state = useGameStore.getState();
    const colonizationCost = planet.unlockCost;
    
    if (!state.spendCrystals(colonizationCost)) return false;
    
    eventBus.emit('planet:colonized', planet);
    return true;
  }
  
  getCurrentPlanet(): Planet | null {
    return this.currentPlanet;
  }
  
  getPlanetEvolution(planet: Planet): number {
    const state = useGameStore.getState();
    let evolutionLevel = 0;
    
    planet.evolutionLevels.forEach((level, index) => {
      if (state.resources.crystals >= level.crystals) {
        evolutionLevel = index;
      }
    });
    
    return evolutionLevel;
  }
  
  getPlanetMultiplier(planet: Planet): number {
    const state = useGameStore.getState();
    const evolutionLevel = this.getPlanetEvolution(planet);
    
    return planet.productionMultiplier * (1 + evolutionLevel * 0.25);
  }
}