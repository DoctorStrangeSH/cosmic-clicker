import React from 'react';
import { useGameStore } from '../core/GameState';

export const ResourceDisplay: React.FC = () => {
  const crystals = useGameStore(state => state.resources.crystals);
  const energy = useGameStore(state => state.resources.energy);
  const maxEnergy = useGameStore(state => state.resources.maxEnergy);
  const darkMatter = useGameStore(state => state.resources.darkMatter);
  const starDust = useGameStore(state => state.resources.starDust);
  
  return (
    <div className="resource-display">
      <div className="resource">
        <span className="resource-icon">💎</span>
        <span>{crystals.toFixed(1)}</span>
      </div>
      <div className="resource">
        <span className="resource-icon">⚡</span>
        <span>{energy.toFixed(0)}/{maxEnergy}</span>
      </div>
      <div className="resource">
        <span className="resource-icon">🌑</span>
        <span>{darkMatter.toFixed(0)}</span>
      </div>
      <div className="resource">
        <span className="resource-icon">✨</span>
        <span>{starDust}</span>
      </div>
    </div>
  );
};