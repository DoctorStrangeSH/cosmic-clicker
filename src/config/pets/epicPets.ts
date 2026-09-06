import { Pet } from './commonPets';

export const epicPets: Pet[] = [
  {
    id: 'universal_whale',
    name: 'Вселенский кит',
    description: 'Огромный кит, плывущий сквозь космос',
    icon: '🐋',
    rarity: 'epic',
    cost: 10000000,
    bonuses: [
      { type: 'all', value: 0.25 }
    ],
    maxLevel: 100,
    evolutionStages: [
      { level: 1, name: 'Китёнок', icon: '🐋', multiplier: 1 },
      { level: 33, name: 'Молодой', icon: '🐋', multiplier: 3 },
      { level: 66, name: 'Вселенский', icon: '🐋', multiplier: 6 },
      { level: 100, name: 'Левиафан', icon: '🐋', multiplier: 10 }
    ]
  },
  {
    id: 'dark_panther',
    name: 'Тёмная пантера',
    description: 'Пантера, усиливающая тёмную материю',
    icon: '🐆',
    rarity: 'epic',
    cost: 50000000,
    bonuses: [
      { type: 'darkMatter', value: 0.50 }
    ],
    maxLevel: 100,
    evolutionStages: [
      { level: 1, name: 'Котёнок', icon: '🐆', multiplier: 1 },
      { level: 33, name: 'Хищник', icon: '🐆', multiplier: 3 },
      { level: 66, name: 'Тёмная', icon: '🐆', multiplier: 6 },
      { level: 100, name: 'Повелитель', icon: '🐆', multiplier: 10 }
    ]
  },
  {
    id: 'star_titan',
    name: 'Звёздный титан',
    description: 'Титан, усиливающий производство',
    icon: '🗿',
    rarity: 'epic',
    cost: 100000000,
    bonuses: [
      { type: 'production', value: 0.50 }
    ],
    maxLevel: 100,
    evolutionStages: [
      { level: 1, name: 'Пробуждённый', icon: '🗿', multiplier: 1 },
      { level: 33, name: 'Гигант', icon: '🗿', multiplier: 3 },
      { level: 66, name: 'Титан', icon: '🗿', multiplier: 6 },
      { level: 100, name: 'Колосс', icon: '🗿', multiplier: 10 }
    ]
  }
];