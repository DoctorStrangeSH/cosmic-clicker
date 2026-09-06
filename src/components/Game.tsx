import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLoop } from '../core/GameLoop';
import { BuildingSystem } from '../systems/BuildingSystem';
import { ClickSystem } from '../systems/ClickSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { SaveSystem } from '../core/SaveSystem';
import { eventBus } from '../core/EventBus';
import { useGameStore } from '../core/GameState';
import { Planet } from './Planet';
import { ResourceDisplay } from './ResourceDisplay';
import { BuildingPanel } from './BuildingPanel';
import { UpgradePanel } from './UpgradePanel';
import { PrestigeModal } from './PrestigeModal';
import { AchievementPopup } from './AchievementPopup';
import { QuestPanel } from './QuestPanel';
import { GoldenCrystal } from './GoldenCrystal';
import { EventSystem } from './EventSystem';
import { PetPanel } from './PetPanel';
import { FleetPanel } from './FleetPanel';
import { CombatView } from './CombatView';
import { CraftPanel } from './CraftPanel';
import { DungeonView } from './DungeonView';
import { MagicPanel } from './MagicPanel';
import { ProfessionPanel } from './ProfessionPanel';
import { TradeMarket } from './TradeMarket';
import { SocialHub } from './SocialHub';
import { SettingsPanel } from './SettingsPanel';

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  isCritical: boolean;
}

type ModalType = 'buildings' | 'upgrades' | 'pets' | 'fleet' | 'combat' | 
                 'craft' | 'dungeons' | 'magic' | 'professions' | 'trade' | 
                 'social' | 'quests' | 'prestige' | 'settings' | null;

export const Game: React.FC = () => {
  const buildingSystemRef = useRef<BuildingSystem>();
  const clickSystemRef = useRef<ClickSystem>();
  const upgradeSystemRef = useRef<UpgradeSystem>();
  const saveSystemRef = useRef<SaveSystem>();
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const nextIdRef = useRef(0);
  
  const removeFloatingNumber = useCallback((id: number) => {
    setFloatingNumbers(prev => prev.filter(fn => fn.id !== id));
  }, []);
  
  useEffect(() => {
    buildingSystemRef.current = new BuildingSystem();
    clickSystemRef.current = new ClickSystem();
    upgradeSystemRef.current = new UpgradeSystem();
    saveSystemRef.current = new SaveSystem();
    
    saveSystemRef.current.load();
    
    const gameLoop = new GameLoop(
      (deltaTime) => {
        useGameStore.getState().addEnergy(deltaTime);
      },
      () => {
        const production = buildingSystemRef.current?.getTotalProduction() || 0;
        useGameStore.getState().addCrystals(production);
        eventBus.emit('game:tick');
      }
    );
    
    gameLoop.start();
    
    const unsubscribeClick = eventBus.on('click:performed', (data) => {
      const id = nextIdRef.current++;
      const newFloatingNumber: FloatingNumber = {
        id,
        value: data.value,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50 + (Math.random() - 0.5) * 30,
        isCritical: data.crit || false
      };
      
      setFloatingNumbers(prev => [...prev, newFloatingNumber]);
      
      setTimeout(() => {
        removeFloatingNumber(id);
      }, 1000);
    });
    
    return () => {
      unsubscribeClick();
      saveSystemRef.current?.save();
    };
  }, [removeFloatingNumber]);
  
  const handlePlanetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    eventBus.emit('click:perform');
  };
  
  const openModal = (modal: ModalType) => {
    setActiveModal(modal);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  const modalTitles: Record<ModalType, string> = {
    buildings: '🏗️ Здания',
    upgrades: '⬆️ Улучшения',
    pets: '🐾 Питомцы',
    fleet: '🚀 Флот',
    combat: '⚔️ Битва',
    craft: '🔨 Крафт',
    dungeons: '🏰 Подземелья',
    magic: '🔮 Магия',
    professions: '👷 Профессии',
    trade: '📊 Рынок',
    social: '👥 Сообщество',
    quests: '📋 Квесты',
    prestige: '🌑 Престиж',
    settings: '⚙️ Настройки',
    null: ''
  };
  
  return (
    <div className="game-container">
      <ResourceDisplay />
      
      <div className="planet-click-area" onClick={handlePlanetClick}>
        <Planet />
        <GoldenCrystal />
        
        <AnimatePresence>
          {floatingNumbers.map(fn => (
            <motion.div
              key={fn.id}
              className={`floating-number ${fn.isCritical ? 'critical' : ''}`}
              style={{ 
                left: `${fn.x}%`, 
                top: `${fn.y}%`,
                position: 'absolute',
                pointerEvents: 'none'
              }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ 
                opacity: 0, 
                y: fn.isCritical ? -150 : -100, 
                scale: fn.isCritical ? 2.5 : 1.5 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: fn.isCritical ? 1.5 : 1,
                ease: "easeOut"
              }}
              onAnimationComplete={() => {
                removeFloatingNumber(fn.id);
              }}
            >
              +{fn.value.toFixed(1)} 💎
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Настройки - маленькая кнопка сверху */}
      <button 
        className="settings-button"
        onClick={() => openModal('settings')}
      >
        ⚙️
      </button>
      
      {/* Нижняя навигация */}
      <div className="bottom-nav">
        <button className="nav-button" onClick={() => openModal('buildings')}>
          <span className="icon">🏗️</span>
          <span className="label">Здания</span>
        </button>
        <button className="nav-button" onClick={() => openModal('upgrades')}>
          <span className="icon">⬆️</span>
          <span className="label">Улучшения</span>
        </button>
        <button className="nav-button" onClick={() => openModal('pets')}>
          <span className="icon">🐾</span>
          <span className="label">Питомцы</span>
        </button>
        <button className="nav-button" onClick={() => openModal('fleet')}>
          <span className="icon">🚀</span>
          <span className="label">Флот</span>
        </button>
        <button className="nav-button" onClick={() => openModal('magic')}>
          <span className="icon">🔮</span>
          <span className="label">Магия</span>
        </button>
        <button className="nav-button" onClick={() => openModal('quests')}>
          <span className="icon">📋</span>
          <span className="label">Квесты</span>
        </button>
        <button className="nav-button" onClick={() => openModal('prestige')}>
          <span className="icon">🌑</span>
          <span className="label">Престиж</span>
        </button>
      </div>
      
      {/* Вторая строка навигации */}
      <div className="bottom-nav secondary">
        <button className="nav-button" onClick={() => openModal('combat')}>
          <span className="icon">⚔️</span>
          <span className="label">Битва</span>
        </button>
        <button className="nav-button" onClick={() => openModal('craft')}>
          <span className="icon">🔨</span>
          <span className="label">Крафт</span>
        </button>
        <button className="nav-button" onClick={() => openModal('dungeons')}>
          <span className="icon">🏰</span>
          <span className="label">Подземелья</span>
        </button>
        <button className="nav-button" onClick={() => openModal('professions')}>
          <span className="icon">👷</span>
          <span className="label">Профессии</span>
        </button>
        <button className="nav-button" onClick={() => openModal('trade')}>
          <span className="icon">📊</span>
          <span className="label">Рынок</span>
        </button>
        <button className="nav-button" onClick={() => openModal('social')}>
          <span className="icon">👥</span>
          <span className="label">Друзья</span>
        </button>
      </div>
      
      {/* Модальные окна */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{modalTitles[activeModal]}</h3>
                <button className="close-button" onClick={closeModal}>✕</button>
              </div>
              <div className="modal-body">
                {activeModal === 'buildings' && <BuildingPanel />}
                {activeModal === 'upgrades' && <UpgradePanel />}
                {activeModal === 'pets' && <PetPanel />}
                {activeModal === 'fleet' && <FleetPanel />}
                {activeModal === 'combat' && <CombatView />}
                {activeModal === 'craft' && <CraftPanel />}
                {activeModal === 'dungeons' && <DungeonView />}
                {activeModal === 'magic' && <MagicPanel />}
                {activeModal === 'professions' && <ProfessionPanel />}
                {activeModal === 'trade' && <TradeMarket />}
                {activeModal === 'social' && <SocialHub />}
                {activeModal === 'quests' && <QuestPanel />}
                {activeModal === 'prestige' && <PrestigeModal />}
                {activeModal === 'settings' && <SettingsPanel />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AchievementPopup />
      <EventSystem />
    </div>
  );
};