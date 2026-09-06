import React from 'react';
import { eventBus } from '../core/EventBus';
import { SaveSystem } from '../core/SaveSystem';

interface SettingsPanelProps {
  onNavigate?: (modal: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onNavigate }) => {
  const handleSave = () => {
    const saveSystem = new SaveSystem();
    saveSystem.save();
    alert('Игра сохранена!');
  };
  
  const handleReset = () => {
    if (confirm('Вы уверены? Весь прогресс будет потерян!')) {
      const saveSystem = new SaveSystem();
      saveSystem.reset();
    }
  };
  
  return (
    <div className="settings-content">
      <div className="settings-menu">
        <button className="settings-menu-item" onClick={() => onNavigate?.('craft')}>
          🔨 Крафт
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('dungeons')}>
          🏰 Подземелья
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('professions')}>
          👷 Профессии
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('trade')}>
          📊 Рынок
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('social')}>
          👥 Друзья
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('quests')}>
          📋 Квесты
        </button>
        <button className="settings-menu-item" onClick={() => onNavigate?.('prestige')}>
          🌑 Престиж
        </button>
      </div>
      
      <div className="setting-item">
        <button onClick={handleSave}>
          💾 Сохранить игру
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
  );
};