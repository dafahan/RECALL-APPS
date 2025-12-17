
export interface Card {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  source?: string;
  status: 'new' | 'mastered' | 'review' | 'hard';
}

export interface Deck {
  id: string;
  title: string;
  totalCards: number;
  masteredCount: number;
  lastStudied?: string;
  timestamp: number; // Added for sorting
  status: 'New' | 'In Progress' | 'Completed';
  progress: number;
  icon: string;
  colorClass: string;
}

export interface QuizSession {
  id: string;
  deckId: string;
  totalCards: number;
  correctCount: number;
  missedCount: number;
  currentCardIndex: number;
  cards: Card[];
  completed: boolean;
}

export interface Settings {
  darkMode: boolean;
  apiKey: string;
  dailyReminder: boolean;
  aiSuggestions: boolean;
}
