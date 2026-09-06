import { Howl } from 'howler';
import { eventBus } from '../core/EventBus';

export class SoundSystem {
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  
  constructor() {
    this.initializeSounds();
    this.initializeListeners();
  }
  
  private initializeSounds() {
    // Создаём звуки программно (без файлов)
    this.createSound('click', 0.1, 800);
    this.createSound('critical', 0.2, 1200);
    this.createSound('purchase', 0.15, 600);
    this.createSound('achievement', 0.3, 1000);
    this.createSound('golden', 0.25, 1500);
    this.createSound('error', 0.2, 200);
    this.createSound('prestige', 0.4, 2000);
  }
  
  private createSound(name: string, duration: number, frequency: number) {
    // Создаём звук через Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / audioContext.sampleRate) * 
                Math.exp(-5 * i / buffer.length);
    }
    
    const howl = new Howl({
      src: [URL.createObjectURL(new Blob([this.bufferToWave(buffer)], { type: 'audio/wav' }))],
      volume: this.volume,
      format: ['wav']
    });
    
    this.sounds.set(name, howl);
  }
  
  private bufferToWave(buffer: AudioBuffer): ArrayBuffer {
    const numChannels = 1;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const data = buffer.getChannelData(0);
    const dataSize = data.length * bytesPerSample;
    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);
    
    // Заголовок WAV
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    let offset = 44;
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  }
  
  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  
  private initializeListeners() {
    eventBus.on('click:performed', () => {
      this.play('click');
    });
    
    eventBus.on('click:critical', () => {
      this.play('critical');
    });
    
    eventBus.on('building:purchased', () => {
      this.play('purchase');
    });
    
    eventBus.on('achievement:unlocked', () => {
      this.play('achievement');
    });
    
    eventBus.on('golden_crystal:collected', () => {
      this.play('golden');
    });
    
    eventBus.on('prestige:performed', () => {
      this.play('prestige');
    });
  }
  
  play(soundName: string) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    eventBus.emit('sound:toggle', { isMuted: this.isMuted });
  }
  
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
  }
  
  getVolume(): number {
    return this.volume;
  }
  
  isMutedState(): boolean {
    return this.isMuted;
  }
}