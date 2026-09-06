export interface Building {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number;
  maxCount?: number;
  specialEffect?: string;
  tier: 1 | 2 | 3 | 4 | 5;
}

export const tier1Buildings: Building[] = [
  {
    id: 'hand_drill',
    name: 'Ручной бур',
    icon: '🔧',
    description: 'Простой инструмент для добычи',
    baseCost: 15,
    costMultiplier: 1.15,
    baseProduction: 0.1,
    maxCount: 100,
    tier: 1,
  },
  {
    id: 'crystal_garden',
    name: 'Кристаллический сад',
    icon: '🌱',
    description: 'Выращивает кристаллы',
    baseCost: 250,
    costMultiplier: 1.15,
    baseProduction: 2,
    tier: 1,
  },
  {
    id: 'drone_scout',
    name: 'Дрон-разведчик',
    icon: '🤖',
    description: 'Автономный дрон для разведки',
    baseCost: 100,
    costMultiplier: 1.15,
    baseProduction: 1,
    specialEffect: '+1% к шансу золотых кристаллов за каждые 10 штук',
    tier: 1,
  },
  {
    id: 'solar_panel',
    name: 'Солнечная панель',
    icon: '☀️',
    description: 'Генерирует энергию для базы',
    baseCost: 500,
    costMultiplier: 1.15,
    baseProduction: 5,
    specialEffect: '+5 к максимуму энергии за каждые 5 штук',
    tier: 1,
  },
  {
    id: 'mini_robot',
    name: 'Мини-робот',
    icon: '🦾',
    description: 'Маленький помощник',
    baseCost: 750,
    costMultiplier: 1.15,
    baseProduction: 7,
    tier: 1,
  },
  {
    id: 'energy_condenser',
    name: 'Энергетический конденсатор',
    icon: '⚡',
    description: 'Конденсирует энергию',
    baseCost: 900,
    costMultiplier: 1.15,
    baseProduction: 9,
    tier: 1,
  },
];