import { Pet } from './commonPets';

export const legendaryPets: Pet[] = [
  {
    id: 'universe_creator',
    name: 'Создатель вселенных',
    description: 'Существо, создающее новые вселенные',
    icon: '🌌',
    rarity: 'legendary',
    cost: 1000000000,
    bonuses: [
      { type: 'all', value: 2 }
    ],
    maxLevel: 200,
    evolutionStages: [
      { level: 1, name: 'Искра', icon: '🌌', multiplier: 1 },
      { level: 50, name: 'Создатель', icon: '🌌', multiplier: 5 },
      { level: 100, name: 'Божество', icon: '🌌', multiplier: 10 },
      { level: 200, name: 'Творец', icon: '🌌', multiplier: 20 }
    ]
  },
  {
    id: 'time_keeper',
    name: 'Хранитель времени',
    description: 'Существо, контролирующее время',
    icon: '⏳',
    rarity: 'legendary',
    cost: 5000000000,
    bonuses: [
      { type: 'prestige', value: 3 }
    ],
    maxLevel: 200,
    evolutionStages: [
      { level: 1, name: 'Секунда', icon: '⏳', multiplier: 1 },
      { level: 50, name: 'Минута', icon: '⏳', multiplier: 5 },
      { level: 100, name: 'Час', icon: '⏳', multiplier: 10 },
      { level: 200, name: 'Вечность', icon: '⏳', multiplier: 20 }
    ]
  }
];