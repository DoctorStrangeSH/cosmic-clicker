import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';

export class ClickSystem {
  private lastClickTime: number = 0;
  private comboCount: number = 0;
  private comboMultiplier: number = 1;
  private readonly COMBO_TIMEOUT = 1000;
  private readonly MAX_COMBO_MULTIPLIER = 3;
  
  constructor() {
    this.initializeListeners();
  }
  
  private initializeListeners() {
    eventBus.on('click:perform', () => {
      this.handleClick();
    });
  }
  
  private handleClick() {
    const state = useGameStore.getState();
    const currentTime = Date.now();
    
    if (currentTime - this.lastClickTime <= this.COMBO_TIMEOUT) {
      this.comboCount++;
      this.updateComboMultiplier();
    } else {
      this.comboCount = 0;
      this.comboMultiplier = 1;
    }
    
    this.lastClickTime = currentTime;
    
    let clickValue = this.getClickValue();
    clickValue *= this.comboMultiplier;
    
    if (this.isCriticalHit()) {
      clickValue *= this.getCritMultiplier();
      eventBus.emit('click:critical', { value: clickValue });
    }
    
    state.addCrystals(clickValue);
    
    useGameStore.setState((s) => {
      s.stats.totalClicks++;
      s.stats.currentCombo = this.comboCount;
      s.stats.maxCombo = Math.max(s.stats.maxCombo, this.comboCount);
    });
    
    if (Math.random() < 0.01) {
      useGameStore.setState((s) => {
        s.resources.starDust++;
      });
      eventBus.emit('resource:stardust', { amount: 1 });
    }
    
    eventBus.emit('click:performed', {
      value: clickValue,
      combo: this.comboCount,
      crit: clickValue > this.getClickValue() * this.comboMultiplier
    });
  }
  
  private getClickValue(): number {
    const state = useGameStore.getState();
    let value = 1;
    
    value *= state.multipliers.clickMultiplier;
    value *= state.multipliers.globalMultiplier;
    value *= state.multipliers.prestigeMultiplier;
    
    if (state.upgrades['improved_drill']) value += 1;
    if (state.upgrades['plasma_cutter']) value += 5;
    if (state.upgrades['quantum_disintegrator']) value += 25;
    
    return value;
  }
  
  private updateComboMultiplier() {
    const comboBonus = Math.floor(this.comboCount / 10) * 0.1;
    this.comboMultiplier = Math.min(
      1 + comboBonus,
      this.MAX_COMBO_MULTIPLIER
    );
  }
  
  private isCriticalHit(): boolean {
    const state = useGameStore.getState();
    let critChance = 0.05;
    
    if (state.upgrades['precise_strike']) critChance += 0.05;
    if (state.upgrades['deadly_strike']) critChance += 0.10;
    
    return Math.random() < critChance;
  }
  
  private getCritMultiplier(): number {
    const state = useGameStore.getState();
    let multiplier = 5;
    
    if (state.upgrades['powerful_crit']) multiplier = 10;
    if (state.upgrades['devastating_crit']) multiplier = 25;
    
    return multiplier * state.multipliers.critMultiplier;
  }
  
  getComboInfo() {
    return {
      count: this.comboCount,
      multiplier: this.comboMultiplier,
      isActive: Date.now() - this.lastClickTime <= this.COMBO_TIMEOUT
    };
  }
}