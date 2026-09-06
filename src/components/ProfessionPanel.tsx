import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessionSystem } from '../systems/ProfessionSystem';
import { Profession } from '../config/professions/professions';

export const ProfessionPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [professionSystem] = useState(() => new ProfessionSystem());
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  
  useEffect(() => {
    setProfessions(professionSystem.getProfessions());
  }, [professionSystem]);
  
  const getProfessionProgress = (professionId: string) => {
    const state = professionSystem.getProfessionState(professionId);
    if (!state) return 0;
    
    const expNeeded = state.level * 100;
    return Math.min((state.experience / expNeeded) * 100, 100);
  };
  
  return (
    <>
      <button 
        className="profession-toggle"
        onClick={() => setIsOpen(true)}
      >
        Профессии 👷
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profession-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="profession-header">
              <h3>Профессии</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="profession-list">
              {professions.map(profession => {
                const state = professionSystem.getProfessionState(profession.id);
                const totalBonus = professionSystem.getTotalBonus(profession.id);
                
                return (
                  <div 
                    key={profession.id} 
                    className="profession-card"
                    onClick={() => setSelectedProfession(profession)}
                  >
                    <div className="profession-icon">{profession.icon}</div>
                    <div className="profession-info">
                      <h4>{profession.name}</h4>
                      <p>{profession.description}</p>
                      <div className="profession-level">
                        Уровень: {state?.level || 1}
                      </div>
                      <div className="profession-bonus">
                        Бонус: +{(totalBonus * 100).toFixed(1)}%
                      </div>
                      <div className="profession-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${getProfessionProgress(profession.id)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <AnimatePresence>
              {selectedProfession && (
                <motion.div
                  className="skills-panel"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                >
                  <div className="skills-header">
                    <h4>{selectedProfession.name} - Навыки</h4>
                    <button onClick={() => setSelectedProfession(null)}>←</button>
                  </div>
                  
                  <div className="skills-list">
                    {selectedProfession.skills.map(skill => {
                      const state = professionSystem.getProfessionState(selectedProfession.id);
                      const isUnlocked = state?.skillsUnlocked.includes(skill.id);
                      
                      return (
                        <div 
                          key={skill.id} 
                          className={`skill-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                        >
                          <div className="skill-icon">{skill.icon}</div>
                          <div className="skill-info">
                            <h5>{skill.name}</h5>
                            <p>{skill.description}</p>
                            <small>
                              Требуемый уровень: {skill.unlockLevel}
                            </small>
                          </div>
                          <div className="skill-status">
                            {isUnlocked ? '✅' : '🔒'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};