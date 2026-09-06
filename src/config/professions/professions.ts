export interface Profession {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseBonus: number;
  bonusPerLevel: number;
  skills: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockLevel: number;
    type: 'active' | 'passive' | 'special';
    effect: {
      type: string;
      value: number;
    };
  }[];
}

export const professions: Profession[] = [
  {
    id: 'miner',
    name: 'Шахтёр',
    description: 'Специалист по добыче кристаллов',
    icon: '⛏️',
    maxLevel: 100,
    baseBonus: 0.01,
    bonusPerLevel: 0.01,
    skills: [
      {
        id: 'efficient_mining',
        name: 'Эффективная добыча',
        description: '+10% к добыче',
        icon: '💎',
        unlockLevel: 10,
        type: 'passive',
        effect: { type: 'productionBoost', value: 1.1 }
      },
      {
        id: 'crystal_vision',
        name: 'Кристальное зрение',
        description: 'Находит дополнительные кристаллы',
        icon: '👁️',
        unlockLevel: 25,
        type: 'active',
        effect: { type: 'clickBoost', value: 2 }
      },
      {
        id: 'deep_mining',
        name: 'Глубинная добыча',
        description: 'x2 к производству шахт',
        icon: '🕳️',
        unlockLevel: 50,
        type: 'special',
        effect: { type: 'productionMultiplier', value: 2 }
      }
    ]
  },
  {
    id: 'engineer',
    name: 'Инженер',
    description: 'Специалист по строительству',
    icon: '🔧',
    maxLevel: 100,
    baseBonus: 0.01,
    bonusPerLevel: 0.01,
    skills: [
      {
        id: 'efficient_building',
        name: 'Эффективное строительство',
        description: '-10% к стоимости зданий',
        icon: '🏗️',
        unlockLevel: 10,
        type: 'passive',
        effect: { type: 'buildingCostReduction', value: 0.1 }
      },
      {
        id: 'auto_repair',
        name: 'Автоматический ремонт',
        description: 'Автоматически чинит здания',
        icon: '🔨',
        unlockLevel: 25,
        type: 'passive',
        effect: { type: 'autoRepair', value: 1 }
      },
      {
        id: 'master_builder',
        name: 'Мастер-строитель',
        description: 'x2 к производству зданий',
        icon: '👷',
        unlockLevel: 50,
        type: 'special',
        effect: { type: 'buildingProductionMultiplier', value: 2 }
      }
    ]
  },
  {
    id: 'scientist',
    name: 'Учёный',
    description: 'Специалист по исследованиям',
    icon: '🔬',
    maxLevel: 100,
    baseBonus: 0.01,
    bonusPerLevel: 0.01,
    skills: [
      {
        id: 'research_speed',
        name: 'Скорость исследования',
        description: '+25% к скорости исследований',
        icon: '📚',
        unlockLevel: 10,
        type: 'passive',
        effect: { type: 'researchSpeed', value: 1.25 }
      },
      {
        id: 'quantum_analysis',
        name: 'Квантовый анализ',
        description: 'Находит квантовые осколки',
        icon: '🔮',
        unlockLevel: 25,
        type: 'active',
        effect: { type: 'quantumFind', value: 1 }
      },
      {
        id: 'breakthrough',
        name: 'Научный прорыв',
        description: 'x2 к очкам исследований',
        icon: '💡',
        unlockLevel: 50,
        type: 'special',
        effect: { type: 'researchMultiplier', value: 2 }
      }
    ]
  },
  {
    id: 'trader',
    name: 'Торговец',
    description: 'Специалист по торговле',
    icon: '💰',
    maxLevel: 100,
    baseBonus: 0.01,
    bonusPerLevel: 0.01,
    skills: [
      {
        id: 'negotiation',
        name: 'Переговоры',
        description: '+10% к ценам продажи',
        icon: '🤝',
        unlockLevel: 10,
        type: 'passive',
        effect: { type: 'sellPriceBoost', value: 1.1 }
      },
      {
        id: 'market_analysis',
        name: 'Анализ рынка',
        description: 'Видит выгодные сделки',
        icon: '📊',
        unlockLevel: 25,
        type: 'active',
        effect: { type: 'marketInsight', value: 1 }
      },
      {
        id: 'trade_empire',
        name: 'Торговая империя',
        description: 'x2 к доходу от торговли',
        icon: '👑',
        unlockLevel: 50,
        type: 'special',
        effect: { type: 'tradeIncomeMultiplier', value: 2 }
      }
    ]
  },
  {
    id: 'warrior',
    name: 'Воин',
    description: 'Специалист по сражениям',
    icon: '⚔️',
    maxLevel: 100,
    baseBonus: 0.01,
    bonusPerLevel: 0.01,
    skills: [
      {
        id: 'combat_training',
        name: 'Боевая подготовка',
        description: '+10% к урону',
        icon: '🥊',
        unlockLevel: 10,
        type: 'passive',
        effect: { type: 'damageBoost', value: 1.1 }
      },
      {
        id: 'berserk',
        name: 'Берсерк',
        description: 'x3 к урону на 10 секунд',
        icon: '😤',
        unlockLevel: 25,
        type: 'active',
        effect: { type: 'berserkMode', value: 3 }
      },
      {
        id: 'war_master',
        name: 'Мастер войны',
        description: 'x2 к наградам за бой',
        icon: '🏆',
        unlockLevel: 50,
        type: 'special',
        effect: { type: 'combatRewardMultiplier', value: 2 }
      }
    ]
  }
];