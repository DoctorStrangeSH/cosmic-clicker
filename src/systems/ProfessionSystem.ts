import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Profession, professions } from '../config/professions/professions';

interface ProfessionState {
  level: number;
  experience: number;
  skillsUnlocked: string[];
}

export class ProfessionSystem {
  private professions: Profession[] = [];
  private professionStates: Record<string, ProfessionState> = {};
  
  constructor() {
    this.loadProfessions();
    this.initializeStates();
    this.initializeListeners();
  }
  
  private loadProfessions() {
    this.professions = professions;
  }
  
  private initializeStates() {
    this.professions.forEach(profession => {
      this.professionStates[profession.id] = {
        level: 1,
        experience: 0,
        skillsUnlocked: []
      };
    });
  }
  
  private initializeListeners() {
    eventBus.on('profession:gainExperience', (data) => {
      this.gainExperience(data.professionId, data.amount);
    });
    
    eventBus.on('profession:unlockSkill', (data) => {
      this.unlockSkill(data.professionId, data.skillId);
    });
    
    // Автоматическое получение опыта
    eventBus.on('click:performed', () => {
      this.gainExperience('miner', 0.1);
    });
    
    eventBus.on('building:purchased', () => {
      this.gainExperience('engineer', 1);
    });
    
    eventBus.on('upgrade:purchased', () => {
      this.gainExperience('scientist', 2);
    });
  }
  
  gainExperience(professionId: string, amount: number) {
    const state = this.professionStates[professionId];
    if (!state) return;
    
    state.experience += amount;
    
    // Проверяем повышение уровня
    const expNeeded = state.level * 100;
    while (state.experience >= expNeeded && state.level < 100) {
      state.experience -= expNeeded;
      state.level++;
      
      // Проверяем разблокировку навыков
      const profession = this.professions.find(p => p.id === professionId);
      if (profession) {
        profession.skills.forEach(skill => {
          if (
            state.level >= skill.unlockLevel && 
            !state.skillsUnlocked.includes(skill.id)
          ) {
            state.skillsUnlocked.push(skill.id);
            eventBus.emit('profession:skillUnlocked', { professionId, skill });
          }
        });
      }
      
      eventBus.emit('profession:levelUp', { 
        professionId, 
        level: state.level 
      });
    }
  }
  
  unlockSkill(professionId: string, skillId: string): boolean {
    const state = this.professionStates[professionId];
    const profession = this.professions.find(p => p.id === professionId);
    
    if (!state || !profession) return false;
    
    const skill = profession.skills.find(s => s.id === skillId);
    if (!skill) return false;
    if (state.level < skill.unlockLevel) return false;
    if (state.skillsUnlocked.includes(skillId)) return false;
    
    state.skillsUnlocked.push(skillId);
    this.applySkillEffect(professionId, skill);
    
    eventBus.emit('profession:skillUnlocked', { professionId, skill });
    return true;
  }
  
  private applySkillEffect(professionId: string, skill: any) {
    const state = useGameStore.getState();
    
    switch (skill.effect.type) {
      case 'productionBoost':
        state.multipliers.productionMultiplier *= skill.effect.value;
        break;
      case 'clickBoost':
        state.multipliers.clickMultiplier *= skill.effect.value;
        break;
      case 'buildingCostReduction':
        state.multipliers.globalMultiplier *= (1 / (1 - skill.effect.value));
        break;
      case 'damageBoost':
        state.multipliers.critMultiplier *= skill.effect.value;
        break;
    }
  }
  
  getProfessionState(professionId: string): ProfessionState | null {
    return this.professionStates[professionId] || null;
  }
  
  getProfessions(): Profession[] {
    return this.professions;
  }
  
  getTotalBonus(professionId: string): number {
    const profession = this.professions.find(p => p.id === professionId);
    const state = this.professionStates[professionId];
    
    if (!profession || !state) return 0;
    
    return profession.baseBonus + (state.level - 1) * profession.bonusPerLevel;
  }
}