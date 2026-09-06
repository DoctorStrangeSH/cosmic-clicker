export interface Ship {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'exploration' | 'mining' | 'military' | 'special';
  cost: number;
  stats: {
    speed?: number;
    capacity?: number;
    damage?: number;
    defense?: number;
    special?: string;
  };
  missions: string[];
}

export const fleetShips: Ship[] = [
  {
    id: 'scout_swift',
    name: 'Разведчик "Стриж"',
    description: 'Быстрый корабль для разведки',
    icon: '🔍',
    type: 'exploration',
    cost: 10000,
    stats: {
      speed: 10,
      capacity: 100
    },
    missions: ['recon', 'explore']
  },
  {
    id: 'researcher_prometheus',
    name: 'Исследователь "Прометей"',
    description: 'Корабль для научных исследований',
    icon: '🔬',
    type: 'exploration',
    cost: 1000000,
    stats: {
      speed: 5,
      capacity: 500,
      special: 'Научные миссии'
    },
    missions: ['research', 'explore', 'diplomacy']
  },
  {
    id: 'miner_small',
    name: 'Малый шахтёр',
    description: 'Добывающий корабль',
    icon: '⛏️',
    type: 'mining',
    cost: 50000,
    stats: {
      speed: 3,
      capacity: 1000
    },
    missions: ['mine', 'collect']
  },
  {
    id: 'miner_medium',
    name: 'Средний добытчик',
    description: 'Улучшенный добывающий корабль',
    icon: '⚒️',
    type: 'mining',
    cost: 5000000,
    stats: {
      speed: 2,
      capacity: 10000
    },
    missions: ['mine', 'collect', 'excavate']
  },
  {
    id: 'fighter',
    name: 'Истребитель',
    description: 'Боевой корабль',
    icon: '⚔️',
    type: 'military',
    cost: 100000,
    stats: {
      damage: 10,
      defense: 5
    },
    missions: ['defend', 'attack', 'patrol']
  },
  {
    id: 'cruiser',
    name: 'Крейсер',
    description: 'Тяжёлый боевой корабль',
    icon: '🛡️',
    type: 'military',
    cost: 10000000,
    stats: {
      damage: 50,
      defense: 30
    },
    missions: ['defend', 'attack', 'war']
  },
  {
    id: 'trade_ship',
    name: 'Торговый корабль',
    description: 'Корабль для торговли',
    icon: '💰',
    type: 'special',
    cost: 500000,
    stats: {
      speed: 7,
      capacity: 5000,
      special: 'Торговые миссии'
    },
    missions: ['trade', 'transport']
  },
  {
    id: 'science_ship',
    name: 'Научный корабль',
    description: 'Корабль для исследований',
    icon: '🔭',
    type: 'special',
    cost: 50000000,
    stats: {
      speed: 4,
      capacity: 2000,
      special: 'Научные открытия'
    },
    missions: ['research', 'discover']
  }
];