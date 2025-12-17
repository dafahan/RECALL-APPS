import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Deck, Settings } from '../types';

// Storage Keys
const KEYS = {
  DECKS: 'recall_decks_v1',
  CARDS: 'recall_cards_v1',
  SETTINGS: 'recall_settings_v1'
};

// Initial Data Helper
const getInitialDecks = (): Deck[] => [
  {
    id: '1',
    title: 'Advanced Macroeconomics',
    totalCards: 20,
    masteredCount: 9,
    lastStudied: '2h ago',
    timestamp: Date.now() - 100000,
    status: 'In Progress',
    progress: 45,
    icon: 'history-edu', // MaterialIcon name
    colorClass: 'yellow' // simplified for RN logic
  },
  {
    id: '2',
    title: 'UX Design Principles',
    totalCards: 20,
    masteredCount: 18,
    lastStudied: 'Yesterday',
    timestamp: Date.now() - 200000,
    status: 'In Progress',
    progress: 90,
    icon: 'check-circle',
    colorClass: 'green'
  }
];

// DB Service Implementation
export const db = {
  // --- Settings ---
  async getSettings(): Promise<Settings> {
    try {
      const s = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (s) return JSON.parse(s);
    } catch (e) { console.error(e); }
    
    return {
      darkMode: true, // Default to dark for "App" feel
      apiKey: 'AIzaSyBnYjAPLApyVNWvCMv7oaTQdqrCEP7CJ0w',
      dailyReminder: true,
      aiSuggestions: false
    };
  },

  async saveSettings(settings: Settings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // --- Decks ---
  async getDecks(): Promise<Deck[]> {
    const s = await AsyncStorage.getItem(KEYS.DECKS);
    let decks: Deck[] = [];
    if (s) {
      decks = JSON.parse(s);
    } else {
      decks = getInitialDecks();
      await AsyncStorage.setItem(KEYS.DECKS, JSON.stringify(decks));
    }
    return decks.sort((a, b) => b.timestamp - a.timestamp);
  },

  async createDeck(title: string, cards: Omit<Card, 'id' | 'deckId' | 'status'>[]): Promise<string> {
    const decks = await this.getDecks();
    const newId = Date.now().toString();
    
    // Create Deck
    const newDeck: Deck = {
      id: newId,
      title: title,
      totalCards: cards.length,
      masteredCount: 0,
      timestamp: Date.now(),
      status: 'New',
      progress: 0,
      icon: 'auto-awesome',
      colorClass: 'purple'
    };
    
    decks.unshift(newDeck);
    await AsyncStorage.setItem(KEYS.DECKS, JSON.stringify(decks));

    // Create Cards
    const allCards = await this.getAllCards();
    const newCards: Card[] = cards.map((c, i) => ({
      ...c,
      id: `${newId}_${i}`,
      deckId: newId,
      status: 'new'
    }));
    
    await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify([...allCards, ...newCards]));
    
    return newId;
  },

  async updateDeckProgress(deckId: string, masteredCount: number, totalStudied: number): Promise<void> {
    const decks = await this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    
    if (deckIndex !== -1) {
      const deck = decks[deckIndex];
      deck.masteredCount = masteredCount;
      deck.progress = Math.round((masteredCount / deck.totalCards) * 100);
      deck.status = deck.progress === 100 ? 'Completed' : 'In Progress';
      deck.lastStudied = 'Just now';
      deck.timestamp = Date.now();
      
      decks[deckIndex] = deck;
      await AsyncStorage.setItem(KEYS.DECKS, JSON.stringify(decks));
    }
  },

  // --- Cards ---
  async getAllCards(): Promise<Card[]> {
    const s = await AsyncStorage.getItem(KEYS.CARDS);
    return s ? JSON.parse(s) : [];
  },

  async getCardsForDeck(deckId: string, limit?: number): Promise<Card[]> {
    const allCards = await this.getAllCards();
    let deckCards = allCards.filter(c => c.deckId === deckId);
    
    // Mock if empty (for demo purposes)
    if (deckCards.length === 0 && (deckId === '1' || deckId === '2')) {
       deckCards = Array.from({ length: 10 }).map((_, i) => ({
         id: `${deckId}_${i}`,
         deckId,
         question: `Sample Question ${i+1} for ${deckId === '1' ? 'Macroeconomics' : 'UX'}`,
         answer: `This is a simulated answer for card ${i+1}. It has enough text to look like a real answer.`,
         status: 'new'
       }));
    }

    if (limit && deckCards.length > limit) {
      return deckCards.slice(0, limit);
    }
    return deckCards;
  },

  async getHardCards(): Promise<Card[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(c => c.status === 'hard' || c.status === 'review');
  },

  async updateCardStatus(cardId: string, status: 'mastered' | 'hard' | 'review'): Promise<void> {
    const allCards = await this.getAllCards();
    const cardIndex = allCards.findIndex(c => c.id === cardId);
    if (cardIndex !== -1) {
      allCards[cardIndex].status = status;
      await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(allCards));
    }
  }
};