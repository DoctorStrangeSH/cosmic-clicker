import { Quest } from './dailyQuests';

export const chainQuests: Quest[] = [
  // Цепочка "Новичок"
  {
    id: 'chain_newbie_1',
    name: 'Первый шаг',
    description: 'Сделайте первый клик',
    icon: '👣',
    type: 'chain',
    objective: {
      type: 'clicks',
      target: 1
    },
    reward: {
      type: 'crystals',
      amount: 10
    },
    chainPart: 1,
    chainTotal: 5
  },
  {
    id: 'chain_newbie_2',
    name: 'Десять кликов',
    description: 'Сделайте 10 кликов',
    icon: '👆',
    type: 'chain',
    objective: {
      type: 'clicks',
      target: 10
    },
    reward: {
      type: 'crystals',
      amount: 50
    },
    chainPart: 2,
    chainTotal: 5
  },
  {
    id: 'chain_newbie_3',
    name: 'Первое здание',
    description: 'Постройте первое здание',
    icon: '🏗️',
    type: 'chain',
    objective: {
      type: 'buildings',
      target: 1
    },
    reward: {
      type: 'crystals',
      amount: 100
    },
    chainPart: 3,
    chainTotal: 5
  },
  {
    id: 'chain_newbie_4',
    name: 'Тысяча кристаллов',
    description: 'Накопите 1,000 кристаллов',
    icon: '💎',
    type: 'chain',
    objective: {
      type: 'crystals',
      target: 1000
    },
    reward: {
      type: 'crystals',
      amount: 500
    },
    chainPart: 4,
    chainTotal: 5
  },
  {
    id: 'chain_newbie_5',
    name: 'Первое улучшение',
    description: 'Купите первое улучшение',
    icon: '⬆️',
    type: 'chain',
    objective: {
      type: 'upgrades',
      target: 1
    },
    reward: {
      type: 'crystals',
      amount: 1000
    },
    chainPart: 5,
    chainTotal: 5
  },
  
  // Цепочка "Исследователь"
  {
    id: 'chain_explorer_1',
    name: 'Десять тысяч',
    description: 'Накопите 10,000 кристаллов',
    icon: '💎',
    type: 'chain',
    objective: {
      type: 'crystals',
      target: 10000
    },
    reward: {
      type: 'crystals',
      amount: 5000
    },
    chainPart: 1,
    chainTotal: 5
  },
  {
    id: 'chain_explorer_2',
    name: 'Десять зданий',
    description: 'Постройте 10 зданий',
    icon: '🏗️',
    type: 'chain',
    objective: {
      type: 'buildings',
      target: 10
    },
    reward: {
      type: 'crystals',
      amount: 50000
    },
    chainPart: 2,
    chainTotal: 5
  },
  {
    id: 'chain_explorer_3',
    name: 'Сто тысяч',
    description: 'Накопите 100,000 кристаллов',
    icon: '💰',
    type: 'chain',
    objective: {
      type: 'crystals',
      target: 100000
    },
    reward: {
      type: 'crystals',
      amount: 500000
    },
    chainPart: 3,
    chainTotal: 5
  },
  {
    id: 'chain_explorer_4',
    name: 'Первое достижение',
    description: 'Получите первое достижение',
    icon: '🏆',
    type: 'chain',
    objective: {
      type: 'upgrades',
      target: 1
    },
    reward: {
      type: 'quantumShards',
      amount: 5
    },
    chainPart: 4,
    chainTotal: 5
  },
  {
    id: 'chain_explorer_5',
    name: 'Первый престиж',
    description: 'Совершите первый престиж',
    icon: '🌑',
    type: 'chain',
    objective: {
      type: 'prestige',
      target: 1
    },
    reward: {
      type: 'crystals',
      amount: 50000000
    },
    chainPart: 5,
    chainTotal: 5
  }
];