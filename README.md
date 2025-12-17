# 🧠 Recall AI - Active Recall Study Companion

![Recall AI Banner](./banner.png)
<p align="center">
  <img src="https://img.shields.io/badge/Built_with-Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
</p>

<p align="center">
  <strong>Stop Passive Reading. Start Active Recall.</strong><br>
  Turn your PDF journals and lecture notes into interactive quizzes instantly.
</p>

---

## 📖 About

**Recall AI** is a mobile application designed to help students and researchers implement the **Active Recall** study method efficiently. Instead of just reading and highlighting text (passive learning), users can upload their study materials, and the AI will generate testing questions to challenge their understanding.

Built during an "overnight sprint" to solve a real college assignment problem, this app leverages **Google's Gemini 2.5 Flash** model with its massive context window to process full documents in seconds.

## ✨ Key Features

- 📄 **PDF Analysis:** Upload any journal, ebook, or lecture slide (PDF).
- 🧠 **AI-Generated Quizzes:** Automatically generates key questions based on the document content.
- 🚀 **Smart Enrichment Mode:** Goes beyond the document! AI generates related questions outside the provided text to broaden your understanding and context.
- ⚡ **Fast & Efficient:** Powered by Gemini 2.5 Flash for sub-second processing.
- 🔑 **BYOK Architecture (Bring Your Own Key):**
  - **Privacy First:** Your API key is stored locally on your device.
  - **Free & Unlimited:** Use your own free tier Google AI Studio key. No paywalls from this app.

## 📱 Screenshots

<p align="center">
  <img src="https://via.placeholder.com/200x400?text=Home" width="200" />
  <img src="https://via.placeholder.com/200x400?text=PDF+Upload" width="200" />
  <img src="https://via.placeholder.com/200x400?text=Quiz+Mode" width="200" />
</p>

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
- **Language:** TypeScript / JavaScript
- **AI Model:** Google Gemini 2.5 Flash
- **Styling:** NativeWind (Tailwind CSS for React Native) / StyleSheet
- **State Management:** React Context / Zustand
- **PDF Handling:** `expo-document-picker`

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- [Expo Go](https://expo.dev/client) app installed on your Android device.
- A free API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/dafahan/recall-ai.git](https://github.com/dafahan/recall.git)
   cd recall-ai