import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../core/GameState';

export const Planet: React.FC = () => {
  const crystals = useGameStore(state => state.resources.crystals);
  
  const getEvolutionLevel = () => {
    if (crystals >= 1_000_000_000_000) return 5;
    if (crystals >= 1_000_000_000) return 4;
    if (crystals >= 1_000_000) return 3;
    if (crystals >= 1_000) return 2;
    return 1;
  };
  
  const evolutionLevel = getEvolutionLevel();
  
  return (
    <div className="planet-container">
      <motion.div
        className="planet"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`planet-surface level-${evolutionLevel}`} />
      </motion.div>
    </div>
  );
};