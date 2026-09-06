import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '../core/EventBus';

interface AchievementNotification {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export const AchievementPopup: React.FC = () => {
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);
  const nextIdRef = React.useRef(0);
  
  useEffect(() => {
    const unsubscribe = eventBus.on('achievement:unlocked', (achievement) => {
      const id = nextIdRef.current++;
      const notification: AchievementNotification = {
        id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <div className="achievement-popup-container">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            className="achievement-popup"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="achievement-icon">{notification.icon}</div>
            <div className="achievement-info">
              <h4>Достижение!</h4>
              <p>{notification.name}</p>
              <small>{notification.description}</small>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};