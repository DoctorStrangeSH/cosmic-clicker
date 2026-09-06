import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveSystem } from '../core/SaveSystem';

interface OfflineEarningsModalProps {
  saveSystem: SaveSystem;
}

export const OfflineEarningsModal: React.FC<OfflineEarningsModalProps> = ({ saveSystem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [earnings, setEarnings] = useState({ seconds: 0, crystals: 0 });
  const [isClaimed, setIsClaimed] = useState(false);
  
  useEffect(() => {
    // Проверяем оффлайн-заработок при загрузке
    const offlineEarnings = saveSystem.calculateOfflineEarnings();
    
    if (offlineEarnings.crystals > 0) {
      setEarnings(offlineEarnings);
      setIsOpen(true);
    }
  }, [saveSystem]);
  
  const handleClaim = () => {
    saveSystem.applyOfflineEarnings();
    setIsClaimed(true);
    
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    if (minutes > 0) {
      return `${minutes}м ${secs}с`;
    }
    return `${secs}с`;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="offline-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="offline-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {!isClaimed ? (
              <>
                <div className="offline-icon">🌙</div>
                <h2>Пока вас не было...</h2>
                <p className="offline-text">
                  Ваши здания работали <strong>{formatTime(earnings.seconds)}</strong>
                </p>
                <div className="offline-earnings">
                  <span className="crystal-icon">💎</span>
                  <span className="earnings-amount">
                    +{earnings.crystals.toLocaleString()}
                  </span>
                </div>
                <p className="offline-note">
                  (50% эффективность оффлайн-режима)
                </p>
                <button className="claim-button" onClick={handleClaim}>
                  Забрать!
                </button>
              </>
            ) : (
              <>
                <div className="offline-icon">✅</div>
                <h2>Получено!</h2>
                <div className="offline-earnings">
                  <span className="crystal-icon">💎</span>
                  <span className="earnings-amount">
                    +{earnings.crystals.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};