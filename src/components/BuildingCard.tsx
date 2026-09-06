import React from 'react';
import { motion } from 'framer-motion';
import { Building } from '../config/buildings/tier1';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';

interface BuildingCardProps {
  building: Building;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building }) => {
  const count = useGameStore(state => state.buildings[building.id] || 0);
  const crystals = useGameStore(state => state.resources.crystals);
  
  const cost = Math.ceil(
    building.baseCost * Math.pow(building.costMultiplier, count)
  );
  
  const canAfford = crystals >= cost;
  
  const handlePurchase = () => {
    eventBus.emit('building:purchase', { buildingId: building.id });
  };
  
  return (
    <motion.div
      className={`building-card ${canAfford ? 'affordable' : 'expensive'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePurchase}
    >
      <div className="building-icon">{building.icon}</div>
      <div className="building-info">
        <h3>{building.name}</h3>
        <p>{building.description}</p>
        {building.specialEffect && (
          <p className="special-effect">✨ {building.specialEffect}</p>
        )}
      </div>
      <div className="building-stats">
        <div className="cost">💎 {cost}</div>
        <div className="count">x{count}</div>
        {building.maxCount && (
          <div className="max-count">Макс: {building.maxCount}</div>
        )}
      </div>
    </motion.div>
  );
};