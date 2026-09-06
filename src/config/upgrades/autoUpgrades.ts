import { Upgrade } from './clickUpgrades';

export const autoUpgrades: Upgrade[] = [
  {
    id: 'autoclicker_1',
    name: 'Автокликер I',
    description: '1 клик/сек',
    icon: '🖱️',
    cost: 500000,
    type: 'auto',
    effect: {
      type: 'autoClick',
      value: 1
    }
  },
  {
    id: 'autoclicker_2',
    name: 'Автокликер II',
    description: '5 кликов/сек',
    icon: '🖱️',
    cost: 5000000,
    type: 'auto',
    effect: {
      type: 'autoClick',
      value: 5
    },
    requires: ['autoclicker_1']
  },
  {
    id: 'autoclicker_3',
    name: 'Автокликер III',
    description: '25 кликов/сек',
    icon: '🖱️',
    cost: 50000000,
    type: 'auto',
    effect: {
      type: 'autoClick',
      value: 25
    },
    requires: ['autoclicker_2']
  },
  {
    id: 'auto_collector',
    name: 'Сборщик золотых кристаллов',
    description: 'Автоматически собирает золотые кристаллы',
    icon: '💎',
    cost: 1000000,
    type: 'auto',
    effect: {
      type: 'autoCollect',
      value: 1
    }
  },
  {
    id: 'auto_purchase',
    name: 'Авто-покупка зданий',
    description: 'Автоматически покупает здания',
    icon: '🏗️',
    cost: 10000000,
    type: 'auto',
    effect: {
      type: 'autoCollect',
      value: 1
    },
    requires: ['auto_collector']
  }
];