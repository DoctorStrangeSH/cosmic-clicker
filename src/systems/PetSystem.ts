import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Pet, commonPets } from '../config/pets/commonPets';
import { rarePets } from '../config/pets/rarePets';
import { epicPets } from '../config/pets/epicPets';
import { legendaryPets } from '../config/pets/legendaryPets';

export class PetSystem {
  private pets: Pet[] = [];
  
  constructor() {
    this.loadPets();
    this.initializeListeners();
  }
  
  private loadPets() {
    this.pets = [
      ...commonPets,
      ...rarePets,
      ...epicPets,
      ...legendaryPets
    ];
  }
  
  private initializeListeners() {
    eventBus.on('pet:purchase', (data) => {
      this.purchasePet(data.petId);
    });
    
    eventBus.on('pet:feed', (data) => {
      this.feedPet(data.petId, data.foodAmount);
    });
  }
  
  purchasePet(petId: string): boolean {
    const state = useGameStore.getState();
    const pet = this.pets.find(p => p.id === petId);
    
    if (!pet) return false;
    if (state.pets[petId]) return false; // Уже есть
    if (state.resources.crystals < pet.cost) return false;
    
    if (state.spendCrystals(pet.cost)) {
      useGameStore.setState((s) => {
        s.pets[petId] = 1; // Уровень 1
      });
      
      this.applyPetBonuses(pet, 1);
      eventBus.emit('pet:purchased', pet);
      return true;
    }
    
    return false;
  }
  
  feedPet(petId: string, foodAmount: number): boolean {
    const state = useGameStore.getState();
    const pet = this.pets.find(p => p.id === petId);
    
    if (!pet) return false;
    if (!state.pets[petId]) return false;
    
    const currentLevel = state.pets[petId];
    if (currentLevel >= pet.maxLevel) return false;
    
    const foodCost = foodAmount * 10; // 10 кристаллов за еду
    
    if (state.spendCrystals(foodCost)) {
      useGameStore.setState((s) => {
        s.pets[petId] = currentLevel + 1;
      });
      
      this.applyPetBonuses(pet, currentLevel + 1);
      eventBus.emit('pet:fed', { pet, level: currentLevel + 1 });
      return true;
    }
    
    return false;
  }
  
  private applyPetBonuses(pet: Pet, level: number) {
    const state = useGameStore.getState();
    const evolutionStage = this.getEvolutionStage(pet, level);
    const multiplier = evolutionStage.multiplier;
    
    pet.bonuses.forEach(bonus => {
      const bonusValue = bonus.value * multiplier * level;
      
      switch (bonus.type) {
        case 'click':
          state.multipliers.clickMultiplier += bonusValue;
          break;
        case 'production':
          state.multipliers.productionMultiplier += bonusValue;
          break;
        case 'energy':
          state.resources.maxEnergy += bonusValue * 100;
          break;
        case 'all':
          state.multipliers.globalMultiplier += bonusValue;
          break;
        case 'darkMatter':
          state.multipliers.prestigeMultiplier += bonusValue;
          break;
        case 'prestige':
          state.multipliers.prestigeMultiplier += bonusValue;
          break;
      }
    });
  }
  
  private getEvolutionStage(pet: Pet, level: number) {
    let currentStage = pet.evolutionStages[0];
    
    pet.evolutionStages.forEach(stage => {
      if (level >= stage.level) {
        currentStage = stage;
      }
    });
    
    return currentStage;
  }
  
  getAllPets(): Pet[] {
    return this.pets;
  }
  
  getOwnedPets(): Pet[] {
    const state = useGameStore.getState();
    return this.pets.filter(pet => state.pets[pet.id]);
  }
}