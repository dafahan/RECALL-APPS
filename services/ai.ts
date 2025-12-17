import { GoogleGenAI } from "@google/genai";
import { db } from './db';
import * as FileSystem from 'expo-file-system';

export const aiService = {
  // ... (extractFileContent tetap sama) ...
  async extractFileContent(fileUri: string, mimeType: string): Promise<string> {
    try {
      if (mimeType === 'text/plain') {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
      }
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
    const settings = await db.getSettings();
    const apiKey = settings.apiKey || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      throw new Error('API key not configured. Please add your Gemini API key in Settings.');
    }

    const ai = new GoogleGenAI({ apiKey });

    let documentContent = fileContent || '';
    if (!documentContent && fileUri && mimeType) {
      documentContent = await this.extractFileContent(fileUri, mimeType);
    }

    const hasDocumentContent = documentContent && documentContent.length > 100;
    
    // Check enrichment setting
    const useEnrichment = settings.aiSuggestions;

    const prompt = hasDocumentContent
      ? this.buildDocumentBasedPrompt(topic, count, documentContent, useEnrichment, language)
      : this.buildTopicBasedPrompt(topic, count, language);

    // TWEAK: Gunakan temperature lebih rendah jika Strict Mode (tanpa enrichment)
    // agar AI lebih patuh pada konteks.
    const temperature = (hasDocumentContent && !useEnrichment) ? 0.3 : 0.7;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite', // Pastikan model ini valid atau gunakan 'gemini-1.5-flash'
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: temperature, 
        }
      });

      const text = response.text || "{}";
      const cleanText = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanText);

      if (!result.title || !result.cards || !Array.isArray(result.cards)) {
        throw new Error('Invalid response format from AI');
      }

      return result;
    } catch (error) {
      console.error("AI Generation Error:", error);
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
    // TWEAK 1: Strictness Logic yang lebih agresif
    const strictnessInstruction = enableEnrichment
      ? `\n- **Enrichment Allowed**: You may generate up to 50% related questions that go beyond the document to help deepen understanding.`
      : `\n- **STRICTLY GROUNDED**: All questions MUST be answerable ONLY using the information provided in the <document_content> tags below.
- **DO NOT** use outside knowledge or hallucinate facts not present in the text.
- If the document does not mention a specific detail, DO NOT ask about it.`;

    const languageInstruction = language === 'id'
      ? 'Buat semua pertanyaan dan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami.'
      : 'Create all questions and answers in clear, easy-to-understand English.';

    const questionTypesText = language === 'id'
      ? `**Jenis Pertanyaan**:
- Definisi ("Apa itu...?")
- Penjelasan Proses ("Bagaimana cara kerja...?")
- Hubungan ("Bagaimana kaitan antara A dan B?")`
      : `**Question Types**:
- Definition
- Process/Explanation
- Relationship`;

    // TWEAK 2: Hapus limit 8000 char jika pakai Gemini Flash (Context window dia besar, sayang kalau dipotong)
    // Jika memang harus dipotong, pastikan potongannya rapi.
    const processedContent = content.length > 30000 ? content.substring(0, 30000) + '...(truncated)' : content;

    // TWEAK 3: Struktur Prompt dengan XML Tagging
    return `You are an expert educational content creator.

**Task**: Create exactly ${count} high-quality flashcards based on the provided document about "${topic}".

${strictnessInstruction}

**Instructions**:
1. ${languageInstruction}
2. Extract key concepts directly from the source text.
3. Each flashcard must test ONE specific concept.
4. Use Active Recall phrasing.
5. Answers must be concise (2-4 sentences).

${questionTypesText}

<document_content>
${processedContent}
</document_content>

**Response Format** (JSON only):
{
  "title": "Concise title",
  "cards": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ]
}
Generate exactly ${count} cards. JSON format only.`;
  },

  // ... (buildTopicBasedPrompt tetap sama) ...
  buildTopicBasedPrompt(topic: string, count: number, language: 'id' | 'en' = 'en'): string {
      // (Kode yang sudah ada sebelumnya oke, karena ini memang general knowledge)
      const languageInstruction = language === 'id'
      ? 'Buat semua pertanyaan dan jawaban dalam Bahasa Indonesia yang jelas dan mudah dipahami.'
      : 'Create all questions and answers in clear, easy-to-understand English.';

    return `You are an expert educational content creator.
Task: Create ${count} flashcards about "${topic}".
${languageInstruction}

Rules:
1. Cover fundamental concepts.
2. Concise answers (2-4 sentences).
3. Progress from basic to advanced.

Response Format (JSON):
{
  "title": "Title",
  "cards": [{"question": "Q", "answer": "A"}]
}`;
  }
};