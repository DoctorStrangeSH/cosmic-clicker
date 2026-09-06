import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundSystem } from '../systems/SoundSystem';
import { SaveSystem } from '../core/SaveSystem';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [soundSystem] = useState(() => new SoundSystem());
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundSystem.setVolume(newVolume);
  };
  
  const handleMuteToggle = () => {
    soundSystem.toggleMute();
    setIsMuted(soundSystem.isMutedState());
  };
  
  const handleSave = () => {
    const saveSystem = new SaveSystem();
    saveSystem.save();
  };
  
  const handleReset = () => {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
      const saveSystem = new SaveSystem();
      saveSystem.reset();
    }
  };
  
  return (
    <>
      <button 
        className="settings-toggle"
        onClick={() => setIsOpen(true)}
      >
        ⚙️
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="settings-panel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="settings-header">
              <h3>Настройки</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="settings-content">
              <div className="setting-item">
                <label>Громкость</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <span>{Math.round(volume * 100)}%</span>
              </div>
              
              <div className="setting-item">
                <label>Звук</label>
                <button onClick={handleMuteToggle}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
              
              <div className="setting-item">
                <button onClick={handleSave}>
                  💾 Сохранить
                </button>
              </div>
              
              <div className="setting-item danger">
                <button onClick={handleReset}>
                  🗑️ Сбросить прогресс
                </button>
              </div>
              
              <div className="settings-info">
                <p>Версия: 2.0.0</p>
                <p>Сделано с ❤️ для Telegram</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};