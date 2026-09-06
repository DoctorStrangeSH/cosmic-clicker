import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../core/EventBus';
import { useGameStore } from '../core/GameState';

interface GameEvent {
  id: number;
  type: 'positive' | 'negative' | 'neutral';
  name: string;
  description: string;
  icon: string;
  duration: number;
  effect: {
    type: string;
    multiplier?: number;
    value?: number;
  };
}

export const EventSystem: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [eventHistory, setEventHistory] = useState<GameEvent[]>([]);
  
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% шанс события
        triggerRandomEvent();
      }
    }, 300000); // Каждые 5 минут
    
    return () => clearInterval(eventInterval);
  }, []);
  
  const triggerRandomEvent = () => {
    const events: GameEvent[] = [
      {
        id: Date.now(),
        type: 'positive',
        name: 'Золотая лихорадка',
        description: 'x10 к золотым кристаллам',
        icon: '🌟',
        duration: 60,
        effect: { type: 'goldenMultiplier', multiplier: 10 }
      },
      {
        id: Date.now(),
        type: 'positive',
        name: 'Энергетический шторм',
        description: 'x5 к энергии',
        icon: '⚡',
        duration: 120,
        effect: { type: 'energyMultiplier', multiplier: 5 }
      },
      {
        id: Date.now(),
        type: 'positive',
        name: 'Квантовая аномалия',
        description: 'x3 ко всему',
        icon: '🔮',
        duration: 30,
        effect: { type: 'globalMultiplier', multiplier: 3 }
      },
      {
        id: Date.now(),
        type: 'negative',
        name: 'Солнечная вспышка',
        description: 'Половина энергии',
        icon: '☀️',
        duration: 10,
        effect: { type: 'energyHalf' }
      },
      {
        id: Date.now(),
        type: 'negative',
        name: 'Пиратская атака',
        description: 'Потеря 10% кристаллов',
        icon: '🏴‍☠️',
        duration: 5,
        effect: { type: 'crystalLoss', value: 0.1 }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    setActiveEvent(event);
    applyEventEffect(event);
    
    setTimeout(() => {
      removeEventEffect(event);
      setActiveEvent(null);
      setEventHistory(prev => [...prev, event]);
    }, event.duration * 1000);
  };
  
  const applyEventEffect = (event: GameEvent) => {
    const state = useGameStore.getState();
    
    switch (event.effect.type) {
      case 'globalMultiplier':
        state.multipliers.globalMultiplier *= event.effect.multiplier || 1;
        break;
      case 'energyHalf':
        useGameStore.setState((s) => {
          s.resources.energy = Math.floor(s.resources.energy / 2);
        });
        break;
      case 'crystalLoss':
        useGameStore.setState((s) => {
          s.resources.crystals *= (1 - (event.effect.value || 0));
        });
        break;
    }
  };
  
  const removeEventEffect = (event: GameEvent) => {
    const state = useGameStore.getState();
    
    switch (event.effect.type) {
      case 'globalMultiplier':
        state.multipliers.globalMultiplier /= event.effect.multiplier || 1;
        break;
    }
  };
  
  return (
    <AnimatePresence>
      {activeEvent && (
        <motion.div
          className={`event-notification ${activeEvent.type}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="event-icon">{activeEvent.icon}</div>
          <div className="event-info">
            <h4>{activeEvent.name}</h4>
            <p>{activeEvent.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};