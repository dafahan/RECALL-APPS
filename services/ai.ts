
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  async generateFlashcards(topic: string, count: number): Promise<{ title: string; cards: { question: string; answer: string }[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Mock PDF Text content if the topic is just a filename or short string
    // In a real app, we would extract text from PDF here.
    const context = `
      Topic: ${topic}
      
      (Simulated Document Context):
      Neural networks are a subset of machine learning and are at the heart of deep learning algorithms. 
      Their name and structure are inspired by the human brain, mimicking the way that biological neurons signal to one another.
      A neural network consists of three main layers: an input layer, one or more hidden layers, and an output layer.
      Perceptrons are the fundamental building blocks of neural networks.
      Backpropagation is the central mechanism by which neural networks learn. It is the messenger telling the network whether or not the net made a mistake when it made a prediction.
      Convolutional Neural Networks (CNNs) are primarily used for image processing and computer vision tasks.
      Recurrent Neural Networks (RNNs) are designed to interpret temporal or sequential information, such as language translation.
      Overfitting occurs when a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data.
      Regularization techniques like Dropout are used to prevent overfitting.
    `;

    const prompt = `
      You are an expert tutor. Create exactly ${count} flashcards based on the provided text/topic: "${topic}".
      
      Return valid JSON only. The response must be a JSON object with this structure:
      {
        "title": "A short, 3-5 word title for this deck based on the content",
        "cards": [
          {
            "question": "Concept question",
            "answer": "Clear, concise answer"
          }
        ]
      }
      
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || "{}";
      const cleanText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("AI Generation Error:", error);
      // Fallback if AI fails (to prevent app crash during demo)
      return {
        title: `${topic} (Offline)`,
        cards: Array.from({ length: count }).map((_, i) => ({
          question: `What is a key concept of ${topic} (${i + 1})?`,
          answer: "This is a placeholder answer generated because the AI request failed or the key is invalid."
        }))
      };
    }
  }
};
