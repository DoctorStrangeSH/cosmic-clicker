import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Quest, dailyQuests } from '../config/quests/dailyQuests';
import { chainQuests } from '../config/quests/chainQuests';

export class QuestSystem {
  private quests: Quest[] = [];
  private activeQuests: Quest[] = [];
  private completedQuests: Set<string> = new Set();
  
  constructor() {
    this.loadQuests();
    this.initializeDailyQuests();
    this.initializeListeners();
  }
  
  private loadQuests() {
    this.quests = [...dailyQuests, ...chainQuests];
  }
  
  private initializeDailyQuests() {
    // Выбираем случайные ежедневные квесты
    const dailyQuestsList = this.quests.filter(q => q.type === 'daily');
    const shuffled = dailyQuestsList.sort(() => Math.random() - 0.5);
    this.activeQuests = shuffled.slice(0, 5);
  }
  
  private initializeListeners() {
    eventBus.on('click:performed', () => {
      this.updateQuestProgress('clicks', 1);
    });
    
    eventBus.on('building:purchased', () => {
      this.updateQuestProgress('buildings', 1);
    });
    
    eventBus.on('upgrade:purchased', () => {
      this.updateQuestProgress('upgrades', 1);
    });
    
    eventBus.on('game:tick', () => {
      this.checkQuestCompletion();
    });
  }
  
  private updateQuestProgress(type: string, amount: number) {
    const state = useGameStore.getState();
    
    this.activeQuests.forEach(quest => {
      if (quest.objective.type === type) {
        quest.objective.current = (quest.objective.current || 0) + amount;
      }
    });
  }
  
  private checkQuestCompletion() {
    const state = useGameStore.getState();
    
    this.activeQuests.forEach(quest => {
      if (this.completedQuests.has(quest.id)) return;
      
      let current = quest.objective.current || 0;
      
      // Для квестов на накопление проверяем текущее значение
      switch (quest.objective.type) {
        case 'crystals':
          current = state.resources.crystals;
          break;
        case 'energy':
          current = state.stats.totalClicks; // TODO: Добавить статистику энергии
          break;
        case 'combo':
          current = state.stats.maxCombo;
          break;
        case 'prestige':
          current = state.stats.totalPrestiges;
          break;
      }
      
      if (current >= quest.objective.target) {
        this.completeQuest(quest);
      }
    });
  }
  
  private completeQuest(quest: Quest) {
    this.completedQuests.add(quest.id);
    
    // Выдаём награду
    const state = useGameStore.getState();
    switch (quest.reward.type) {
      case 'crystals':
        state.addCrystals(quest.reward.amount);
        break;
      case 'quantumShards':
        useGameStore.setState((s) => {
          s.resources.quantumShards += quest.reward.amount;
        });
        break;
      case 'starDust':
        useGameStore.setState((s) => {
          s.resources.starDust += quest.reward.amount;
        });
        break;
      case 'energy':
        useGameStore.setState((s) => {
          s.resources.energy = Math.min(
            s.resources.energy + quest.reward.amount,
            s.resources.maxEnergy
          );
        });
        break;
    }
    
    eventBus.emit('quest:completed', quest);
  }
  
  getActiveQuests(): Quest[] {
    return this.activeQuests;
  }
  
  getQuestProgress(quest: Quest): number {
    const state = useGameStore.getState();
    
    switch (quest.objective.type) {
      case 'crystals':
        return state.resources.crystals;
      case 'clicks':
        return quest.objective.current || 0;
      case 'buildings':
        return quest.objective.current || 0;
      case 'upgrades':
        return quest.objective.current || 0;
      case 'combo':
        return state.stats.maxCombo;
      case 'prestige':
        return state.stats.totalPrestiges;
      default:
        return quest.objective.current || 0;
    }
  }
}