import React from 'react';
import { useGameStore } from '../core/GameState';
import { BuildingCard } from './BuildingCard';
import { tier1Buildings } from '../config/buildings/tier1';

export const BuildingPanel: React.FC = () => {
  return (
    <div className="building-panel">
      {tier1Buildings.map(building => (
        <BuildingCard key={building.id} building={building} />
      ))}
    </div>
  );
};