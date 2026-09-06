export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'daily' | 'chain' | 'special';
  objective: {
    type: 'clicks' | 'crystals' | 'buildings' | 'upgrades' | 'combo' | 'energy' | 'prestige' | 'goldenCrystals';
    target: number;
    current?: number;
  };
  reward: {
    type: 'crystals' | 'quantumShards' | 'starDust' | 'energy';
    amount: number;
  };
  timeLimit?: number; // в секундах
  chainPart?: number;
  chainTotal?: number;
}

export const dailyQuests: Quest[] = [
  {
    id: 'daily_click_100',
    name: 'Разминка',
    description: 'Сделайте 100 кликов',
    icon: '👆',
    type: 'daily',
    objective: {
      type: 'clicks',
      target: 100
    },
    reward: {
      type: 'crystals',
      amount: 50
    }
  },
  {
    id: 'daily_crystals_1000',
    name: 'Первая тысяча',
    description: 'Накопите 1,000 кристаллов',
    icon: '💎',
    type: 'daily',
    objective: {
      type: 'crystals',
      target: 1000
    },
    reward: {
      type: 'crystals',
      amount: 100
    }
  },
  {
    id: 'daily_building_1',
    name: 'Строитель',
    description: 'Купите 1 здание',
    icon: '🏗️',
    type: 'daily',
    objective: {
      type: 'buildings',
      target: 1
    },
    reward: {
      type: 'crystals',
      amount: 75
    }
  },
  {
    id: 'daily_combo_20',
    name: 'Комбо-мастер',
    description: 'Достигните комбо x20',
    icon: '🔥',
    type: 'daily',
    objective: {
      type: 'combo',
      target: 20
    },
    reward: {
      type: 'starDust',
      amount: 5
    }
  },
  {
    id: 'daily_energy_50',
    name: 'Энергетик',
    description: 'Потратьте 50 энергии',
    icon: '⚡',
    type: 'daily',
    objective: {
      type: 'energy',
      target: 50
    },
    reward: {
      type: 'crystals',
      amount: 150
    }
  },
  {
    id: 'daily_clicks_1000',
    name: 'Профессионал',
    description: 'Сделайте 1,000 кликов',
    icon: '🎯',
    type: 'daily',
    objective: {
      type: 'clicks',
      target: 1000
    },
    reward: {
      type: 'crystals',
      amount: 500
    }
  },
  {
    id: 'daily_crystals_100000',
    name: 'Богач',
    description: 'Накопите 100,000 кристаллов',
    icon: '💰',
    type: 'daily',
    objective: {
      type: 'crystals',
      target: 100000
    },
    reward: {
      type: 'quantumShards',
      amount: 1
    }
  },
  {
    id: 'daily_buildings_10',
    name: 'Архитектор',
    description: 'Купите 10 зданий',
    icon: '🏛️',
    type: 'daily',
    objective: {
      type: 'buildings',
      target: 10
    },
    reward: {
      type: 'crystals',
      amount: 1000
    }
  }
];