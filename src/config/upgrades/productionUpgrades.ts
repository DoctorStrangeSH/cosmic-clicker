import { Upgrade } from './clickUpgrades';

export const productionUpgrades: Upgrade[] = [
  {
    id: 'energy_field',
    name: 'Энергетическое поле',
    description: 'Производство x1.5',
    icon: '⚡',
    cost: 100000,
    type: 'production',
    effect: {
      type: 'multiplyProduction',
      value: 1.5
    }
  },
  {
    id: 'quantum_field',
    name: 'Квантовое поле',
    description: 'Производство x2',
    icon: '🔮',
    cost: 1000000,
    type: 'production',
    effect: {
      type: 'multiplyProduction',
      value: 2
    },
    requires: ['energy_field']
  },
  {
    id: 'time_field',
    name: 'Временное поле',
    description: 'Производство x3',
    icon: '⏰',
    cost: 10000000,
    type: 'production',
    effect: {
      type: 'multiplyProduction',
      value: 3
    },
    requires: ['quantum_field']
  },
  {
    id: 'space_field',
    name: 'Пространственное поле',
    description: 'Производство x5',
    icon: '🌌',
    cost: 100000000,
    type: 'production',
    effect: {
      type: 'multiplyProduction',
      value: 5
    },
    requires: ['time_field']
  },
  {
    id: 'universal_field',
    name: 'Вселенское поле',
    description: 'Производство x10',
    icon: '✨',
    cost: 1000000000,
    type: 'production',
    effect: {
      type: 'multiplyProduction',
      value: 10
    },
    requires: ['space_field']
  }
];