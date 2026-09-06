import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Pet } from '../config/pets/commonPets';

export const PetPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  const crystals = useGameStore(state => state.resources.crystals);
  const ownedPets = useGameStore(state => state.pets);
  
  const handlePurchase = (petId: string) => {
    eventBus.emit('pet:purchase', { petId });
  };
  
  const handleFeed = (petId: string) => {
    eventBus.emit('pet:feed', { petId, foodAmount: 10 });
  };
  
  const getPetLevel = (petId: string): number => {
    return ownedPets[petId] || 0;
  };
  
  return (
    <>
      <button 
        className="pet-toggle"
        onClick={() => setIsOpen(true)}
      >
        Питомцы 🐾
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="pet-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="pet-header">
              <h3>Космические питомцы</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="pet-grid">
              {/* Здесь должны отображаться питомцы */}
              <div className="pet-card">
                <div className="pet-icon">🐹</div>
                <h4>Космический хомяк</h4>
                <p>+1% к кликам</p>
                <button onClick={() => handlePurchase('space_hamster')}>
                  Купить за 1000 💎
                </button>
              </div>
              
              <div className="pet-card">
                <div className="pet-icon">🐱</div>
                <h4>Звёздный кот</h4>
                <p>+1% к производству</p>
                <button onClick={() => handlePurchase('star_cat')}>
                  Купить за 5000 💎
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};