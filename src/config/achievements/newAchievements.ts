import { Achievement } from '../achievements/clickAchievements';

export const collectionAchievements: Achievement[] = [
  {
    id: 'collect_pets_10',
    name: 'Коллекционер питомцев',
    description: 'Соберите 10 питомцев',
    icon: '🐾',
    condition: (state) => Object.keys(state.pets).length >= 10,
    reward: { type: 'quantumShards', amount: 10 },
    category: 'collection'
  },
  {
    id: 'collect_ships_10',
    name: 'Адмирал',
    description: 'Соберите 10 кораблей',
    icon: '🚀',
    condition: (state) => Object.keys(state.ships).length >= 10,
    reward: { type: 'quantumShards', amount: 15 },
    category: 'collection'
  },
  {
    id: 'collect_achievements_100',
    name: 'Охотник за достижениями',
    description: 'Получите 100 достижений',
    icon: '🏆',
    condition: (state) => Object.keys(state.achievements).length >= 100,
    reward: { type: 'quantumShards', amount: 50 },
    category: 'collection'
  }
];

export const socialAchievements: Achievement[] = [
  {
    id: 'social_friend_1',
    name: 'Дружелюбный',
    description: 'Добавьте первого друга',
    icon: '🤝',
    condition: (state) => state.stats.totalPrestiges >= 0, // Заглушка
    reward: { type: 'crystals', amount: 1000 },
    category: 'social'
  },
  {
    id: 'social_clan_join',
    name: 'Член клана',
    description: 'Вступите в клан',
    icon: '🛡️',
    condition: (state) => state.stats.totalPrestiges >= 0, // Заглушка
    reward: { type: 'crystals', amount: 5000 },
    category: 'social'
  }
];

export const timeAchievements: Achievement[] = [
  {
    id: 'time_1hour',
    name: 'Час в космосе',
    description: 'Играйте 1 час',
    icon: '⏰',
    condition: (state) => state.stats.playTime >= 3600,
    reward: { type: 'crystals', amount: 10000 },
    category: 'time'
  },
  {
    id: 'time_24hours',
    name: 'Сутки в космосе',
    description: 'Играйте 24 часа',
    icon: '📅',
    condition: (state) => state.stats.playTime >= 86400,
    reward: { type: 'quantumShards', amount: 5 },
    category: 'time'
  }
];

export const secretAchievements: Achievement[] = [
  {
    id: 'secret_click_1000_times',
    name: 'Тысяча кликов',
    description: 'Сделайте 1000 кликов за минуту',
    icon: '⚡',
    condition: (state) => state.stats.currentCombo >= 1000,
    reward: { type: 'quantumShards', amount: 100 },
    category: 'secret',
    secret: true
  },
  {
    id: 'secret_prestige_100',
    name: 'Престижный',
    description: 'Совершите 100 престижей',
    icon: '🌑',
    condition: (state) => state.stats.totalPrestiges >= 100,
    reward: { type: 'darkMatter', amount: 100 },
    category: 'secret',
    secret: true
  }
];