import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CraftSystem } from '../systems/CraftSystem';
import { CraftRecipe } from '../config/craft/recipes';

export const CraftPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [craftSystem] = useState(() => new CraftSystem());
  const [recipes, setRecipes] = useState<CraftRecipe[]>([]);
  const [resources, setResources] = useState<Record<string, number>>({});
  
  useEffect(() => {
    setRecipes(craftSystem.getRecipes());
    setResources(craftSystem.getResources());
    
    const interval = setInterval(() => {
      setResources({...craftSystem.getResources()});
    }, 1000);
    
    return () => clearInterval(interval);
  }, [craftSystem]);
  
  const handleCraft = (recipeId: string) => {
    craftSystem.startCraft(recipeId);
    setResources({...craftSystem.getResources()});
  };
  
  const canCraft = (recipe: CraftRecipe) => {
    return recipe.ingredients.every(ingredient => {
      return (resources[ingredient.resourceId] || 0) >= ingredient.amount;
    });
  };
  
  return (
    <>
      <button 
        className="craft-toggle"
        onClick={() => setIsOpen(true)}
      >
        Крафт 🔨
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="craft-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="craft-header">
              <h3>Крафт предметов</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="resources-bar">
              {Object.entries(resources).map(([resourceId, amount]) => (
                <div key={resourceId} className="resource-chip">
                  <span>{getResourceIcon(resourceId)}</span>
                  <span>{amount}</span>
                </div>
              ))}
            </div>
            
            <div className="craft-list">
              {recipes.map(recipe => (
                <div key={recipe.id} className="craft-card">
                  <div className="craft-icon">{recipe.icon}</div>
                  <div className="craft-info">
                    <h4>{recipe.name}</h4>
                    <p>{recipe.description}</p>
                    <div className="ingredients">
                      {recipe.ingredients.map(ingredient => (
                        <span key={ingredient.resourceId} className="ingredient">
                          {getResourceIcon(ingredient.resourceId)} {ingredient.amount}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="craft-button"
                    onClick={() => handleCraft(recipe.id)}
                    disabled={!canCraft(recipe)}
                  >
                    Создать
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function getResourceIcon(resourceId: string): string {
  const icons: Record<string, string> = {
    crystal_shard: '💎',
    iron_ore: '⛏️',
    copper_wire: '🔌',
    silver_plate: '🥈',
    gold_ingot: '🥇',
    plasma_core: '⚡',
    quantum_crystal: '🔮',
    dark_essence: '🌑',
    star_core: '⭐',
    universal_fragment: '🌌'
  };
  return icons[resourceId] || '❓';
}