import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Upgrade } from '../config/upgrades/clickUpgrades';
import { clickUpgrades } from '../config/upgrades/clickUpgrades';
import { critUpgrades } from '../config/upgrades/critUpgrades';
import { productionUpgrades } from '../config/upgrades/productionUpgrades';
import { autoUpgrades } from '../config/upgrades/autoUpgrades';

export const UpgradePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'click' | 'crit' | 'production' | 'auto'>('click');
  const [isOpen, setIsOpen] = useState(false);
  
  const crystals = useGameStore(state => state.resources.crystals);
  const upgrades = useGameStore(state => state.upgrades);
  
  const getUpgradesByTab = () => {
    switch (activeTab) {
      case 'click': return clickUpgrades;
      case 'crit': return critUpgrades;
      case 'production': return productionUpgrades;
      case 'auto': return autoUpgrades;
      default: return [];
    }
  };
  
  const handlePurchase = (upgradeId: string) => {
    eventBus.emit('upgrade:purchase', { upgradeId });
  };
  
  const canAfford = (upgrade: Upgrade) => {
    return crystals >= upgrade.cost && !upgrades[upgrade.id];
  };
  
  return (
    <>
      <button 
        className="upgrade-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Улучшения 🚀
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="upgrade-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="upgrade-tabs">
              <button 
                className={activeTab === 'click' ? 'active' : ''}
                onClick={() => setActiveTab('click')}
              >
                Клик 👆
              </button>
              <button 
                className={activeTab === 'crit' ? 'active' : ''}
                onClick={() => setActiveTab('crit')}
              >
                Крит 💥
              </button>
              <button 
                className={activeTab === 'production' ? 'active' : ''}
                onClick={() => setActiveTab('production')}
              >
                Производство ⚙️
              </button>
              <button 
                className={activeTab === 'auto' ? 'active' : ''}
                onClick={() => setActiveTab('auto')}
              >
                Авто 🤖
              </button>
            </div>
            
            <div className="upgrade-list">
              {getUpgradesByTab().map(upgrade => (
                <motion.div
                  key={upgrade.id}
                  className={`upgrade-card ${canAfford(upgrade) ? 'affordable' : 'expensive'}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePurchase(upgrade.id)}
                >
                  <div className="upgrade-icon">{upgrade.icon}</div>
                  <div className="upgrade-info">
                    <h4>{upgrade.name}</h4>
                    <p>{upgrade.description}</p>
                    {upgrade.requires && (
                      <p className="requires">
                        Требуется: {upgrade.requires.map(id => 
                          upgrades[id] ? '✅' : '❌'
                        ).join(' ')}
                      </p>
                    )}
                  </div>
                  <div className="upgrade-cost">
                    💎 {upgrade.cost.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};