import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { CraftRecipe, craftRecipes, craftResources } from '../config/craft/recipes';

interface ActiveCraft {
  recipeId: string;
  startTime: number;
  endTime: number;
}

export class CraftSystem {
  private recipes: CraftRecipe[] = [];
  private activeCrafts: ActiveCraft[] = [];
  private resources: Record<string, number> = {};
  
  constructor() {
    this.loadRecipes();
    this.initializeResources();
    this.initializeListeners();
    this.initializeCraftCheck();
  }
  
  private loadRecipes() {
    this.recipes = craftRecipes;
  }
  
  private initializeResources() {
    // Начальные ресурсы
    this.resources = {
      crystal_shard: 0,
      iron_ore: 0,
      copper_wire: 0,
      silver_plate: 0,
      gold_ingot: 0,
      plasma_core: 0,
      quantum_crystal: 0,
      dark_essence: 0,
      star_core: 0,
      universal_fragment: 0
    };
  }
  
  private initializeListeners() {
    eventBus.on('craft:start', (data) => {
      this.startCraft(data.recipeId);
    });
    
    eventBus.on('resource:collect', (data) => {
      this.collectResource(data.resourceId, data.amount);
    });
  }
  
  private initializeCraftCheck() {
    setInterval(() => {
      this.checkCrafts();
    }, 1000);
  }
  
  collectResource(resourceId: string, amount: number) {
    if (!this.resources[resourceId]) {
      this.resources[resourceId] = 0;
    }
    this.resources[resourceId] += amount;
    eventBus.emit('resource:collected', { resourceId, amount });
  }
  
  canCraft(recipe: CraftRecipe): boolean {
    return recipe.ingredients.every(ingredient => {
      return (this.resources[ingredient.resourceId] || 0) >= ingredient.amount;
    });
  }
  
  startCraft(recipeId: string): boolean {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return false;
    if (!this.canCraft(recipe)) return false;
    
    // Забираем ингредиенты
    recipe.ingredients.forEach(ingredient => {
      this.resources[ingredient.resourceId] -= ingredient.amount;
    });
    
    const now = Date.now();
    this.activeCrafts.push({
      recipeId,
      startTime: now,
      endTime: now + recipe.craftingTime * 1000
    });
    
    eventBus.emit('craft:started', recipe);
    return true;
  }
  
  private checkCrafts() {
    const now = Date.now();
    
    this.activeCrafts.forEach(craft => {
      if (now >= craft.endTime) {
        this.completeCraft(craft);
      }
    });
  }
  
  private completeCraft(craft: ActiveCraft) {
    const recipe = this.recipes.find(r => r.id === craft.recipeId);
    if (!recipe) return;
    
    // Применяем результат
    const state = useGameStore.getState();
    
    switch (recipe.result.type) {
      case 'clickBoost':
        state.multipliers.clickMultiplier *= recipe.result.value;
        setTimeout(() => {
          state.multipliers.clickMultiplier /= recipe.result.value;
        }, (recipe.result.duration || 0) * 1000);
        break;
      case 'productionBoost':
        state.multipliers.productionMultiplier *= recipe.result.value;
        setTimeout(() => {
          state.multipliers.productionMultiplier /= recipe.result.value;
        }, (recipe.result.duration || 0) * 1000);
        break;
      case 'maxEnergyBoost':
        state.resources.maxEnergy += recipe.result.value;
        break;
    }
    
    this.activeCrafts = this.activeCrafts.filter(c => c !== craft);
    eventBus.emit('craft:completed', recipe);
  }
  
  getActiveCrafts(): ActiveCraft[] {
    return this.activeCrafts;
  }
  
  getRecipes(): CraftRecipe[] {
    return this.recipes;
  }
  
  getResources(): Record<string, number> {
    return this.resources;
  }
}