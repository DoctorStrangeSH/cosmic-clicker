type EventCallback = (data?: any) => void;

class EventBus {
  private static instance: EventBus;
  private events: Map<string, Set<EventCallback>> = new Map();
  
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }
  
  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return () => this.off(event, callback);
  }
  
  off(event: string, callback: EventCallback) {
    this.events.get(event)?.delete(callback);
  }
  
  emit(event: string, data?: any) {
    this.events.get(event)?.forEach(callback => callback(data));
  }
}

export const eventBus = EventBus.getInstance();