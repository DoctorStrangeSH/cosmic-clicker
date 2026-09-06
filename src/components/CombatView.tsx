import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../core/EventBus';
import { useGameStore } from '../core/GameState';

interface Enemy {
  id: number;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  damage: number;
  reward: {
    crystals: number;
  };
}

export const CombatView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [wave, setWave] = useState(0);
  const [score, setScore] = useState(0);
  
  const enemies: Enemy[] = [
    {
      id: 1,
      name: 'Космический пират',
      icon: '🏴‍☠️',
      health: 100,
      maxHealth: 100,
      damage: 10,
      reward: { crystals: 1000 }
    },
    {
      id: 2,
      name: 'Астероидный монстр',
      icon: '👾',
      health: 500,
      maxHealth: 500,
      damage: 25,
      reward: { crystals: 5000 }
    },
    {
      id: 3,
      name: 'Кристальный голем',
      icon: '🗿',
      health: 2000,
      maxHealth: 2000,
      damage: 50,
      reward: { crystals: 20000 }
    },
    {
      id: 4,
      name: 'Тёмная сущность',
      icon: '👻',
      health: 10000,
      maxHealth: 10000,
      damage: 100,
      reward: { crystals: 100000 }
    }
  ];
  
  const startCombat = () => {
    setWave(1);
    setScore(0);
    spawnEnemy();
    setIsOpen(true);
  };
  
  const spawnEnemy = () => {
    const enemy = enemies[Math.min(wave, enemies.length - 1)];
    setCurrentEnemy({
      ...enemy,
      id: Date.now(),
      health: enemy.maxHealth * (1 + wave * 0.5)
    });
  };
  
  const attackEnemy = () => {
    if (!currentEnemy) return;
    
    const damage = 10 + (useGameStore.getState().multipliers.clickMultiplier * 5);
    
    setCurrentEnemy(prev => {
      if (!prev) return null;
      
      const newHealth = prev.health - damage;
      
      if (newHealth <= 0) {
        // Враг побеждён
        useGameStore.getState().addCrystals(prev.reward.crystals);
        setScore(prevScore => prevScore + 1);
        
        // Следующая волна
        setTimeout(() => {
          setWave(prevWave => prevWave + 1);
          spawnEnemy();
        }, 1000);
        
        return null;
      }
      
      return { ...prev, health: newHealth };
    });
  };
  
  return (
    <>
      <button 
        className="combat-toggle"
        onClick={startCombat}
      >
        Битва ⚔️
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="combat-view"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="combat-header">
              <h3>Волна {wave}</h3>
              <h4>Счёт: {score}</h4>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            {currentEnemy ? (
              <div className="combat-area">
                <motion.div
                  className="enemy"
                  animate={{ 
                    x: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity
                  }}
                  onClick={attackEnemy}
                >
                  <div className="enemy-icon">{currentEnemy.icon}</div>
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
            ) : (
              <div className="wave-complete">
                <h3>Волна {wave - 1} пройдена!</h3>
                <p>Подготовка к следующей волне...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};