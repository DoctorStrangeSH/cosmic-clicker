import React from 'react';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { commonPets } from '../config/pets/commonPets';
import { rarePets } from '../config/pets/rarePets';
import { epicPets } from '../config/pets/epicPets';
import { legendaryPets } from '../config/pets/legendaryPets';

export const PetPanel: React.FC = () => {
  const crystals = useGameStore(state => state.resources.crystals);
  const ownedPets = useGameStore(state => state.pets);
  
  const allPets = [...commonPets, ...rarePets, ...epicPets, ...legendaryPets];
  
  const handlePurchase = (petId: string) => {
    eventBus.emit('pet:purchase', { petId });
  };
  
  return (
    <div className="pet-grid">
      {allPets.map(pet => (
        <div key={pet.id} className="pet-card">
          <div className="pet-icon">{pet.icon}</div>
          <h4>{pet.name}</h4>
          <p>{pet.description}</p>
          {ownedPets[pet.id] ? (
            <p>Уровень: {ownedPets[pet.id]}</p>
          ) : (
            <button 
              onClick={() => handlePurchase(pet.id)}
              disabled={crystals < pet.cost}
            >
              {pet.cost.toLocaleString()} 💎
            </button>
          )}
        </div>
      ))}
    </div>
  );
};