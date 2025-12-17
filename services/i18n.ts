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
  libraryCards: string;
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
  quizCards: string;
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

  // Help Screen
  helpTitle: string;
  helpIntroTitle: string;
  helpIntroText: string;
  helpGettingStarted: string;
  helpStep1Title: string;
  helpStep1Text: string;
  helpStep2Title: string;
  helpStep2Text: string;
  helpStep3Title: string;
  helpStep3Text: string;
  helpStep4Title: string;
  helpStep4Text: string;
  helpFaqTitle: string;
  helpFaq1Q: string;
  helpFaq1A: string;
  helpFaq2Q: string;
  helpFaq2A: string;
  helpFaq3Q: string;
  helpFaq3A: string;
  helpFaq4Q: string;
  helpFaq4A: string;
  helpFaq5Q: string;
  helpFaq5A: string;
  helpNeedMoreHelp: string;
  helpContactText: string;

  // App Info Screen
  appInfoTitle: string;
  appInfoTagline: string;
  appInfoAbout: string;
  appInfoAboutText: string;
  appInfoFeatures: string;
  appInfoFeature1Title: string;
  appInfoFeature1Text: string;
  appInfoFeature2Title: string;
  appInfoFeature2Text: string;
  appInfoFeature3Title: string;
  appInfoFeature3Text: string;
  appInfoFeature4Title: string;
  appInfoFeature4Text: string;
  appInfoTech: string;
  appInfoSourceCode: string;
  appInfoGetApiKey: string;
  appInfoReportIssue: string;
  appInfoDeveloper: string;
  appInfoDeveloperName: string;
  appInfoBuiltWith: string;
  appInfoLicense: string;
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
    libraryCards: 'cards',
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
    quizCards: 'Cards',
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
    finish: 'Finish',

    // Help Screen
    helpTitle: 'Help',
    helpIntroTitle: 'Welcome to Recall AI',
    helpIntroText: 'Learn how to use active recall to supercharge your learning. This guide will walk you through everything you need to know.',
    helpGettingStarted: 'Getting Started',
    helpStep1Title: 'Get Your API Key',
    helpStep1Text: 'Visit Google AI Studio and create a free Gemini API key. Go to Settings and add your key to enable AI features.',
    helpStep2Title: 'Upload Your Document',
    helpStep2Text: 'Upload any PDF, DOCX, or TXT file containing your study material. The AI will analyze it and extract key concepts.',
    helpStep3Title: 'Customize Your Quiz',
    helpStep3Text: 'Choose your study depth and number of cards. Enable Smart Enrichment to get questions beyond your document.',
    helpStep4Title: 'Start Learning',
    helpStep4Text: 'Answer questions, mark your responses as correct or incorrect, and review missed cards at the end.',
    helpFaqTitle: 'Frequently Asked Questions',
    helpFaq1Q: 'What is Active Recall?',
    helpFaq1A: 'Active recall is a study technique where you actively stimulate memory during the learning process. Instead of passively reading, you test yourself with questions to strengthen retention.',
    helpFaq2Q: 'Is my data secure?',
    helpFaq2A: 'Yes! Your API key is stored locally on your device. Documents are processed through Google\'s Gemini API using your own key. We never store your documents or API key on our servers.',
    helpFaq3Q: 'What is Smart Enrichment?',
    helpFaq3A: 'Smart Enrichment generates additional questions related to your document content but from broader context. This helps deepen your understanding beyond just the material provided.',
    helpFaq4Q: 'How do I get a free API key?',
    helpFaq4A: 'Visit aistudio.google.com, sign in with your Google account, and create a new API key. The free tier is generous and perfect for student use.',
    helpFaq5Q: 'What file formats are supported?',
    helpFaq5A: 'Currently, we support PDF, DOCX, and TXT files. Make sure your documents contain readable text (not just images).',
    helpNeedMoreHelp: 'Need More Help?',
    helpContactText: 'Found a bug or have a feature request? Visit our GitHub repository to report issues or contribute to the project.',

    // App Info Screen
    appInfoTitle: 'App Info',
    appInfoTagline: 'Stop Passive Reading. Start Active Recall.',
    appInfoAbout: 'About This App',
    appInfoAboutText: 'Recall AI is a mobile application designed to help students and researchers implement the Active Recall study method efficiently. Built to solve real study challenges, this app leverages Google\'s Gemini 2.5 Flash model to process documents and generate meaningful questions instantly.',
    appInfoFeatures: 'Key Features',
    appInfoFeature1Title: 'PDF Analysis',
    appInfoFeature1Text: 'Upload any journal, ebook, or lecture slide and let AI analyze it.',
    appInfoFeature2Title: 'AI-Generated Quizzes',
    appInfoFeature2Text: 'Automatically generates key questions based on document content.',
    appInfoFeature3Title: 'Smart Enrichment',
    appInfoFeature3Text: 'AI generates related questions outside the provided text to broaden understanding.',
    appInfoFeature4Title: 'Privacy First (BYOK)',
    appInfoFeature4Text: 'Your API key is stored locally. Use your own free tier key with no paywalls.',
    appInfoTech: 'Technology',
    appInfoSourceCode: 'Source Code (GitHub)',
    appInfoGetApiKey: 'Get Free API Key',
    appInfoReportIssue: 'Report an Issue',
    appInfoDeveloper: 'Developer',
    appInfoDeveloperName: 'Built by UnilaStack',
    appInfoBuiltWith: 'Made with dedication for better learning',
    appInfoLicense: 'MIT License - Open Source'
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
    libraryCards: 'kartu',
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
    quizCards: 'Kartu',
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
    finish: 'Selesai',

    // Help Screen
    helpTitle: 'Bantuan',
    helpIntroTitle: 'Selamat Datang di Recall AI',
    helpIntroText: 'Pelajari cara menggunakan active recall untuk meningkatkan pembelajaran Anda. Panduan ini akan memandu Anda melalui semua yang perlu Anda ketahui.',
    helpGettingStarted: 'Memulai',
    helpStep1Title: 'Dapatkan API Key Anda',
    helpStep1Text: 'Kunjungi Google AI Studio dan buat kunci API Gemini gratis. Buka Pengaturan dan tambahkan kunci Anda untuk mengaktifkan fitur AI.',
    helpStep2Title: 'Unggah Dokumen Anda',
    helpStep2Text: 'Unggah file PDF, DOCX, atau TXT yang berisi materi belajar Anda. AI akan menganalisisnya dan mengekstrak konsep kunci.',
    helpStep3Title: 'Sesuaikan Kuis Anda',
    helpStep3Text: 'Pilih kedalaman belajar dan jumlah kartu Anda. Aktifkan Pengayaan Cerdas untuk mendapatkan pertanyaan di luar dokumen Anda.',
    helpStep4Title: 'Mulai Belajar',
    helpStep4Text: 'Jawab pertanyaan, tandai jawaban Anda sebagai benar atau salah, dan tinjau kartu yang terlewat di akhir.',
    helpFaqTitle: 'Pertanyaan yang Sering Diajukan',
    helpFaq1Q: 'Apa itu Active Recall?',
    helpFaq1A: 'Active recall adalah teknik belajar di mana Anda secara aktif merangsang memori selama proses pembelajaran. Alih-alih membaca pasif, Anda menguji diri sendiri dengan pertanyaan untuk memperkuat retensi.',
    helpFaq2Q: 'Apakah data saya aman?',
    helpFaq2A: 'Ya! Kunci API Anda disimpan secara lokal di perangkat Anda. Dokumen diproses melalui API Gemini Google menggunakan kunci Anda sendiri. Kami tidak pernah menyimpan dokumen atau kunci API Anda di server kami.',
    helpFaq3Q: 'Apa itu Pengayaan Cerdas?',
    helpFaq3A: 'Pengayaan Cerdas menghasilkan pertanyaan tambahan terkait konten dokumen Anda tetapi dari konteks yang lebih luas. Ini membantu memperdalam pemahaman Anda di luar materi yang disediakan.',
    helpFaq4Q: 'Bagaimana cara mendapatkan kunci API gratis?',
    helpFaq4A: 'Kunjungi aistudio.google.com, masuk dengan akun Google Anda, dan buat kunci API baru. Tier gratis sangat murah hati dan sempurna untuk penggunaan mahasiswa.',
    helpFaq5Q: 'Format file apa yang didukung?',
    helpFaq5A: 'Saat ini, kami mendukung file PDF, DOCX, dan TXT. Pastikan dokumen Anda berisi teks yang dapat dibaca (bukan hanya gambar).',
    helpNeedMoreHelp: 'Butuh Bantuan Lebih?',
    helpContactText: 'Menemukan bug atau memiliki permintaan fitur? Kunjungi repositori GitHub kami untuk melaporkan masalah atau berkontribusi pada proyek.',

    // App Info Screen
    appInfoTitle: 'Info Aplikasi',
    appInfoTagline: 'Berhenti Membaca Pasif. Mulai Active Recall.',
    appInfoAbout: 'Tentang Aplikasi Ini',
    appInfoAboutText: 'Recall AI adalah aplikasi mobile yang dirancang untuk membantu siswa dan peneliti menerapkan metode belajar Active Recall secara efisien. Dibangun untuk menyelesaikan tantangan belajar nyata, aplikasi ini memanfaatkan model Gemini 2.5 Flash dari Google untuk memproses dokumen dan menghasilkan pertanyaan bermakna secara instan.',
    appInfoFeatures: 'Fitur Utama',
    appInfoFeature1Title: 'Analisis PDF',
    appInfoFeature1Text: 'Unggah jurnal, ebook, atau slide kuliah apa pun dan biarkan AI menganalisisnya.',
    appInfoFeature2Title: 'Kuis yang Dihasilkan AI',
    appInfoFeature2Text: 'Secara otomatis menghasilkan pertanyaan kunci berdasarkan konten dokumen.',
    appInfoFeature3Title: 'Pengayaan Cerdas',
    appInfoFeature3Text: 'AI menghasilkan pertanyaan terkait di luar teks yang disediakan untuk memperluas pemahaman.',
    appInfoFeature4Title: 'Privasi Pertama (BYOK)',
    appInfoFeature4Text: 'Kunci API Anda disimpan secara lokal. Gunakan kunci tier gratis Anda sendiri tanpa paywall.',
    appInfoTech: 'Teknologi',
    appInfoSourceCode: 'Kode Sumber (GitHub)',
    appInfoGetApiKey: 'Dapatkan Kunci API Gratis',
    appInfoReportIssue: 'Laporkan Masalah',
    appInfoDeveloper: 'Pengembang',
    appInfoDeveloperName: 'Dibuat oleh UnilaStack',
    appInfoBuiltWith: 'Dibuat dengan dedikasi untuk pembelajaran yang lebih baik',
    appInfoLicense: 'Lisensi MIT - Open Source'
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