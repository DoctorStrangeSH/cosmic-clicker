import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../core/EventBus';
import { useGameStore } from '../core/GameState';

export const GoldenCrystal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(10);
  
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      // Шанс появления 30-120 секунд
      if (Math.random() < 0.5) { // 50% шанс для теста
        spawnGoldenCrystal();
      }
    }, 30000); // Проверяем каждые 30 секунд
    
    return () => clearInterval(spawnInterval);
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsVisible(false);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isVisible]);
  
  const spawnGoldenCrystal = () => {
    setPosition({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    });
    setTimeLeft(10);
    setIsVisible(true);
  };
  
  const handleClick = () => {
    const state = useGameStore.getState();
    const clickValue = state.multipliers.clickMultiplier;
    const bonus = clickValue * 50; // x50 от текущего клика
    
    state.addCrystals(bonus);
    eventBus.emit('golden_crystal:collected', { value: bonus });
    setIsVisible(false);
    setTimeLeft(10);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="golden-crystal"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: 1, 
            rotate: 360,
            opacity: timeLeft <= 3 ? [1, 0.5, 1] : 1
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            duration: 0.5,
            opacity: timeLeft <= 3 ? {
              duration: 0.5,
              repeat: Infinity
            } : {}
          }}
          onClick={handleClick}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💎
          </motion.div>
          <div className="golden-timer">
            {timeLeft}s
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};