import { Upgrade } from './clickUpgrades';

export const critUpgrades: Upgrade[] = [
  {
    id: 'precise_strike',
    name: 'Точный удар',
    description: '+5% шанс крита',
    icon: '🎯',
    cost: 500,
    type: 'crit',
    effect: {
      type: 'addCritChance',
      value: 0.05
    }
  },
  {
    id: 'deadly_strike',
    name: 'Смертельный удар',
    description: '+10% шанс крита',
    icon: '💀',
    cost: 5000,
    type: 'crit',
    effect: {
      type: 'addCritChance',
      value: 0.10
    },
    requires: ['precise_strike']
  },
  {
    id: 'killing_strike',
    name: 'Убийственный удар',
    description: '+15% шанс крита',
    icon: '⚔️',
    cost: 50000,
    type: 'crit',
    effect: {
      type: 'addCritChance',
      value: 0.15
    },
    requires: ['deadly_strike']
  },
  {
    id: 'powerful_crit',
    name: 'Мощный крит',
    description: 'Крит x10 вместо x5',
    icon: '💪',
    cost: 2000,
    type: 'crit',
    effect: {
      type: 'multiplyCrit',
      value: 2
    }
  },
  {
    id: 'devastating_crit',
    name: 'Разрушительный крит',
    description: 'Крит x25',
    icon: '🔥',
    cost: 20000,
    type: 'crit',
    effect: {
      type: 'multiplyCrit',
      value: 2.5
    },
    requires: ['powerful_crit']
  }
];