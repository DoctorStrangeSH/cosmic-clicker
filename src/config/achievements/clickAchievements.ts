export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: any) => boolean;
  reward: {
    type: 'crystals' | 'quantumShards' | 'darkMatter';
    amount: number;
  };
  category: 'click' | 'resource' | 'building' | 'secret' | 'collection' | 'social' | 'time';
  secret?: boolean;
}

export const clickAchievements: Achievement[] = [
  {
    id: 'first_click',
    name: 'Первый контакт',
    description: 'Сделайте первый клик',
    icon: '👆',
    condition: (state) => state.stats.totalClicks >= 1,
    reward: { type: 'crystals', amount: 10 },
    category: 'click',
  },
  {
    id: 'click_100',
    name: 'Разминка',
    description: 'Сделайте 100 кликов',
    icon: '🖱️',
    condition: (state) => state.stats.totalClicks >= 100,
    reward: { type: 'crystals', amount: 100 },
    category: 'click',
  },
  {
    id: 'click_1000',
    name: 'Кликер-любитель',
    description: 'Сделайте 1,000 кликов',
    icon: '👆',
    condition: (state) => state.stats.totalClicks >= 1000,
    reward: { type: 'crystals', amount: 1000 },
    category: 'click',
  },
  {
    id: 'click_10000',
    name: 'Кликер-профессионал',
    description: 'Сделайте 10,000 кликов',
    icon: '🎯',
    condition: (state) => state.stats.totalClicks >= 10000,
    reward: { type: 'quantumShards', amount: 1 },
    category: 'click',
  },
  {
    id: 'click_100000',
    name: 'Кликер-мастер',
    description: 'Сделайте 100,000 кликов',
    icon: '🏆',
    condition: (state) => state.stats.totalClicks >= 100000,
    reward: { type: 'quantumShards', amount: 5 },
    category: 'click',
  },
  {
    id: 'click_1000000',
    name: 'Кликер-эксперт',
    description: 'Сделайте 1,000,000 кликов',
    icon: '💎',
    condition: (state) => state.stats.totalClicks >= 1000000,
    reward: { type: 'quantumShards', amount: 10 },
    category: 'click',
  },
  // ... и так далее
];