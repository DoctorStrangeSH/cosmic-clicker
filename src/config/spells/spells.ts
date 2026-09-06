export interface Spell {
  id: string;
  name: string;
  description: string;
  icon: string;
  manaCost: number;
  cooldown: number;
  school: 'crystal' | 'time' | 'space' | 'energy';
  effect: {
    type: 'damage' | 'heal' | 'boost' | 'teleport' | 'shield' | 'summon';
    value: number;
    duration?: number;
  };
}

export const spells: Spell[] = [
  {
    id: 'crystal_arrow',
    name: 'Кристальная стрела',
    description: 'Наносит урон врагу',
    icon: '🏹',
    manaCost: 10,
    cooldown: 5,
    school: 'crystal',
    effect: {
      type: 'damage',
      value: 100
    }
  },
  {
    id: 'crystal_shield',
    name: 'Кристальный щит',
    description: 'Защищает от урона',
    icon: '🛡️',
    manaCost: 20,
    cooldown: 30,
    school: 'crystal',
    effect: {
      type: 'shield',
      value: 500,
      duration: 60
    }
  },
  {
    id: 'time_acceleration',
    name: 'Ускорение времени',
    description: 'x2 к производству на 30 секунд',
    icon: '⏰',
    manaCost: 30,
    cooldown: 60,
    school: 'time',
    effect: {
      type: 'boost',
      value: 2,
      duration: 30
    }
  },
  {
    id: 'time_loop',
    name: 'Временная петля',
    description: 'Возвращает 10% потраченных кристаллов',
    icon: '🔄',
    manaCost: 50,
    cooldown: 120,
    school: 'time',
    effect: {
      type: 'boost',
      value: 0.10,
      duration: 60
    }
  },
  {
    id: 'teleport',
    name: 'Телепортация',
    description: 'Мгновенный сбор ресурсов',
    icon: '🌀',
    manaCost: 40,
    cooldown: 30,
    school: 'space',
    effect: {
      type: 'teleport',
      value: 1
    }
  },
  {
    id: 'energy_bolt',
    name: 'Энергетическая молния',
    description: 'Мощная атака энергией',
    icon: '⚡',
    manaCost: 75,
    cooldown: 45,
    school: 'energy',
    effect: {
      type: 'damage',
      value: 1000
    }
  }
];