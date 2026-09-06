import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';

interface Clan {
  id: string;
  name: string;
  icon: string;
  members: number;
  maxMembers: number;
  totalProduction: number;
  bonus: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  lastActive: string;
  bonus: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  crystals: number;
  production: number;
  achievements: number;
}

export const SocialHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'clan' | 'friends' | 'leaderboard'>('clan');
  const [clans, setClans] = useState<Clan[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // Имитация данных
    const mockClans: Clan[] = [
      { id: '1', name: 'Кристальные Воины', icon: '⚔️', members: 45, maxMembers: 50, totalProduction: 1000000, bonus: 0.45 },
      { id: '2', name: 'Звёздные Странники', icon: '🌟', members: 38, maxMembers: 50, totalProduction: 800000, bonus: 0.38 },
      { id: '3', name: 'Тёмная Материя', icon: '🌑', members: 42, maxMembers: 50, totalProduction: 950000, bonus: 0.42 }
    ];
    setClans(mockClans);
    
    const mockFriends: Friend[] = [
      { id: '1', name: 'CosmicHero', avatar: '🦸', level: 50, lastActive: '5 мин назад', bonus: 0.05 },
      { id: '2', name: 'StarLord', avatar: '🧙', level: 45, lastActive: '1 час назад', bonus: 0.05 },
      { id: '3', name: 'GalaxyQueen', avatar: '👸', level: 55, lastActive: 'Только что', bonus: 0.05 }
    ];
    setFriends(mockFriends);
    
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, name: 'UniversalKing', crystals: 1000000000, production: 5000000, achievements: 150 },
      { rank: 2, name: 'CosmicLord', crystals: 800000000, production: 4000000, achievements: 140 },
      { rank: 3, name: 'StarEmperor', crystals: 600000000, production: 3000000, achievements: 130 },
      { rank: 4, name: 'GalaxyRuler', crystals: 400000000, production: 2000000, achievements: 120 },
      { rank: 5, name: 'NebulaKing', crystals: 200000000, production: 1000000, achievements: 110 }
    ];
    setLeaderboard(mockLeaderboard);
  }, []);
  
  const handleCreateClan = () => {
    const state = useGameStore.getState();
    const clanCost = 1000000;
    
    if (state.resources.crystals >= clanCost) {
      state.spendCrystals(clanCost);
      // Создание клана
      eventBus.emit('clan:created', { name: 'Мой клан' });
    }
  };
  
  const handleJoinClan = (clanId: string) => {
    const clan = clans.find(c => c.id === clanId);
    if (clan && clan.members < clan.maxMembers) {
      setClans(prevClans => 
        prevClans.map(c => 
          c.id === clanId ? { ...c, members: c.members + 1 } : c
        )
      );
      eventBus.emit('clan:joined', { clanId });
    }
  };
  
  const handleAddFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      useGameStore.setState((s) => {
        s.multipliers.productionMultiplier += friend.bonus;
      });
      eventBus.emit('friend:added', { friendId });
    }
  };
  
  return (
    <>
      <button 
        className="social-toggle"
        onClick={() => setIsOpen(true)}
      >
        Сообщество 👥
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="social-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="social-header">
              <h3>Социальный центр</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="social-tabs">
              <button 
                className={selectedTab === 'clan' ? 'active' : ''}
                onClick={() => setSelectedTab('clan')}
              >
                Кланы 🛡️
              </button>
              <button 
                className={selectedTab === 'friends' ? 'active' : ''}
                onClick={() => setSelectedTab('friends')}
              >
                Друзья 🤝
              </button>
              <button 
                className={selectedTab === 'leaderboard' ? 'active' : ''}
                onClick={() => setSelectedTab('leaderboard')}
              >
                Рейтинг 🏆
              </button>
            </div>
            
            {selectedTab === 'clan' && (
              <div className="clan-content">
                <button className="create-clan" onClick={handleCreateClan}>
                  Создать клан (1M 💎)
                </button>
                
                <div className="clan-list">
                  {clans.map(clan => (
                    <div key={clan.id} className="clan-card">
                      <div className="clan-icon">{clan.icon}</div>
                      <div className="clan-info">
                        <h4>{clan.name}</h4>
                        <p>Участники: {clan.members}/{clan.maxMembers}</p>
                        <p>Производство: {clan.totalProduction.toLocaleString()}</p>
                        <p>Бонус: +{clan.bonus * 100}%</p>
                      </div>
                      <button 
                        className="join-clan"
                        onClick={() => handleJoinClan(clan.id)}
                        disabled={clan.members >= clan.maxMembers}
                      >
                        Вступить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'friends' && (
              <div className="friends-content">
                <div className="friend-list">
                  {friends.map(friend => (
                    <div key={friend.id} className="friend-card">
                      <div className="friend-avatar">{friend.avatar}</div>
                      <div className="friend-info">
                        <h4>{friend.name}</h4>
                        <p>Уровень: {friend.level}</p>
                        <small>Был(а): {friend.lastActive}</small>
                      </div>
                      <div className="friend-bonus">
                        +{friend.bonus * 100}% к производству
                      </div>
                      <button 
                        className="add-friend"
                        onClick={() => handleAddFriend(friend.id)}
                      >
                        Добавить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'leaderboard' && (
              <div className="leaderboard-content">
                <div className="leaderboard-list">
                  {leaderboard.map(entry => (
                    <div key={entry.rank} className={`leaderboard-entry rank-${entry.rank}`}>
                      <div className="rank">#{entry.rank}</div>
                      <div className="player-info">
                        <h4>{entry.name}</h4>
                        <p>💎 {entry.crystals.toLocaleString()}</p>
                      </div>
                      <div className="player-stats">
                        <p>⚙️ {entry.production.toLocaleString()}/сек</p>
                        <p>🏆 {entry.achievements} достижений</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};