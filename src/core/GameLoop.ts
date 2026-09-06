export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly tickRate: number = 1000 / 60;
  
  constructor(
    private onTick: (deltaTime: number) => void,
    private onSecond: () => void
  ) {}
  
  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
  
  private loop(currentTime: number) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.accumulator += deltaTime;
    
    while (this.accumulator >= this.tickRate) {
      this.onTick(this.tickRate / 1000);
      this.accumulator -= this.tickRate;
    }
    
    if (Math.floor(currentTime / 1000) !== Math.floor((currentTime - deltaTime) / 1000)) {
      this.onSecond();
    }
    
    requestAnimationFrame(this.loop.bind(this));
  }
}