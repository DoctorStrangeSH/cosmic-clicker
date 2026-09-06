export interface CraftResource {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'booster' | 'artifact' | 'key' | 'scroll';
  ingredients: {
    resourceId: string;
    amount: number;
  }[];
  result: {
    type: string;
    value: number;
    duration?: number;
  };
  craftingTime: number; // в секундах
}

export const craftResources: CraftResource[] = [
  { id: 'crystal_shard', name: 'Кристальный осколок', icon: '💎', rarity: 'common' },
  { id: 'iron_ore', name: 'Железная руда', icon: '⛏️', rarity: 'common' },
  { id: 'copper_wire', name: 'Медная проволока', icon: '🔌', rarity: 'common' },
  { id: 'silver_plate', name: 'Серебряная пластина', icon: '🥈', rarity: 'uncommon' },
  { id: 'gold_ingot', name: 'Золотой слиток', icon: '🥇', rarity: 'uncommon' },
  { id: 'plasma_core', name: 'Плазменное ядро', icon: '⚡', rarity: 'rare' },
  { id: 'quantum_crystal', name: 'Квантовый кристалл', icon: '🔮', rarity: 'rare' },
  { id: 'dark_essence', name: 'Тёмная эссенция', icon: '🌑', rarity: 'epic' },
  { id: 'star_core', name: 'Звёздное ядро', icon: '⭐', rarity: 'epic' },
  { id: 'universal_fragment', name: 'Фрагмент вселенной', icon: '🌌', rarity: 'legendary' }
];

export const craftRecipes: CraftRecipe[] = [
  {
    id: 'click_booster_1',
    name: 'Малый усилитель клика',
    description: 'x2 к кликам на 30 минут',
    icon: '👆',
    category: 'booster',
    ingredients: [
      { resourceId: 'crystal_shard', amount: 10 },
      { resourceId: 'iron_ore', amount: 5 }
    ],
    result: {
      type: 'clickBoost',
      value: 2,
      duration: 1800
    },
    craftingTime: 60
  },
  {
    id: 'production_booster_1',
    name: 'Усилитель производства',
    description: 'x2 к производству на 1 час',
    icon: '⚙️',
    category: 'booster',
    ingredients: [
      { resourceId: 'copper_wire', amount: 15 },
      { resourceId: 'silver_plate', amount: 5 }
    ],
    result: {
      type: 'productionBoost',
      value: 2,
      duration: 3600
    },
    craftingTime: 120
  },
  {
    id: 'lucky_artifact',
    name: 'Артефакт удачи',
    description: '+10% к шансу золотых кристаллов',
    icon: '🍀',
    category: 'artifact',
    ingredients: [
      { resourceId: 'gold_ingot', amount: 10 },
      { resourceId: 'quantum_crystal', amount: 3 }
    ],
    result: {
      type: 'luckBoost',
      value: 0.10,
      duration: 86400
    },
    craftingTime: 300
  },
  {
    id: 'energy_artifact',
    name: 'Энергетический артефакт',
    description: '+50 к максимальной энергии',
    icon: '⚡',
    category: 'artifact',
    ingredients: [
      { resourceId: 'plasma_core', amount: 5 },
      { resourceId: 'silver_plate', amount: 10 }
    ],
    result: {
      type: 'maxEnergyBoost',
      value: 50,
      duration: 86400
    },
    craftingTime: 240
  },
  {
    id: 'golden_key',
    name: 'Золотой ключ',
    description: 'Открывает золотой сундук',
    icon: '🗝️',
    category: 'key',
    ingredients: [
      { resourceId: 'gold_ingot', amount: 20 },
      { resourceId: 'crystal_shard', amount: 30 }
    ],
    result: {
      type: 'goldenChestKey',
      value: 1
    },
    craftingTime: 600
  },
  {
    id: 'ancient_scroll',
    name: 'Древний свиток',
    description: 'Содержит древние знания',
    icon: '📜',
    category: 'scroll',
    ingredients: [
      { resourceId: 'dark_essence', amount: 3 },
      { resourceId: 'star_core', amount: 1 }
    ],
    result: {
      type: 'ancientKnowledge',
      value: 1
    },
    craftingTime: 1200
  }
];