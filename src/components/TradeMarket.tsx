import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';

interface TradeOffer {
  id: string;
  seller: string;
  resourceType: string;
  resourceIcon: string;
  amount: number;
  price: number;
  expiresIn: number;
}

interface MarketPrice {
  resourceType: string;
  resourceIcon: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
}

export const TradeMarket: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'market' | 'myOffers' | 'history'>('market');
  const [offers, setOffers] = useState<TradeOffer[]>([]);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  
  useEffect(() => {
    // Имитация рыночных цен
    const initialPrices: MarketPrice[] = [
      { resourceType: 'crystals', resourceIcon: '💎', buyPrice: 1, sellPrice: 0.9, change: 0 },
      { resourceType: 'starDust', resourceIcon: '✨', buyPrice: 100, sellPrice: 90, change: 2.5 },
      { resourceType: 'quantumShards', resourceIcon: '🔮', buyPrice: 1000, sellPrice: 900, change: -1.2 },
      { resourceType: 'darkMatter', resourceIcon: '🌑', buyPrice: 10000, sellPrice: 9000, change: 5.7 }
    ];
    setPrices(initialPrices);
    
    // Имитация предложений
    const initialOffers: TradeOffer[] = [
      {
        id: '1',
        seller: 'Player123',
        resourceType: 'starDust',
        resourceIcon: '✨',
        amount: 50,
        price: 4500,
        expiresIn: 3600
      },
      {
        id: '2',
        seller: 'CosmicTrader',
        resourceType: 'quantumShards',
        resourceIcon: '🔮',
        amount: 10,
        price: 9500,
        expiresIn: 7200
      }
    ];
    setOffers(initialOffers);
    
    // Обновление цен
    const interval = setInterval(() => {
      setPrices(prevPrices => 
        prevPrices.map(price => ({
          ...price,
          change: (Math.random() - 0.5) * 10,
          buyPrice: Math.max(1, price.buyPrice * (1 + (Math.random() - 0.5) * 0.1))
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleBuy = (offer: TradeOffer) => {
    const state = useGameStore.getState();
    
    if (state.resources.crystals >= offer.price) {
      state.spendCrystals(offer.price);
      
      // Добавляем ресурс покупателю
      switch (offer.resourceType) {
        case 'starDust':
          useGameStore.setState((s) => {
            s.resources.starDust += offer.amount;
          });
          break;
        case 'quantumShards':
          useGameStore.setState((s) => {
            s.resources.quantumShards += offer.amount;
          });
          break;
      }
      
      // Удаляем предложение
      setOffers(prevOffers => prevOffers.filter(o => o.id !== offer.id));
      
      eventBus.emit('trade:completed', { type: 'buy', offer });
    }
  };
  
  const handleSell = (resourceType: string, amount: number) => {
    const state = useGameStore.getState();
    const price = prices.find(p => p.resourceType === resourceType);
    
    if (!price) return;
    
    switch (resourceType) {
      case 'starDust':
        if (state.resources.starDust >= amount) {
          useGameStore.setState((s) => {
            s.resources.starDust -= amount;
          });
          state.addCrystals(amount * price.sellPrice);
        }
        break;
      case 'quantumShards':
        if (state.resources.quantumShards >= amount) {
          useGameStore.setState((s) => {
            s.resources.quantumShards -= amount;
          });
          state.addCrystals(amount * price.sellPrice);
        }
        break;
    }
  };
  
  return (
    <>
      <button 
        className="trade-toggle"
        onClick={() => setIsOpen(true)}
      >
        Рынок 📊
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="trade-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="trade-header">
              <h3>Торговый рынок</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="trade-tabs">
              <button 
                className={selectedTab === 'market' ? 'active' : ''}
                onClick={() => setSelectedTab('market')}
              >
                Рынок
              </button>
              <button 
                className={selectedTab === 'myOffers' ? 'active' : ''}
                onClick={() => setSelectedTab('myOffers')}
              >
                Мои предложения
              </button>
              <button 
                className={selectedTab === 'history' ? 'active' : ''}
                onClick={() => setSelectedTab('history')}
              >
                История
              </button>
            </div>
            
            {selectedTab === 'market' && (
              <div className="market-content">
                <div className="prices-section">
                  <h4>Курсы валют</h4>
                  {prices.map(price => (
                    <div key={price.resourceType} className="price-row">
                      <span>{price.resourceIcon}</span>
                      <span>{price.resourceType}</span>
                      <span className={price.change >= 0 ? 'positive' : 'negative'}>
                        {price.change >= 0 ? '↑' : '↓'} {Math.abs(price.change).toFixed(1)}%
                      </span>
                      <span>Покупка: {price.buyPrice.toFixed(0)} 💎</span>
                      <span>Продажа: {price.sellPrice.toFixed(0)} 💎</span>
                    </div>
                  ))}
                </div>
                
                <div className="offers-section">
                  <h4>Активные предложения</h4>
                  {offers.map(offer => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-info">
                        <span className="offer-icon">{offer.resourceIcon}</span>
                        <div>
                          <p>{offer.amount} {offer.resourceType}</p>
                          <small>Продавец: {offer.seller}</small>
                        </div>
                      </div>
                      <div className="offer-price">
                        {offer.price} 💎
                      </div>
                      <button 
                        className="buy-button"
                        onClick={() => handleBuy(offer)}
                      >
                        Купить
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'myOffers' && (
              <div className="my-offers">
                <h4>Создать предложение</h4>
                <div className="create-offer">
                  <select>
                    <option value="starDust">✨ Звёздная пыль</option>
                    <option value="quantumShards">🔮 Квантовые осколки</option>
                  </select>
                  <input type="number" placeholder="Количество" />
                  <input type="number" placeholder="Цена" />
                  <button>Создать</button>
                </div>
              </div>
            )}
            
            {selectedTab === 'history' && (
              <div className="trade-history">
                <h4>История сделок</h4>
                <p>Пока нет совершённых сделок</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};