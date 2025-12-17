import * as SQLite from 'expo-sqlite';
import { Card, Deck, Settings } from '../types';

// Open database
const database = SQLite.openDatabaseSync('recall.db');

// Initialize database tables
const initDB = () => {
  database.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      darkMode INTEGER DEFAULT 1,
      apiKey TEXT,
      dailyReminder INTEGER DEFAULT 1,
      aiSuggestions INTEGER DEFAULT 0,
      language TEXT DEFAULT 'en'
    );

    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      totalCards INTEGER DEFAULT 0,
      masteredCount INTEGER DEFAULT 0,
      lastStudied TEXT,
      timestamp INTEGER NOT NULL,
      status TEXT DEFAULT 'New',
      progress INTEGER DEFAULT 0,
      icon TEXT DEFAULT 'auto-awesome',
      colorClass TEXT DEFAULT 'purple'
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      deckId TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      FOREIGN KEY (deckId) REFERENCES decks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_cards_deckId ON cards(deckId);
    CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
  `);

  // Insert default settings if not exists
  const settingsCount = database.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM settings');
  if (settingsCount?.count === 0) {
    database.runSync(
      'INSERT INTO settings (id, darkMode, apiKey, dailyReminder, aiSuggestions, language) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 1, '', 1, 0, 'en']
    );
  } else {
    // Add language column to existing settings if it doesn't exist
    try {
      database.runSync('ALTER TABLE settings ADD COLUMN language TEXT DEFAULT "en"');
    } catch (e) {
      // Column already exists, ignore error
    }
  }
};

// Initialize on module load
initDB();

// Database service
export const dbService = {
  // --- Settings ---
  async getSettings(): Promise<Settings> {
    try {
      const result = database.getFirstSync<{
        id: number;
        darkMode: number;
        apiKey: string;
        dailyReminder: number;
        aiSuggestions: number;
        language: string;
      }>('SELECT * FROM settings WHERE id = 1');

      if (result) {
        return {
          darkMode: Boolean(result.darkMode),
          apiKey: result.apiKey || '',
          dailyReminder: Boolean(result.dailyReminder),
          aiSuggestions: Boolean(result.aiSuggestions),
          language: (result.language as 'id' | 'en') || 'en'
        };
      }
    } catch (e) {
      console.error('Error getting settings:', e);
    }

    return {
      darkMode: true,
      apiKey: '',
      dailyReminder: true,
      aiSuggestions: false,
      language: 'en'
    };
  },

  async saveSettings(settings: Settings): Promise<void> {
    database.runSync(
      'UPDATE settings SET darkMode = ?, apiKey = ?, dailyReminder = ?, aiSuggestions = ?, language = ? WHERE id = 1',
      [settings.darkMode ? 1 : 0, settings.apiKey, settings.dailyReminder ? 1 : 0, settings.aiSuggestions ? 1 : 0, settings.language]
    );
  },

  // --- Decks ---
  async getDecks(): Promise<Deck[]> {
    const decks = database.getAllSync<Deck>('SELECT * FROM decks ORDER BY timestamp DESC');
    return decks || [];
  },

  async createDeck(title: string, cards: Omit<Card, 'id' | 'deckId' | 'status'>[]): Promise<string> {
    const newId = Date.now().toString();
    const timestamp = Date.now();

    // Create Deck
    database.runSync(
      'INSERT INTO decks (id, title, totalCards, masteredCount, timestamp, status, progress, icon, colorClass) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newId, title, cards.length, 0, timestamp, 'New', 0, 'auto-awesome', 'purple']
    );

    // Create Cards
    cards.forEach((card, i) => {
      database.runSync(
        'INSERT INTO cards (id, deckId, question, answer, status) VALUES (?, ?, ?, ?, ?)',
        [`${newId}_${i}`, newId, card.question, card.answer, 'new']
      );
    });

    return newId;
  },

  async updateDeckProgress(deckId: string, masteredCount: number, totalStudied: number): Promise<void> {
    const deck = database.getFirstSync<Deck>('SELECT * FROM decks WHERE id = ?', [deckId]);

    if (deck) {
      const progress = Math.round((masteredCount / deck.totalCards) * 100);
      const status = progress === 100 ? 'Completed' : 'In Progress';

      database.runSync(
        'UPDATE decks SET masteredCount = ?, progress = ?, status = ?, lastStudied = ?, timestamp = ? WHERE id = ?',
        [masteredCount, progress, status, 'Just now', Date.now(), deckId]
      );
    }
  },

  async deleteDeck(deckId: string): Promise<void> {
    database.runSync('DELETE FROM cards WHERE deckId = ?', [deckId]);
    database.runSync('DELETE FROM decks WHERE id = ?', [deckId]);
  },

  // --- Cards ---
  async getAllCards(): Promise<Card[]> {
    const cards = database.getAllSync<Card>('SELECT * FROM cards');
    return cards || [];
  },

  async getCardsForDeck(deckId: string, limit?: number): Promise<Card[]> {
    let query = 'SELECT * FROM cards WHERE deckId = ?';
    const params: any[] = [deckId];

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const cards = database.getAllSync<Card>(query, params);
    return cards || [];
  },

  async getHardCards(): Promise<Card[]> {
    const cards = database.getAllSync<Card>('SELECT * FROM cards WHERE status IN (?, ?)', ['hard', 'review']);
    return cards || [];
  },

  async updateCardStatus(cardId: string, status: 'mastered' | 'hard' | 'review'): Promise<void> {
    database.runSync('UPDATE cards SET status = ? WHERE id = ?', [status, cardId]);
  },

  async resetDeckCardStatuses(deckId: string): Promise<void> {
    database.runSync('UPDATE cards SET status = ? WHERE deckId = ?', ['new', deckId]);
  }
};

// Export as default db for compatibility
export const db = dbService;
