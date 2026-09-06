import { Pet } from './commonPets';

export const rarePets: Pet[] = [
  {
    id: 'quantum_fox',
    name: 'Квантовый лис',
    description: 'Лис, манипулирующий квантовой энергией',
    icon: '🦊',
    rarity: 'rare',
    cost: 100000,
    bonuses: [
      { type: 'all', value: 0.05 }
    ],
    maxLevel: 75,
    evolutionStages: [
      { level: 1, name: 'Лисёнок', icon: '🦊', multiplier: 1 },
      { level: 25, name: 'Юный', icon: '🦊', multiplier: 2 },
      { level: 50, name: 'Квантовый', icon: '🦊', multiplier: 3 },
      { level: 75, name: 'Мастер', icon: '🦊', multiplier: 5 }
    ]
  },
  {
    id: 'heavenly_dragon',
    name: 'Небесный дракон',
    description: 'Дракон, усиливающий ваши клики',
    icon: '🐉',
    rarity: 'rare',
    cost: 500000,
    bonuses: [
      { type: 'click', value: 0.10 }
    ],
    maxLevel: 75,
    evolutionStages: [
      { level: 1, name: 'Дракончик', icon: '🐉', multiplier: 1 },
      { level: 25, name: 'Молодой', icon: '🐉', multiplier: 2 },
      { level: 50, name: 'Небесный', icon: '🐉', multiplier: 3 },
      { level: 75, name: 'Властелин', icon: '🐉', multiplier: 5 }
    ]
  },
  {
    id: 'nebula_phoenix',
    name: 'Феникс туманности',
    description: 'Феникс, возрождающий производство',
    icon: '🔥',
    rarity: 'rare',
    cost: 1000000,
    bonuses: [
      { type: 'production', value: 0.10 }
    ],
    maxLevel: 75,
    evolutionStages: [
      { level: 1, name: 'Птенец', icon: '🔥', multiplier: 1 },
      { level: 25, name: 'Юный', icon: '🔥', multiplier: 2 },
      { level: 50, name: 'Феникс', icon: '🔥', multiplier: 3 },
      { level: 75, name: 'Бессмертный', icon: '🔥', multiplier: 5 }
    ]
  },
  {
    id: 'galaxy_unicorn',
    name: 'Единорог галактики',
    description: 'Единорог, усиливающий энергию',
    icon: '🦄',
    rarity: 'rare',
    cost: 2500000,
    bonuses: [
      { type: 'energy', value: 0.10 }
    ],
    maxLevel: 75,
    evolutionStages: [
      { level: 1, name: 'Жеребёнок', icon: '🦄', multiplier: 1 },
      { level: 25, name: 'Юный', icon: '🦄', multiplier: 2 },
      { level: 50, name: 'Галактический', icon: '🦄', multiplier: 3 },
      { level: 75, name: 'Божественный', icon: '🦄', multiplier: 5 }
    ]
  }
];