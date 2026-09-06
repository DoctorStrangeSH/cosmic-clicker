import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Achievement, clickAchievements } from '../config/achievements/clickAchievements';
import { collectionAchievements, socialAchievements, timeAchievements, secretAchievements } from '../config/achievements/newAchievements';

export class AchievementSystem {
  private achievements: Achievement[] = [];
  
  constructor() {
    this.loadAchievements();
    this.initializeListeners();
  }
  
  private loadAchievements() {
    this.achievements = [
      ...clickAchievements,
      ...collectionAchievements,
      ...socialAchievements,
      ...timeAchievements,
      ...secretAchievements
    ];
  }
  
  private initializeListeners() {
    eventBus.on('game:tick', () => {
      this.checkAchievements();
    });
  }
  
  private checkAchievements() {
    const state = useGameStore.getState();
    
    this.achievements.forEach(achievement => {
      if (
        !state.achievements[achievement.id] &&
        achievement.condition(state)
      ) {
        this.unlockAchievement(achievement);
      }
    });
  }
  
  private unlockAchievement(achievement: Achievement) {
    useGameStore.setState((state) => {
      state.achievements[achievement.id] = true;
      
      // Выдаём награду
      switch (achievement.reward.type) {
        case 'crystals':
          state.resources.crystals += achievement.reward.amount;
          break;
        case 'quantumShards':
          state.resources.quantumShards += achievement.reward.amount;
          break;
        case 'darkMatter':
          state.resources.darkMatter += achievement.reward.amount;
          break;
      }
    });
    
    eventBus.emit('achievement:unlocked', achievement);
  }
  
  getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }
  
  getUnlockedCount(): number {
    const state = useGameStore.getState();
    return Object.keys(state.achievements).length;
  }
  
  getTotalCount(): number {
    return this.achievements.length;
  }
}