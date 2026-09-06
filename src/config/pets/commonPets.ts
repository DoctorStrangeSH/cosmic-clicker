export interface Pet {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  cost: number;
  bonuses: {
    type: 'click' | 'production' | 'energy' | 'goldenCrystals' | 'all' | 'darkMatter' | 'prestige';
    value: number;
  }[];
  maxLevel: number;
  evolutionStages: {
    level: number;
    name: string;
    icon: string;
    multiplier: number;
  }[];
}

export const commonPets: Pet[] = [
  {
    id: 'space_hamster',
    name: 'Космический хомяк',
    description: 'Милый хомяк, который любит кристаллы',
    icon: '🐹',
    rarity: 'common',
    cost: 1000,
    bonuses: [
      { type: 'click', value: 0.01 }
    ],
    maxLevel: 50,
    evolutionStages: [
      { level: 1, name: 'Малыш', icon: '🐹', multiplier: 1 },
      { level: 10, name: 'Юниор', icon: '🐹', multiplier: 1.5 },
      { level: 25, name: 'Взрослый', icon: '🐹', multiplier: 2 },
      { level: 50, name: 'Легенда', icon: '🐹', multiplier: 3 }
    ]
  },
  {
    id: 'star_cat',
    name: 'Звёздный кот',
    description: 'Кот, который приносит удачу',
    icon: '🐱',
    rarity: 'common',
    cost: 5000,
    bonuses: [
      { type: 'production', value: 0.01 }
    ],
    maxLevel: 50,
    evolutionStages: [
      { level: 1, name: 'Котёнок', icon: '🐱', multiplier: 1 },
      { level: 10, name: 'Юный', icon: '🐱', multiplier: 1.5 },
      { level: 25, name: 'Охотник', icon: '🐱', multiplier: 2 },
      { level: 50, name: 'Звёздный', icon: '🐱', multiplier: 3 }
    ]
  },
  {
    id: 'asteroid_dog',
    name: 'Астероидный пёс',
    description: 'Верный пёс, защищающий базу',
    icon: '🐶',
    rarity: 'common',
    cost: 10000,
    bonuses: [
      { type: 'energy', value: 0.01 }
    ],
    maxLevel: 50,
    evolutionStages: [
      { level: 1, name: 'Щенок', icon: '🐶', multiplier: 1 },
      { level: 10, name: 'Юный', icon: '🐶', multiplier: 1.5 },
      { level: 25, name: 'Страж', icon: '🐶', multiplier: 2 },
      { level: 50, name: 'Защитник', icon: '🐶', multiplier: 3 }
    ]
  },
  {
    id: 'comet_parrot',
    name: 'Комета-попугай',
    description: 'Попугай, который находит золотые кристаллы',
    icon: '🦜',
    rarity: 'common',
    cost: 25000,
    bonuses: [
      { type: 'goldenCrystals', value: 0.01 }
    ],
    maxLevel: 50,
    evolutionStages: [
      { level: 1, name: 'Птенец', icon: '🦜', multiplier: 1 },
      { level: 10, name: 'Юный', icon: '🦜', multiplier: 1.5 },
      { level: 25, name: 'Исследователь', icon: '🦜', multiplier: 2 },
      { level: 50, name: 'Комета', icon: '🦜', multiplier: 3 }
    ]
  }
];