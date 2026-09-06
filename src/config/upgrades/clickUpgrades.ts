export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  type: 'click' | 'production' | 'energy' | 'crit' | 'auto' | 'special';
  effect: {
    type: 'addClick' | 'multiplyClick' | 'addCritChance' | 'multiplyCrit' | 
          'addEnergy' | 'multiplyEnergy' | 'multiplyProduction' | 'autoClick' | 
          'autoCollect' | 'unlockFeature';
    value: number;
  };
  requires?: string[]; // ID улучшений, которые нужно купить перед этим
  maxLevel?: number;
  currentLevel?: number;
}

export const clickUpgrades: Upgrade[] = [
  {
    id: 'improved_drill',
    name: 'Улучшенный бур',
    description: '+1 к клику',
    icon: '🔧',
    cost: 100,
    type: 'click',
    effect: {
      type: 'addClick',
      value: 1
    }
  },
  {
    id: 'plasma_cutter',
    name: 'Плазменный резак',
    description: '+5 к клику',
    icon: '⚡',
    cost: 1000,
    type: 'click',
    effect: {
      type: 'addClick',
      value: 5
    },
    requires: ['improved_drill']
  },
  {
    id: 'quantum_disintegrator',
    name: 'Квантовый дезинтегратор',
    description: '+25 к клику',
    icon: '💥',
    cost: 10000,
    type: 'click',
    effect: {
      type: 'addClick',
      value: 25
    },
    requires: ['plasma_cutter']
  },
  {
    id: 'atomic_destroyer',
    name: 'Атомный разрушитель',
    description: '+100 к клику',
    icon: '☢️',
    cost: 100000,
    type: 'click',
    effect: {
      type: 'addClick',
      value: 100
    },
    requires: ['quantum_disintegrator']
  },
  {
    id: 'singularity_hammer',
    name: 'Сингулярный молот',
    description: '+500 к клику',
    icon: '🔨',
    cost: 1000000,
    type: 'click',
    effect: {
      type: 'addClick',
      value: 500
    },
    requires: ['atomic_destroyer']
  }
];