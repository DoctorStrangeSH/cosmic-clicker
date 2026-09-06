import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicSystem } from '../systems/MagicSystem';
import { Spell } from '../config/spells/spells';

export const MagicPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [magicSystem] = useState(() => new MagicSystem());
  const [spells, setSpells] = useState<Spell[]>([]);
  const [mana, setMana] = useState(100);
  const [maxMana, setMaxMana] = useState(100);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  
  useEffect(() => {
    setSpells(magicSystem.getSpells());
    
    const interval = setInterval(() => {
      setMana(magicSystem.getMana());
      setMaxMana(magicSystem.getMaxMana());
      
      const newCooldowns: Record<string, number> = {};
      spells.forEach(spell => {
        newCooldowns[spell.id] = magicSystem.getCooldown(spell.id);
      });
      setCooldowns(newCooldowns);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [magicSystem, spells]);
  
  const handleCast = (spellId: string) => {
    magicSystem.castSpell(spellId);
  };
  
  return (
    <>
      <button 
        className="magic-toggle"
        onClick={() => setIsOpen(true)}
      >
        Магия 🔮
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="magic-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="magic-header">
              <h3>Магия</h3>
              <div className="mana-bar">
                <div 
                  className="mana-fill"
                  style={{ width: `${(mana / maxMana) * 100}%` }}
                />
                <span>{Math.floor(mana)}/{maxMana}</span>
              </div>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="spell-list">
              {spells.map(spell => (
                <div key={spell.id} className="spell-card">
                  <div className="spell-icon">{spell.icon}</div>
                  <div className="spell-info">
                    <h4>{spell.name}</h4>
                    <p>{spell.description}</p>
                    <small>Мана: {spell.manaCost}</small>
                  </div>
                  <button
                    className="cast-spell"
                    onClick={() => handleCast(spell.id)}
                    disabled={
                      mana < spell.manaCost || 
                      (cooldowns[spell.id] || 0) > 0
                    }
                  >
                    {cooldowns[spell.id] > 0 ? 
                      `${Math.ceil(cooldowns[spell.id])}s` : 
                      'Использовать'
                    }
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