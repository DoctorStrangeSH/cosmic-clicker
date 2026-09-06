import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Upgrade, clickUpgrades } from '../config/upgrades/clickUpgrades';
import { critUpgrades } from '../config/upgrades/critUpgrades';
import { productionUpgrades } from '../config/upgrades/productionUpgrades';
import { autoUpgrades } from '../config/upgrades/autoUpgrades';

export class UpgradeSystem {
  private upgrades: Upgrade[] = [];
  private autoClickInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    this.loadUpgrades();
    this.initializeListeners();
    this.initializeAutoClickers();
  }
  
  private loadUpgrades() {
    this.upgrades = [
      ...clickUpgrades,
      ...critUpgrades,
      ...productionUpgrades,
      ...autoUpgrades
    ];
  }
  
  private initializeListeners() {
    eventBus.on('upgrade:purchase', (data) => {
      this.purchaseUpgrade(data.upgradeId);
    });
    
    eventBus.on('game:tick', () => {
      this.applyProductionUpgrades();
    });
  }
  
  private initializeAutoClickers() {
    setInterval(() => {
      const state = useGameStore.getState();
      
      if (state.upgrades['autoclicker_1']) {
        this.performAutoClick(1);
      }
      if (state.upgrades['autoclicker_2']) {
        this.performAutoClick(5);
      }
      if (state.upgrades['autoclicker_3']) {
        this.performAutoClick(25);
      }
    }, 1000);
  }
  
  private performAutoClick(clicks: number) {
    for (let i = 0; i < clicks; i++) {
      eventBus.emit('click:perform');
    }
  }
  
  canPurchase(upgrade: Upgrade): boolean {
    const state = useGameStore.getState();
    
    if (state.upgrades[upgrade.id]) return false;
    if (state.resources.crystals < upgrade.cost) return false;
    
    if (upgrade.requires) {
      for (const requiredId of upgrade.requires) {
        if (!state.upgrades[requiredId]) return false;
      }
    }
    
    return true;
  }
  
  purchaseUpgrade(upgradeId: string): boolean {
    const state = useGameStore.getState();
    const upgrade = this.upgrades.find(u => u.id === upgradeId);
    
    if (!upgrade) return false;
    if (!this.canPurchase(upgrade)) return false;
    
    if (state.spendCrystals(upgrade.cost)) {
      useGameStore.setState((s) => {
        s.upgrades[upgradeId] = true;
      });
      
      this.applyUpgradeEffect(upgrade);
      eventBus.emit('upgrade:purchased', upgrade);
      return true;
    }
    
    return false;
  }
  
  private applyUpgradeEffect(upgrade: Upgrade) {
    const state = useGameStore.getState();
    
    switch (upgrade.effect.type) {
      case 'addClick':
        state.multipliers.clickMultiplier += upgrade.effect.value;
        break;
      case 'multiplyClick':
        state.multipliers.clickMultiplier *= upgrade.effect.value;
        break;
      case 'addCritChance':
        // Применяется в ClickSystem
        break;
      case 'multiplyCrit':
        state.multipliers.critMultiplier *= upgrade.effect.value;
        break;
      case 'multiplyProduction':
        state.multipliers.productionMultiplier *= upgrade.effect.value;
        break;
      case 'addEnergy':
        state.resources.maxEnergy += upgrade.effect.value;
        break;
      case 'multiplyEnergy':
        state.resources.maxEnergy *= upgrade.effect.value;
        break;
    }
  }
  
  private applyProductionUpgrades() {
    const state = useGameStore.getState();
    let productionMultiplier = 1;
    
    if (state.upgrades['energy_field']) productionMultiplier *= 1.5;
    if (state.upgrades['quantum_field']) productionMultiplier *= 2;
    if (state.upgrades['time_field']) productionMultiplier *= 3;
    if (state.upgrades['space_field']) productionMultiplier *= 5;
    if (state.upgrades['universal_field']) productionMultiplier *= 10;
    
    state.multipliers.productionMultiplier = productionMultiplier;
  }
  
  getUpgrades(): Upgrade[] {
    return this.upgrades;
  }
  
  getAvailableUpgrades(): Upgrade[] {
    const state = useGameStore.getState();
    
    return this.upgrades.filter(upgrade => {
      if (state.upgrades[upgrade.id]) return false;
      
      if (upgrade.requires) {
        for (const requiredId of upgrade.requires) {
          if (!state.upgrades[requiredId]) return false;
        }
      }
      
      return state.resources.crystals >= upgrade.cost * 0.1; // Показываем если есть хотя бы 10% стоимости
    });
  }
}