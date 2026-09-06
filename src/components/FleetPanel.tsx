import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';

export const FleetPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const crystals = useGameStore(state => state.resources.crystals);
  const ships = useGameStore(state => state.ships);
  
  const shipList = [
    { id: 'scout_swift', name: 'Разведчик "Стриж"', icon: '🔍', cost: 10000 },
    { id: 'miner_small', name: 'Малый шахтёр', icon: '⛏️', cost: 50000 },
    { id: 'fighter', name: 'Истребитель', icon: '⚔️', cost: 100000 }
  ];
  
  const handlePurchase = (shipId: string) => {
    eventBus.emit('ship:purchase', { shipId });
  };
  
  const handleMission = (shipId: string, missionType: string) => {
    eventBus.emit('ship:mission', { shipId, missionType });
  };
  
  return (
    <>
      <button 
        className="fleet-toggle"
        onClick={() => setIsOpen(true)}
      >
        Флот 🚀
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fleet-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="fleet-header">
              <h3>Космический флот</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="fleet-list">
              {shipList.map(ship => (
                <div key={ship.id} className="ship-card">
                  <div className="ship-icon">{ship.icon}</div>
                  <div className="ship-info">
                    <h4>{ship.name}</h4>
                    <p>Стоимость: {ship.cost} 💎</p>
                    {ships[ship.id] ? (
                      <div className="ship-actions">
                        <button onClick={() => handleMission(ship.id, 'recon')}>
                          Разведка
                        </button>
                        <button onClick={() => handleMission(ship.id, 'mine')}>
                          Добыча
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="buy-ship"
                        onClick={() => handlePurchase(ship.id)}
                        disabled={crystals < ship.cost}
                      >
                        Купить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};