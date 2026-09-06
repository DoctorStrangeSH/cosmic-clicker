import { useGameStore } from '../core/GameState';

export class PerformanceSystem {
  private fps: number = 60;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private isLowPerformance: boolean = false;
  
  constructor() {
    this.initializeMonitoring();
  }
  
  private initializeMonitoring() {
    setInterval(() => {
      this.checkPerformance();
    }, 1000);
  }
  
  private checkPerformance() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.fps = Math.round(1000 / deltaTime);
    
    // Если FPS ниже 30, включаем режим низкой производительности
    if (this.fps < 30 && !this.isLowPerformance) {
      this.enableLowPerformanceMode();
    } else if (this.fps > 45 && this.isLowPerformance) {
      this.disableLowPerformanceMode();
    }
  }
  
  private enableLowPerformanceMode() {
    this.isLowPerformance = true;
    
    // Отключаем тяжёлые эффекты
    document.body.classList.add('low-performance');
    
    // Уменьшаем количество частиц
    document.documentElement.style.setProperty('--particle-count', '10');
    
    // Отключаем анимации
    const style = document.createElement('style');
    style.id = 'disable-animations';
    style.textContent = `
      * {
        animation-duration: 0.5s !important;
        transition-duration: 0.5s !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  private disableLowPerformanceMode() {
    this.isLowPerformance = false;
    document.body.classList.remove('low-performance');
    
    const style = document.getElementById('disable-animations');
    if (style) {
      style.remove();
    }
  }
  
  getFPS(): number {
    return this.fps;
  }
  
  isLowPerformanceMode(): boolean {
    return this.isLowPerformance;
  }
  
  optimize() {
    // Очистка неиспользуемых ресурсов
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Очистка старых уведомлений
    const notifications = document.querySelectorAll('.floating-number');
    notifications.forEach(notification => {
      if (notification.getAttribute('data-age') === 'old') {
        notification.remove();
      }
    });
  }
}