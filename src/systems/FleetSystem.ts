import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Ship, fleetShips } from '../config/ships/fleetShips';

interface ActiveMission {
  shipId: string;
  missionType: string;
  startTime: number;
  duration: number;
  reward: {
    type: string;
    amount: number;
  };
}

export class FleetSystem {
  private ships: Ship[] = [];
  private activeMissions: ActiveMission[] = [];
  
  constructor() {
    this.loadShips();
    this.initializeListeners();
    this.initializeMissionCheck();
  }
  
  private loadShips() {
    this.ships = fleetShips;
  }
  
  private initializeListeners() {
    eventBus.on('ship:purchase', (data) => {
      this.purchaseShip(data.shipId);
    });
    
    eventBus.on('ship:mission', (data) => {
      this.startMission(data.shipId, data.missionType);
    });
  }
  
  private initializeMissionCheck() {
    setInterval(() => {
      this.checkMissions();
    }, 1000);
  }
  
  purchaseShip(shipId: string): boolean {
    const state = useGameStore.getState();
    const ship = this.ships.find(s => s.id === shipId);
    
    if (!ship) return false;
    if (state.ships[shipId]) return false;
    if (state.resources.crystals < ship.cost) return false;
    
    if (state.spendCrystals(ship.cost)) {
      useGameStore.setState((s) => {
        s.ships[shipId] = 1;
      });
      
      eventBus.emit('ship:purchased', ship);
      return true;
    }
    
    return false;
  }
  
  startMission(shipId: string, missionType: string): boolean {
    const state = useGameStore.getState();
    const ship = this.ships.find(s => s.id === shipId);
    
    if (!ship) return false;
    if (!state.ships[shipId]) return false;
    if (!ship.missions.includes(missionType)) return false;
    
    // Проверяем, нет ли уже активной миссии
    const existingMission = this.activeMissions.find(m => m.shipId === shipId);
    if (existingMission) return false;
    
    const mission = this.createMission(ship, missionType);
    this.activeMissions.push(mission);
    
    eventBus.emit('ship:missionStarted', mission);
    return true;
  }
  
  private createMission(ship: Ship, missionType: string): ActiveMission {
    let duration = 1800; // 30 минут по умолчанию
    let reward = { type: 'crystals', amount: 1000 };
    
    switch (missionType) {
      case 'recon':
        duration = 1800; // 30 минут
        reward = { type: 'crystals', amount: 100000 };
        break;
      case 'mine':
        duration = 3600; // 1 час
        reward = { type: 'crystals', amount: 1000000 };
        break;
      case 'trade':
        duration = 7200; // 2 часа
        reward = { type: 'crystals', amount: 5000000 };
        break;
      case 'research':
        duration = 14400; // 4 часа
        reward = { type: 'quantumShards', amount: 1 };
        break;
      case 'defend':
        duration = 3600;
        reward = { type: 'crystals', amount: 500000 };
        break;
    }
    
    return {
      shipId: ship.id,
      missionType,
      startTime: Date.now(),
      duration,
      reward
    };
  }
  
  private checkMissions() {
    const now = Date.now();
    
    this.activeMissions.forEach(mission => {
      if (now - mission.startTime >= mission.duration * 1000) {
        this.completeMission(mission);
      }
    });
  }
  
  private completeMission(mission: ActiveMission) {
    const state = useGameStore.getState();
    
    switch (mission.reward.type) {
      case 'crystals':
        state.addCrystals(mission.reward.amount);
        break;
      case 'quantumShards':
        useGameStore.setState((s) => {
          s.resources.quantumShards += mission.reward.amount;
        });
        break;
    }
    
    this.activeMissions = this.activeMissions.filter(m => m !== mission);
    eventBus.emit('ship:missionCompleted', mission);
  }
  
  getActiveMissions(): ActiveMission[] {
    return this.activeMissions;
  }
  
  getAvailableShips(): Ship[] {
    return this.ships;
  }
}