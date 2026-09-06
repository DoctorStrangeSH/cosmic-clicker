import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../core/EventBus';
import { useGameStore } from '../core/GameState';

interface DungeonEnemy {
  id: number;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  damage: number;
  reward: {
    crystals: number;
    resources?: { type: string; amount: number }[];
  };
}

interface Dungeon {
  id: string;
  name: string;
  icon: string;
  description: string;
  level: number;
  enemies: DungeonEnemy[];
  boss: DungeonEnemy;
  requiredLevel: number;
}

export const DungeonView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDungeon, setCurrentDungeon] = useState<Dungeon | null>(null);
  const [currentEnemy, setCurrentEnemy] = useState<DungeonEnemy | null>(null);
  const [floor, setFloor] = useState(1);
  const [isBossFight, setIsBossFight] = useState(false);
  const [dungeonComplete, setDungeonComplete] = useState(false);
  
  const dungeons: Dungeon[] = [
    {
      id: 'crystal_caves',
      name: 'Кристальные пещеры',
      icon: '💎',
      description: 'Пещеры, полные кристаллов',
      level: 1,
      requiredLevel: 1,
      enemies: [
        {
          id: 1,
          name: 'Кристальный голем',
          icon: '🗿',
          health: 100,
          maxHealth: 100,
          damage: 10,
          reward: {
            crystals: 1000,
            resources: [{ type: 'crystal_shard', amount: 5 }]
          }
        },
        {
          id: 2,
          name: 'Кристальный страж',
          icon: '🛡️',
          health: 250,
          maxHealth: 250,
          damage: 20,
          reward: {
            crystals: 2500,
            resources: [{ type: 'crystal_shard', amount: 10 }]
          }
        }
      ],
      boss: {
        id: 3,
        name: 'Кристальный король',
        icon: '👑',
        health: 1000,
        maxHealth: 1000,
        damage: 50,
        reward: {
          crystals: 10000,
          resources: [{ type: 'quantum_crystal', amount: 1 }]
        }
      }
    },
    {
      id: 'lava_mines',
      name: 'Лавовые шахты',
      icon: '🌋',
      description: 'Опасные шахты с лавой',
      level: 2,
      requiredLevel: 10,
      enemies: [
        {
          id: 4,
          name: 'Огненный элементаль',
          icon: '🔥',
          health: 500,
          maxHealth: 500,
          damage: 30,
          reward: {
            crystals: 5000,
            resources: [{ type: 'iron_ore', amount: 15 }]
          }
        }
      ],
      boss: {
        id: 5,
        name: 'Магмовый лорд',
        icon: '🌋',
        health: 5000,
        maxHealth: 5000,
        damage: 100,
        reward: {
          crystals: 50000,
          resources: [{ type: 'plasma_core', amount: 3 }]
        }
      }
    }
  ];
  
  const startDungeon = (dungeonId: string) => {
    const dungeon = dungeons.find(d => d.id === dungeonId);
    if (!dungeon) return;
    
    setCurrentDungeon(dungeon);
    setFloor(1);
    setIsBossFight(false);
    setDungeonComplete(false);
    spawnEnemy(dungeon);
    setIsOpen(true);
  };
  
  const spawnEnemy = (dungeon: Dungeon) => {
    const enemy = dungeon.enemies[Math.min(floor - 1, dungeon.enemies.length - 1)];
    setCurrentEnemy({
      ...enemy,
      health: enemy.maxHealth * (1 + floor * 0.1)
    });
  };
  
  const attackEnemy = () => {
    if (!currentEnemy || !currentDungeon) return;
    
    const damage = 20 + (useGameStore.getState().multipliers.clickMultiplier * 10);
    
    setCurrentEnemy(prev => {
      if (!prev) return null;
      
      const newHealth = prev.health - damage;
      
      if (newHealth <= 0) {
        // Враг побеждён
        useGameStore.getState().addCrystals(prev.reward.crystals);
        
        if (prev.reward.resources) {
          prev.reward.resources.forEach(resource => {
            eventBus.emit('resource:collect', {
              resourceId: resource.type,
              amount: resource.amount
            });
          });
        }
        
        // Переход к следующему этажу или боссу
        setTimeout(() => {
          if (floor >= currentDungeon.enemies.length && !isBossFight) {
            // Пора сразиться с боссом
            setIsBossFight(true);
            setCurrentEnemy({
              ...currentDungeon.boss,
              health: currentDungeon.boss.maxHealth * 2
            });
          } else if (isBossFight) {
            // Подземелье пройдено
            setDungeonComplete(true);
            setCurrentEnemy(null);
          } else {
            // Следующий этаж
            setFloor(prevFloor => prevFloor + 1);
            spawnEnemy(currentDungeon);
          }
        }, 1000);
        
        return null;
      }
      
      return { ...prev, health: newHealth };
    });
  };
  
  return (
    <>
      <button 
        className="dungeon-toggle"
        onClick={() => setIsOpen(true)}
      >
        Подземелья 🏰
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dungeon-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="dungeon-header">
              <h3>Подземелья</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            {!currentDungeon ? (
              <div className="dungeon-list">
                {dungeons.map(dungeon => (
                  <div key={dungeon.id} className="dungeon-card">
                    <div className="dungeon-icon">{dungeon.icon}</div>
                    <div className="dungeon-info">
                      <h4>{dungeon.name}</h4>
                      <p>{dungeon.description}</p>
                      <small>Уровень {dungeon.level}+</small>
                    </div>
                    <button
                      onClick={() => startDungeon(dungeon.id)}
                      className="enter-dungeon"
                    >
                      Войти
                    </button>
                  </div>
                ))}
              </div>
            ) : dungeonComplete ? (
              <div className="dungeon-complete">
                <h3>Подземелье пройдено!</h3>
                <p>Вы победили {currentDungeon.boss.name}!</p>
                <button onClick={() => {
                  setCurrentDungeon(null);
                  setDungeonComplete(false);
                }}>
                  Вернуться
                </button>
              </div>
            ) : currentEnemy ? (
              <div className="dungeon-fight">
                <div className="dungeon-progress">
                  <p>Этаж {floor} {isBossFight ? '- БОСС' : ''}</p>
                </div>
                
                <motion.div
                  className="dungeon-enemy"
                  animate={{ 
                    x: [0, -10, 10, -10, 0],
                    scale: isBossFight ? [1, 1.2, 1] : [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity
                  }}
                  onClick={attackEnemy}
                >
                  <div className="enemy-icon">
                    {isBossFight ? '👑' : currentEnemy.icon}
                  </div>
                  <h3>{currentEnemy.name}</h3>
                  
                  <div className="health-bar">
                    <div 
                      className="health-fill"
                      style={{ 
                        width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` 
                      }}
                    />
                  </div>
                  
                  <p>HP: {Math.ceil(currentEnemy.health)} / {Math.ceil(currentEnemy.maxHealth)}</p>
                </motion.div>
                
                <motion.button
                  className="attack-button"
                  whileTap={{ scale: 0.9 }}
                  onClick={attackEnemy}
                >
                  Атаковать! 💥
                </motion.button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};