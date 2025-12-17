import { GoogleGenAI } from "@google/genai";
import { db } from './db';
import * as FileSystem from 'expo-file-system';

export const aiService = {
  /**
   * Extract text content from a file
   */
  async extractFileContent(fileUri: string, mimeType: string): Promise<string> {
    try {
      // For text files, read directly
      if (mimeType === 'text/plain') {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
      }

      // For PDFs, we'll use Gemini's file API or extract what we can
      // Note: Full PDF parsing would require native libraries
      // For now, we'll use the file URI directly with Gemini
      return '';
    } catch (error) {
      console.error('Error extracting file content:', error);
      return '';
    }
  },

  /**
   * Generate flashcards from document content
   */
  async generateFlashcards(
    topic: string,
    count: number,
    fileContent?: string,
    fileUri?: string,
    mimeType?: string,
    language: 'id' | 'en' = 'en'
  ): Promise<{ title: string; cards: { question: string; answer: string }[] }> {
    // Get API key from settings
    const settings = await db.getSettings();
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      throw new Error('API key not configured. Please add your Gemini API key in Settings.');
    }

    const ai = new GoogleGenAI({ apiKey });

    // Extract content if file URI provided
    let documentContent = fileContent || '';
    if (!documentContent && fileUri && mimeType) {
      documentContent = await this.extractFileContent(fileUri, mimeType);
    }

    // Determine if we have actual document content or just a topic
    const hasDocumentContent = documentContent && documentContent.length > 100;

    // Build the prompt based on whether we have document content
    const prompt = hasDocumentContent
      ? this.buildDocumentBasedPrompt(topic, count, documentContent, settings.aiSuggestions, language)
      : this.buildTopicBasedPrompt(topic, count, language);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const text = response.text || "{}";
      const cleanText = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);

      // Validate the response
      if (!result.title || !result.cards || !Array.isArray(result.cards)) {
        throw new Error('Invalid response format from AI');
      }

      return result;
    } catch (error) {
      console.error("AI Generation Error:", error);

      // Provide more specific error message
      if (error instanceof Error) {
        if (error.message.includes('API_KEY') || error.message.includes('401')) {
          throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
        }
        throw new Error(`AI generation failed: ${error.message}`);
      }

      throw new Error('Failed to generate flashcards. Please try again.');
    }
  },

  /**
   * Build prompt for document-based flashcard generation
   */
  buildDocumentBasedPrompt(topic: string, count: number, content: string, enableEnrichment: boolean, language: 'id' | 'en' = 'en'): string {
    const enrichmentInstruction = enableEnrichment
      ? `\n- You may also generate max 50% related questions that go beyond the document but are conceptually connected to help deepen understanding.`
      : '';

    const languageInstruction = language === 'id'
      ? 'Buat semua pertanyaan dan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami.'
      : 'Create all questions and answers in clear, easy-to-understand English.';

    const questionTypesText = language === 'id'
      ? `**Jenis Pertanyaan yang Digunakan**:
- Pertanyaan definisi: "Apa itu...?", "Definisikan..."
- Pertanyaan penjelasan: "Bagaimana... bekerja?", "Jelaskan proses..."
- Pertanyaan perbandingan: "Apa perbedaan antara... dan...?"
- Pertanyaan aplikasi: "Kapan Anda menggunakan...?", "Mengapa... penting?"
- Pertanyaan hubungan: "Bagaimana... berhubungan dengan...?"`
      : `**Question Types to Use**:
- Definition questions: "What is...?", "Define..."
- Explanation questions: "How does... work?", "Explain the process of..."
- Comparison questions: "What is the difference between... and...?"
- Application questions: "When would you use...?", "Why is... important?"
- Relationship questions: "How does... relate to...?"`;

    return `You are an expert educational content creator specializing in creating effective flashcards for active recall and spaced repetition learning.

**Task**: Create exactly ${count} high-quality flashcards from the following document about "${topic}".

**Document Content**:
${content.substring(0, 8000)} ${content.length > 8000 ? '...(content truncated)' : ''}

**Instructions**:
${languageInstruction}
1. **Extract Key Concepts**: Identify the most important concepts, definitions, processes, and relationships in the document
2. **Create Focused Questions**: Each flashcard should test ONE specific concept
3. **Use Active Recall**: Frame questions to make learners retrieve information from memory
4. **Provide Clear Answers**: Answers should be concise but complete (2-4 sentences)
5. **Progressive Difficulty**: Mix basic recall questions with application/understanding questions
6. **Avoid Ambiguity**: Questions should have clear, unambiguous answers${enrichmentInstruction}

${questionTypesText}

**Response Format** (JSON only):
{
  "title": "Concise 3-5 word title for this deck",
  "cards": [
    {
      "question": "Clear, specific question testing one concept",
      "answer": "Accurate, concise answer (2-4 sentences)"
    }
  ]
}

Generate exactly ${count} cards. Return only valid JSON, no markdown formatting.`;
  },

  /**
   * Build prompt for topic-based flashcard generation (no document)
   */
  buildTopicBasedPrompt(topic: string, count: number, language: 'id' | 'en' = 'en'): string {
    const languageInstruction = language === 'id'
      ? 'Buat semua pertanyaan dan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami.'
      : 'Create all questions and answers in clear, easy-to-understand English.';

    const questionTypesText = language === 'id'
      ? `**Jenis Pertanyaan**:
- Definisi dan terminologi
- Konsep dan prinsip inti
- Cara kerja (proses/mekanisme)
- Aplikasi dan kasus penggunaan
- Perbandingan dan hubungan
- Fakta dan detail penting`
      : `**Question Types**:
- Definitions and terminology
- Core concepts and principles
- How things work (processes/mechanisms)
- Applications and use cases
- Comparisons and relationships
- Important facts and details`;

    return `You are an expert educational content creator specializing in creating effective flashcards.

**Task**: Create exactly ${count} high-quality flashcards about "${topic}".

**Instructions**:
${languageInstruction}
1. Cover fundamental concepts and important details about "${topic}"
2. Each flashcard should test ONE specific concept
3. Use active recall - make learners retrieve information
4. Answers should be concise but complete (2-4 sentences)
5. Progress from basic to more advanced concepts
6. Include practical applications where relevant

${questionTypesText}

**Response Format** (JSON only):
{
  "title": "Concise 3-5 word title for this deck",
  "cards": [
    {
      "question": "Clear, specific question",
      "answer": "Accurate, concise answer (2-4 sentences)"
    }
  ]
}

Generate exactly ${count} cards. Return only valid JSON, no markdown formatting.`;
  }
};
