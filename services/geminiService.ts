import { GoogleGenAI, Type } from "@google/genai";
import type { SentimentAnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sentimentAnalysisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            text: {
                type: Type.STRING,
                description: "The original text that was analyzed."
            },
            sentiment: {
                type: Type.STRING,
                description: "The sentiment of the text.",
                enum: ['positive', 'negative', 'neutral'],
            },
            confidence: {
                type: Type.NUMBER,
                description: "A float between 0.0 and 1.0 representing confidence.",
            },
            keywords: {
                type: Type.ARRAY,
                description: "An array of 3-5 keywords or phrases from the text that most influenced the sentiment.",
                items: {
                    type: Type.STRING
                }
            },
            explanation: {
                type: Type.STRING,
                description: "A brief, one-sentence explanation for the classification."
            }
        },
        required: ["text", "sentiment", "confidence", "keywords", "explanation"]
    }
};

export const getSentimentAnalysis = async (texts: string[]): Promise<SentimentAnalysisResult[]> => {
  const model = "gemini-2.5-flash";

  const systemInstruction = `You are an expert sentiment analysis AI. For each text provided, analyze it and return a structured JSON object with its sentiment, confidence, keywords, explanation, and the original text. The output MUST be a JSON array of objects, one for each input text.`;
  
  const prompt = `Analyze the sentiment of the following texts:\n${JSON.stringify(texts)}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: sentimentAnalysisSchema,
      },
    });

    const jsonStr = response.text.trim();
    // The parsed data should conform to our schema, but without the 'id' field
    const parsedData: Omit<SentimentAnalysisResult, 'id'>[] = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
        console.error("Parsed data is not an array:", parsedData);
        throw new Error("API did not return a valid array of sentiment analysis results.");
    }

    // Add a unique ID to each result.
    return parsedData.map((item, index) => {
        // Basic validation for the received item
        if (!item.text || !item.sentiment || typeof item.confidence !== 'number' || !Array.isArray(item.keywords) || !item.explanation) {
            console.error(`API returned an incomplete or malformed item at index ${index}.`, item);
            throw new Error(`API returned an incomplete or malformed item at index ${index}.`);
        }
        return {
            ...item,
            id: `${Date.now()}-${index}`,
        }
    });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('JSON')) {
             throw new Error(`Failed to parse sentiment analysis response from the API. The format might be incorrect.`);
        }
        throw new Error(`Failed to get sentiment analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred during sentiment analysis.");
  }
};
