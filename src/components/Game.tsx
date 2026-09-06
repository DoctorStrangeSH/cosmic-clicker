import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLoop } from '../core/GameLoop';
import { BuildingSystem } from '../systems/BuildingSystem';
import { ClickSystem } from '../systems/ClickSystem';
import { UpgradeSystem } from '../systems/UpgradeSystem';
import { SaveSystem } from '../core/SaveSystem';
import { SoundSystem } from '../systems/SoundSystem';
import { PerformanceSystem } from '../systems/PerformanceSystem';
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
import { ParticleSystem } from './ParticleSystem';
import { Starfield } from './Starfield';
import { SettingsPanel } from './SettingsPanel';

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  isCritical: boolean;
  age: 'new' | 'old';
}

export const Game: React.FC = () => {
  const buildingSystemRef = useRef<BuildingSystem>();
  const clickSystemRef = useRef<ClickSystem>();
  const upgradeSystemRef = useRef<UpgradeSystem>();
  const saveSystemRef = useRef<SaveSystem>();
  const soundSystemRef = useRef<SoundSystem>();
  const performanceSystemRef = useRef<PerformanceSystem>();
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const nextIdRef = useRef(0);
  
  const removeFloatingNumber = useCallback((id: number) => {
    setFloatingNumbers(prev => prev.filter(fn => fn.id !== id));
  }, []);
  
  useEffect(() => {
    buildingSystemRef.current = new BuildingSystem();
    clickSystemRef.current = new ClickSystem();
    upgradeSystemRef.current = new UpgradeSystem();
    saveSystemRef.current = new SaveSystem();
    soundSystemRef.current = new SoundSystem();
    performanceSystemRef.current = new PerformanceSystem();
    
    saveSystemRef.current.load();
    
    const gameLoop = new GameLoop(
      (deltaTime) => {
        useGameStore.getState().addEnergy(deltaTime);
        useGameStore.setState((s) => {
          s.stats.playTime += deltaTime;
        });
      },
      () => {
        const production = buildingSystemRef.current?.getTotalProduction() || 0;
        useGameStore.getState().addCrystals(production);
        eventBus.emit('game:tick');
        
        // Оптимизация каждые 60 секунд
        if (Math.floor(Date.now() / 1000) % 60 === 0) {
          performanceSystemRef.current?.optimize();
        }
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
        isCritical: data.crit || false,
        age: 'new'
      };
      
      setFloatingNumbers(prev => [...prev, newFloatingNumber]);
      
      setTimeout(() => {
        setFloatingNumbers(prev => 
          prev.map(fn => 
            fn.id === id ? { ...fn, age: 'old' } : fn
          )
        );
      }, 500);
      
      setTimeout(() => {
        removeFloatingNumber(id);
      }, 1000);
    });
    
    return () => {
      unsubscribeClick();
      saveSystemRef.current?.save();
    };
  }, [removeFloatingNumber]);
  
  const handlePlanetClick = () => {
    eventBus.emit('click:perform');
  };
  
  return (
    <div className="game-container">
      <Starfield />
      <ParticleSystem />
      <ResourceDisplay />
      
      <div className="planet-click-area" onClick={handlePlanetClick}>
        <Planet />
        <GoldenCrystal />
        
        <AnimatePresence>
          {floatingNumbers.map(fn => (
            <motion.div
              key={fn.id}
              className={`floating-number ${fn.isCritical ? 'critical' : ''}`}
              data-age={fn.age}
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
      
      <BuildingPanel />
      <UpgradePanel />
      <PrestigeModal />
      <AchievementPopup />
      <QuestPanel />
      <PetPanel />
      <FleetPanel />
      <CombatView />
      <CraftPanel />
      <DungeonView />
      <MagicPanel />
      <ProfessionPanel />
      <TradeMarket />
      <SocialHub />
      <EventSystem />
      <SettingsPanel />
    </div>
  );
};