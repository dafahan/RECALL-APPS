import { GoogleGenAI } from "@google/genai";
import { db } from './db';
import * as FileSystem from 'expo-file-system';

export const aiService = {
  /**
   * Extract text content from files (including images with OCR)
   */
  async extractFileContent(fileUri: string, mimeType: string, apiKey?: string): Promise<string> {
    try {
      // Text files - read directly
      if (mimeType === 'text/plain') {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
      }
      
      // Images (handwriting, photos of documents) - use Gemini Vision OCR
      if (mimeType.startsWith('image/')) {
        if (!apiKey) {
          console.warn('No API key for image OCR');
          return '';
        }
        
        const ai = new GoogleGenAI({ apiKey });
        
        // Read image as base64
        const base64Image = await FileSystem.readAsStringAsync(fileUri, {
          encoding: 'base64',
        });
        
        // Use Gemini Vision to extract text from image
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
                {
                  text: `Extract ALL text from this image. This may contain handwritten notes, printed text, or a mix of both.

Instructions:
- Transcribe every word you can read, maintaining the original structure
- If it's handwritten, do your best to interpret the handwriting
- Include all headings, bullet points, numbered lists, etc.
- If there are diagrams or charts, describe them briefly
- Output ONLY the extracted text, no commentary

Extracted text:`
                },
              ],
            },
          ],
          config: {
            temperature: 0.1, // Very low for accurate OCR
          },
        });
        
        const extractedText = response.text || '';
        console.log('OCR extracted text length:', extractedText.length);
        return extractedText;
      }
      
      // PDF and other formats - for future implementation
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
      // Pass apiKey for image OCR capability
      documentContent = await this.extractFileContent(fileUri, mimeType, apiKey);
    }

    const hasDocumentContent = documentContent && documentContent.length > 50; // Lowered threshold
    
    // Check enrichment setting
    const useEnrichment = settings.aiSuggestions;

    const prompt = hasDocumentContent
      ? this.buildDocumentBasedPrompt(topic, count, documentContent, useEnrichment, language)
      : this.buildTopicBasedPrompt(topic, count, language);

    // Temperature: 0.4 memberikan keseimbangan antara fokus dan variasi
    // Terlalu rendah (0.1) = AI terjebak pola berulang/metadata
    // Terlalu tinggi (0.7+) = AI hallucinate
    const temperature = (hasDocumentContent && !useEnrichment) ? 0.4 : 0.5;

    // Models to try in order of preference (fallback if one is overloaded)
    const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
    
    let lastError: Error | null = null;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
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

        console.log(`Success with model: ${model}`);
        return result;
      } catch (error) {
        console.warn(`Model ${model} failed:`, error);
        lastError = error as Error;
        
        // If it's overloaded (503) or rate limited, try next model
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes('503') || 
            errorMsg.includes('overloaded') ||
            errorMsg.includes('UNAVAILABLE') ||
            errorMsg.includes('429')) {
          continue; // Try next model
        }
        
        // For API key errors, throw immediately with clear message
        if (errorMsg.includes('API_KEY') || errorMsg.includes('401')) {
          throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
        }
        
        // For leaked API key, throw immediately
        if (errorMsg.includes('leaked') || errorMsg.includes('403')) {
          throw new Error('This API key has been reported as leaked and is disabled. Please create a new API key at https://aistudio.google.com/app/apikey');
        }
        
        // For quota exceeded, throw immediately with clear message
        if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('Daily API quota exceeded. Please wait until tomorrow or use a different API key.');
        }
        
        // For other errors, try next model
        continue;
      }
    }
    
    // All models failed
    const finalErrorMsg = lastError?.message || 'Unknown error';
    if (finalErrorMsg.includes('503') || finalErrorMsg.includes('UNAVAILABLE')) {
      throw new Error('All AI models are currently busy. Please try again in a few moments.');
    }
    if (finalErrorMsg.includes('429') || finalErrorMsg.includes('quota')) {
      throw new Error('Daily API quota exceeded. Please wait until tomorrow or use a different API key.');
    }
    throw new Error(`AI generation failed. Please try again later.`);
  },

  /**
   * Build prompt for document-based flashcard generation
   */
  buildDocumentBasedPrompt(topic: string, count: number, content: string, enableEnrichment: boolean, language: 'id' | 'en' = 'en'): string {
    // NOTE: 'topic' parameter is intentionally IGNORED when document content exists
    // to prevent AI from focusing on filename instead of actual content
    
    const strictnessInstruction = enableEnrichment
      ? `- You may include up to 30% related questions that expand on the document's themes.`
      : `- STRICT CONTENT-ONLY MODE: Every single question MUST be directly answerable from the text below.
- You are FORBIDDEN from mentioning, referencing, or asking about:
  * The filename or document name
  * The file format or extension
  * Any metadata (author, date, title header)
  * Anything not explicitly written in the content
- If the document content is too short or lacks substance, create fewer but higher quality cards.`;

    const languageInstruction = language === 'id'
      ? 'Gunakan Bahasa Indonesia yang jelas.'
      : 'Use clear English.';

    const examplesText = language === 'id'
      ? `**CONTOH PERTANYAAN BURUK (DILARANG)**:
❌ "Apa nama file dokumen ini?"
❌ "Apa judul dokumen?"
❌ "Dokumen ini membahas tentang apa?"
❌ "Siapa penulis dokumen ini?"

**CONTOH PERTANYAAN BAGUS**:
✅ "Apa yang dimaksud dengan [konsep yang dijelaskan di teks]?"
✅ "Bagaimana proses [sesuatu yang dibahas detail di teks]?"
✅ "Mengapa [alasan yang disebutkan di teks] penting?"`
      : `**BAD QUESTIONS (FORBIDDEN)**:
❌ "What is the filename?"
❌ "What is the document title?"
❌ "What is this document about?"
❌ "Who wrote this document?"

**GOOD QUESTIONS**:
✅ "What is [concept explained in text]?"
✅ "How does [process described in text] work?"
✅ "Why is [reason mentioned in text] important?"`;

    const processedContent = content.length > 50000 ? content.substring(0, 50000) + '...(truncated)' : content;

    // Temperature akan dinaikkan untuk memberikan variasi yang lebih baik
    return `You are creating flashcards for studying. Your ONLY source of information is the text inside <content> tags below.

## ABSOLUTE RULES - VIOLATION = FAILURE
1. NEVER ask about the filename, document title, or any metadata
2. NEVER ask "What is this document about?" or similar meta-questions  
3. ONLY ask about specific facts, concepts, or processes EXPLICITLY stated in the content
4. If you cannot find ${count} substantive topics in the content, create fewer cards rather than asking about metadata

## Task
Create ${count} flashcards. ${languageInstruction}

${strictnessInstruction}

${examplesText}

<content>
${processedContent}
</content>

## Output Format (JSON only)
{
  "title": "Brief topic summary based on content themes",
  "cards": [
    {"question": "Specific question about content", "answer": "Answer from content (2-3 sentences)"}
  ]
}

IMPORTANT: Read the content carefully. Extract the main concepts and create questions about THOSE concepts only. Ignore any filename or metadata completely.`;
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