export interface Planet {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockCost: number;
  productionMultiplier: number;
  clickMultiplier: number;
  specialEffects: string[];
  buildings: string[]; // ID зданий, доступных на планете
  visualTheme: {
    background: string;
    planetColor: string;
    atmosphere: string;
  };
  evolutionLevels: {
    crystals: number;
    visualChanges: string[];
    description: string;
  }[];
}

export const CrystallisX9: Planet = {
  id: 'crystallis_x9',
  name: 'Кристаллис-X9',
  icon: '💎',
  description: 'Загадочная планета, богатая энергетическими кристаллами',
  unlockCost: 0,
  productionMultiplier: 1,
  clickMultiplier: 1,
  specialEffects: [],
  buildings: [
    'hand_drill',
    'crystal_garden',
    'drone_scout',
    'solar_panel',
    'mini_robot',
    'energy_condenser',
  ],
  visualTheme: {
    background: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a3e 100%)',
    planetColor: '#4a4a8a',
    atmosphere: 'rgba(100, 100, 200, 0.3)',
  },
  evolutionLevels: [
    {
      crystals: 0,
      visualChanges: ['Пустынная каменистая поверхность'],
      description: 'Пустынная каменистая планета',
    },
    {
      crystals: 1000,
      visualChanges: ['Появляются кристаллические образования'],
      description: 'Начинают появляться кристаллы',
    },
    {
      crystals: 1000000,
      visualChanges: ['Планета светится энергией'],
      description: 'Планета наполняется энергией',
    },
    {
      crystals: 1000000000,
      visualChanges: ['Орбитальные кольца из кристаллов'],
      description: 'Кристаллы образуют орбитальные кольца',
    },
    {
      crystals: 1000000000000,
      visualChanges: ['Планета превращается в энергетическое существо'],
      description: 'Планета становится энергетическим существом',
    },
  ],
};