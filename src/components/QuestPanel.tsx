import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestSystem } from '../systems/QuestSystem';
import { Quest } from '../config/quests/dailyQuests';

export const QuestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [questSystem] = useState(() => new QuestSystem());
  const [quests, setQuests] = useState<Quest[]>([]);
  
  useEffect(() => {
    setQuests(questSystem.getActiveQuests());
    
    const interval = setInterval(() => {
      setQuests([...questSystem.getActiveQuests()]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [questSystem]);
  
  const getProgress = (quest: Quest) => {
    const current = questSystem.getQuestProgress(quest);
    return Math.min(current / quest.objective.target * 100, 100);
  };
  
  return (
    <>
      <button 
        className="quest-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Квесты 📋
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="quest-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="quest-header">
              <h3>Активные квесты</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="quest-list">
              {quests.map(quest => (
                <div key={quest.id} className="quest-card">
                  <div className="quest-icon">{quest.icon}</div>
                  <div className="quest-info">
                    <h4>{quest.name}</h4>
                    <p>{quest.description}</p>
                    <div className="quest-progress">
                      <div 
                        className="progress-bar"
                        style={{ width: `${getProgress(quest)}%` }}
                      />
                    </div>
                    <small>
                      {Math.floor(getProgress(quest))}% выполнено
                    </small>
                  </div>
                  <div className="quest-reward">
                    {quest.reward.type === 'crystals' ? '💎' : 
                     quest.reward.type === 'quantumShards' ? '🔮' : 
                     quest.reward.type === 'starDust' ? '✨' : '⚡'}
                    {quest.reward.amount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};