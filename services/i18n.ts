import { useState, useEffect } from 'react';
import { db } from './db';

type Language = 'id' | 'en';

interface Translations {
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  clear: string;
  close: string;
  
  // Home Screen
  heroTitle: string;
  heroHighlight: string;
  uploadTitle: string;
  uploadSubtitle: string;
  selectFile: string;
  loadingDocument: string;
  privacyText: string;
  
  // Navigation
  home: string;
  library: string;
  settings: string;
  
  // Library Screen
  libraryTitle: string;
  uploadNewDocument: string;
  yourDecks: string;
  noDecks: string;
  createFirst: string;
  cards: string;
  mastered: string;
  progress: string;
  lastStudied: string;
  
  // Settings Screen
  settingsTitle: string;
  aiConfiguration: string;
  geminiApiKey: string;
  notConfigured: string;
  smartEnrichment: string;
  smartEnrichmentDesc: string;
  preferences: string;
  language: string;
  dailyReminder: string;
  darkMode: string;
  darkModeDesc: string;
  aboutRecall: string;
  appInfo: string;
  version: string;
  
  // API Key Modal
  apiKeyTitle: string;
  apiKeyDescription: string;
  enterApiKey: string;
  apiKeyEmpty: string;
  apiKeySaved: string;
  clearApiKey: string;
  clearApiKeyConfirm: string;
  apiKeyCleared: string;
  
  // Quiz Setup
  quizSetupTitle: string;
  newSession: string;
  readyToRecall: string;
  generatingCards: string;
  customizeExperience: string;
  studyDepth: string;
  cards: string;
  infoText: string;
  startQuiz: string;
  
  // Processing
  processingTitle: string;
  readingDocument: string;
  consultingAI: string;
  creatingFlashcards: string;
  apiKeyNotConfigured: string;
  invalidApiKey: string;
  extractingConcepts: string;
  processing: string;
  cancel: string;
  
  // Quiz Active
  questionCount: string;
  showAnswer: string;
  correct: string;
  incorrect: string;
  nextCard: string;
  cardOf: string;
  
  // Review Missed
  reviewMissedTitle: string;
  reviewComplete: string;
  
  // Summary
  summaryTitle: string;
  correctAnswers: string;
  accuracy: string;
  reviewMissed: string;
  finish: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    clear: 'Clear',
    close: 'Close',
    
    // Home Screen
    heroTitle: 'Simplify your',
    heroHighlight: 'study materials.',
    uploadTitle: 'Tap to Upload Document',
    uploadSubtitle: 'Supports PDF, DOCX, TXT',
    selectFile: 'Select File',
    loadingDocument: 'Loading document...',
    privacyText: 'AI-powered processing. Private.',
    
    // Navigation
    home: 'Home',
    library: 'Library',
    settings: 'Settings',
    
    // Library Screen
    libraryTitle: 'Your Study Library',
    uploadNewDocument: 'Upload New Document',
    yourDecks: 'Your Decks',
    noDecks: 'No study decks yet',
    createFirst: 'Upload a document to create your first deck',
    cards: 'cards',
    mastered: 'mastered',
    progress: 'Progress',
    lastStudied: 'Last studied',
    
    // Settings Screen
    settingsTitle: 'Settings',
    aiConfiguration: 'AI Configuration',
    geminiApiKey: 'Gemini API Key',
    notConfigured: 'Not configured',
    smartEnrichment: 'Smart Enrichment',
    smartEnrichmentDesc: 'Generate related questions beyond document',
    preferences: 'Preferences',
    language: 'Language / Bahasa',
    dailyReminder: 'Daily Reminder',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch between light and dark theme',
    aboutRecall: 'About Recall',
    appInfo: 'App Info',
    version: 'Version 1.0.0',
    
    // API Key Modal
    apiKeyTitle: 'Gemini API Key',
    apiKeyDescription: 'Enter your Gemini API key to enable AI-powered flashcard generation. You can get a free API key from Google AI Studio.',
    enterApiKey: 'Enter Gemini API Key',
    apiKeyEmpty: 'API Key cannot be empty',
    apiKeySaved: 'API Key saved successfully',
    clearApiKey: 'Clear API Key',
    clearApiKeyConfirm: 'Are you sure you want to clear your API key?',
    apiKeyCleared: 'API Key cleared',
    
    // Quiz Setup
    quizSetupTitle: 'Quiz Setup',
    newSession: 'New Session',
    readyToRecall: 'Ready to Recall?',
    generatingCards: 'Generating cards for:',
    customizeExperience: 'Customize your experience',
    studyDepth: 'Study Depth',
    cards: 'Cards',
    infoText: 'Short sessions are best for daily retention.',
    startQuiz: 'Start Quiz',
    
    // Processing
    processingTitle: 'Processing',
    readingDocument: 'Reading document...',
    consultingAI: 'Consulting Gemini AI...',
    creatingFlashcards: 'Creating Flashcards...',
    apiKeyNotConfigured: 'API Key Not Configured',
    invalidApiKey: 'Invalid API Key',
    extractingConcepts: 'Extracting key concepts & generating',
    processing: 'Processing',
    cancel: 'Cancel',
    
    // Quiz Active
    questionCount: 'Question',
    showAnswer: 'Show Answer',
    correct: 'Correct',
    incorrect: 'Incorrect',
    nextCard: 'Next Card',
    cardOf: 'of',
    
    // Review Missed
    reviewMissedTitle: 'Review Missed',
    reviewComplete: 'Review Complete',
    
    // Summary
    summaryTitle: 'Quiz Summary',
    correctAnswers: 'Correct Answers',
    accuracy: 'Accuracy',
    reviewMissed: 'Review Missed',
    finish: 'Finish'
  },
  
  id: {
    // Common
    loading: 'Memuat...',
    error: 'Kesalahan',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    clear: 'Hapus',
    close: 'Tutup',
    
    // Home Screen
    heroTitle: 'Sederhanakan',
    heroHighlight: 'materi belajar Anda.',
    uploadTitle: 'Ketuk untuk Unggah Dokumen',
    uploadSubtitle: 'Mendukung PDF, DOCX, TXT',
    selectFile: 'Pilih File',
    loadingDocument: 'Memuat dokumen...',
    privacyText: 'Pemrosesan bertenaga AI. Privat.',
    
    // Navigation
    home: 'Beranda',
    library: 'Perpustakaan',
    settings: 'Pengaturan',
    
    // Library Screen
    libraryTitle: 'Perpustakaan Belajar Anda',
    uploadNewDocument: 'Unggah Dokumen Baru',
    yourDecks: 'Deck Anda',
    noDecks: 'Belum ada deck belajar',
    createFirst: 'Unggah dokumen untuk membuat deck pertama',
    cards: 'kartu',
    mastered: 'dikuasai',
    progress: 'Progres',
    lastStudied: 'Terakhir dipelajari',
    
    // Settings Screen
    settingsTitle: 'Pengaturan',
    aiConfiguration: 'Konfigurasi AI',
    geminiApiKey: 'Kunci API Gemini',
    notConfigured: 'Belum dikonfigurasi',
    smartEnrichment: 'Pengayaan Cerdas',
    smartEnrichmentDesc: 'Buat pertanyaan terkait di luar dokumen',
    preferences: 'Preferensi',
    language: 'Language / Bahasa',
    dailyReminder: 'Pengingat Harian',
    darkMode: 'Mode Gelap',
    darkModeDesc: 'Beralih antara tema terang dan gelap',
    aboutRecall: 'Tentang Recall',
    appInfo: 'Info Aplikasi',
    version: 'Versi 1.0.0',
    
    // API Key Modal
    apiKeyTitle: 'Kunci API Gemini',
    apiKeyDescription: 'Masukkan kunci API Gemini Anda untuk mengaktifkan pembuatan flashcard bertenaga AI. Anda dapat mendapatkan kunci API gratis dari Google AI Studio.',
    enterApiKey: 'Masukkan Kunci API Gemini',
    apiKeyEmpty: 'Kunci API tidak boleh kosong',
    apiKeySaved: 'Kunci API berhasil disimpan',
    clearApiKey: 'Hapus Kunci API',
    clearApiKeyConfirm: 'Apakah Anda yakin ingin menghapus kunci API?',
    apiKeyCleared: 'Kunci API dihapus',
    
    // Quiz Setup
    quizSetupTitle: 'Pengaturan Kuis',
    newSession: 'Sesi Baru',
    readyToRecall: 'Siap untuk Mengingat?',
    generatingCards: 'Membuat kartu untuk:',
    customizeExperience: 'Sesuaikan pengalaman Anda',
    studyDepth: 'Kedalaman Belajar',
    cards: 'Kartu',
    infoText: 'Sesi pendek terbaik untuk retensi harian.',
    startQuiz: 'Mulai Kuis',
    
    // Processing
    processingTitle: 'Memproses',
    readingDocument: 'Membaca dokumen...',
    consultingAI: 'Berkonsultasi dengan Gemini AI...',
    creatingFlashcards: 'Membuat Flashcard...',
    apiKeyNotConfigured: 'Kunci API Tidak Dikonfigurasi',
    invalidApiKey: 'Kunci API Tidak Valid',
    extractingConcepts: 'Mengekstrak konsep kunci & membuat',
    processing: 'Memproses',
    cancel: 'Batal',
    
    // Quiz Active
    questionCount: 'Pertanyaan',
    showAnswer: 'Tampilkan Jawaban',
    correct: 'Benar',
    incorrect: 'Salah',
    nextCard: 'Kartu Selanjutnya',
    cardOf: 'dari',
    
    // Review Missed
    reviewMissedTitle: 'Tinjau yang Terlewat',
    reviewComplete: 'Tinjauan Selesai',
    
    // Summary
    summaryTitle: 'Ringkasan Kuis',
    correctAnswers: 'Jawaban Benar',
    accuracy: 'Akurasi',
    reviewMissed: 'Tinjau yang Terlewat',
    finish: 'Selesai'
  }
};

export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = 'en';
  private listeners: Array<(language: Language) => void> = [];

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  async initialize(): Promise<void> {
    const settings = await db.getSettings();
    this.currentLanguage = settings.language || 'en';
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.listeners.forEach(listener => listener(language));
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: keyof Translations): string {
    return translations[this.currentLanguage][key];
  }

  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const i18n = I18nService.getInstance();

// React hook for using translations
export function useTranslation() {
  const [language, setLanguage] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const unsubscribe = i18n.subscribe(setLanguage);
    return unsubscribe;
  }, []);

  return {
    t: (key: keyof Translations) => translations[language][key],
    language,
    setLanguage: (lang: Language) => i18n.setLanguage(lang)
  };
}