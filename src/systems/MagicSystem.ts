import { useGameStore } from '../core/GameState';
import { eventBus } from '../core/EventBus';
import { Spell, spells } from '../config/spells/spells';

export class MagicSystem {
  private spells: Spell[] = [];
  private mana: number = 100;
  private maxMana: number = 100;
  private manaRegen: number = 1;
  private cooldowns: Record<string, number> = {};
  
  constructor() {
    this.loadSpells();
    this.initializeListeners();
    this.initializeManaRegen();
  }
  
  private loadSpells() {
    this.spells = spells;
  }
  
  private initializeListeners() {
    eventBus.on('spell:cast', (data) => {
      this.castSpell(data.spellId);
    });
  }
  
  private initializeManaRegen() {
    setInterval(() => {
      this.mana = Math.min(this.mana + this.manaRegen, this.maxMana);
      eventBus.emit('mana:updated', { mana: this.mana, maxMana: this.maxMana });
    }, 1000);
  }
  
  canCast(spell: Spell): boolean {
    if (this.mana < spell.manaCost) return false;
    
    const now = Date.now();
    const lastCast = this.cooldowns[spell.id] || 0;
    if (now - lastCast < spell.cooldown * 1000) return false;
    
    return true;
  }
  
  castSpell(spellId: string): boolean {
    const spell = this.spells.find(s => s.id === spellId);
    if (!spell) return false;
    if (!this.canCast(spell)) return false;
    
    this.mana -= spell.manaCost;
    this.cooldowns[spellId] = Date.now();
    
    this.applySpellEffect(spell);
    eventBus.emit('spell:casted', spell);
    return true;
  }
  
  private applySpellEffect(spell: Spell) {
    const state = useGameStore.getState();
    
    switch (spell.effect.type) {
      case 'damage':
        // Наносим урон текущему врагу
        eventBus.emit('combat:damage', { amount: spell.effect.value });
        break;
      case 'boost':
        state.multipliers.globalMultiplier *= spell.effect.value;
        setTimeout(() => {
          state.multipliers.globalMultiplier /= spell.effect.value;
        }, (spell.effect.duration || 0) * 1000);
        break;
      case 'teleport':
        // Мгновенный сбор
        const production = state.resources.crystals * 0.1;
        state.addCrystals(production);
        break;
      case 'shield':
        // Активируем щит
        eventBus.emit('combat:shield', { amount: spell.effect.value });
        break;
    }
  }
  
  getSpells(): Spell[] {
    return this.spells;
  }
  
  getMana(): number {
    return this.mana;
  }
  
  getMaxMana(): number {
    return this.maxMana;
  }
  
  getCooldown(spellId: string): number {
    const lastCast = this.cooldowns[spellId] || 0;
    const spell = this.spells.find(s => s.id === spellId);
    if (!spell) return 0;
    
    const remaining = spell.cooldown - ((Date.now() - lastCast) / 1000);
    return Math.max(0, remaining);
  }
}