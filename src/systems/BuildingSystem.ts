import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Building, tier1Buildings } from '../config/buildings/tier1';

export class BuildingSystem {
  private buildings: Building[] = [];
  
  constructor() {
    this.loadBuildings();
    this.initializeListeners();
  }
  
  private loadBuildings() {
    this.buildings = [...tier1Buildings];
  }
  
  private initializeListeners() {
    eventBus.on('building:purchase', (data) => {
      this.purchaseBuilding(data.buildingId);
    });
  }
  
  getBuildingCost(building: Building, currentCount: number): number {
    return Math.ceil(
      building.baseCost * Math.pow(building.costMultiplier, currentCount)
    );
  }
  
  getBuildingProduction(building: Building, count: number): number {
    const state = useGameStore.getState();
    let production = building.baseProduction * count;
    
    production *= state.multipliers.productionMultiplier;
    production *= state.multipliers.prestigeMultiplier;
    production *= state.multipliers.globalMultiplier;
    
    return production;
  }
  
  canPurchase(building: Building, count: number): boolean {
    const state = useGameStore.getState();
    const cost = this.getBuildingCost(building, count);
    
    if (building.maxCount && count >= building.maxCount) {
      return false;
    }
    
    return state.resources.crystals >= cost;
  }
  
  purchaseBuilding(buildingId: string): boolean {
    const state = useGameStore.getState();
    const building = this.buildings.find(b => b.id === buildingId);
    
    if (!building) return false;
    
    const currentCount = state.buildings[buildingId] || 0;
    if (!this.canPurchase(building, currentCount)) return false;
    
    const cost = this.getBuildingCost(building, currentCount);
    
    if (state.spendCrystals(cost)) {
      useGameStore.setState((s) => {
        s.buildings[buildingId] = currentCount + 1;
        s.stats.totalBuildings++;
      });
      
      eventBus.emit('building:purchased', { building, count: currentCount + 1 });
      return true;
    }
    
    return false;
  }
  
  getTotalProduction(): number {
    const state = useGameStore.getState();
    let total = 0;
    
    Object.entries(state.buildings).forEach(([buildingId, count]) => {
      const building = this.buildings.find(b => b.id === buildingId);
      if (building) {
        total += this.getBuildingProduction(building, count);
      }
    });
    
    return total;
  }
  
  getBuildings(): Building[] {
    return this.buildings;
  }
}