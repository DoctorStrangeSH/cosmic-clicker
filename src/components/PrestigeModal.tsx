import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';

export const PrestigeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const crystals = useGameStore(state => state.resources.crystals);
  const darkMatter = useGameStore(state => state.resources.darkMatter);
  const totalPrestiges = useGameStore(state => state.stats.totalPrestiges);
  
  const calculatePrestigeGain = () => {
    if (crystals < 1_000_000) return 0;
    return Math.floor(Math.sqrt(crystals / 1_000_000));
  };
  
  const prestigeGain = calculatePrestigeGain();
  
  const handlePrestige = () => {
    if (prestigeGain > 0) {
      useGameStore.getState().resetForPrestige();
      setIsOpen(false);
    }
  };
  
  return (
    <>
      <button 
        className="prestige-toggle"
        onClick={() => setIsOpen(true)}
      >
        Престиж 🌑
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="prestige-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="prestige-content">
              <h2>Перерождение</h2>
              
              <div className="prestige-info">
                <p>Тёмная материя: {darkMatter.toFixed(1)} 🌑</p>
                <p>Всего престижей: {totalPrestiges}</p>
                <p>Текущий бонус: +{(darkMatter * 10).toFixed(1)}% к производству</p>
              </div>
              
              <div className="prestige-gain">
                <h3>Вы получите:</h3>
                <p className="gain-amount">+{prestigeGain} 🌑</p>
                <p>Новый бонус: +{((darkMatter + prestigeGain) * 10).toFixed(1)}% к производству</p>
              </div>
              
              <div className="prestige-warning">
                <p>⚠️ Будут сброшены:</p>
                <ul>
                  <li>Кристаллы</li>
                  <li>Здания</li>
                  <li>Улучшения</li>
                </ul>
                <p>✅ Останется:</p>
                <ul>
                  <li>Тёмная материя</li>
                  <li>Достижения</li>
                  <li>Статистика</li>
                </ul>
              </div>
              
              <div className="prestige-actions">
                <button 
                  className="cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Отмена
                </button>
                <button 
                  className="confirm"
                  onClick={handlePrestige}
                  disabled={prestigeGain === 0}
                >
                  Переродиться
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};