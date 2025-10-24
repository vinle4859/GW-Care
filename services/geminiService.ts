
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { DailyActivity, ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

const dailyActivitiesSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      task: { type: Type.STRING },
      completed: { type: Type.BOOLEAN }
    },
    required: ["id", "task", "completed"]
  }
};


export async function generateDailyActivities(
    profile: string,
    activityTemplates: any,
    language: 'vi' | 'en'
): Promise<DailyActivity[] | null> {
    if (!ai) {
        console.error("Cannot generate activities: Gemini API is not initialized.");
        return null;
    }
    try {
        const langInstruction = language === 'vi' ? 'The activities must be in Vietnamese.' : 'The activities must be in English.';
        const prompt = `
            Based on the user's mental wellness profile of "${profile}", generate a list of 3 to 5 simple, actionable activities for today.
            Use the following categories and examples as inspiration, but create new, relevant, and creative tasks.
            The tasks should be encouraging and supportive.

            Activity Inspiration: ${JSON.stringify(activityTemplates)}

            Each activity object must have a unique 'id' (e.g., a timestamp-based string like 'act-1678886400000'), a 'task' description, and 'completed' set to false.
            Return the entire list as a single JSON array matching the provided schema. Do not include any markdown formatting.
            ${langInstruction}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { activities: dailyActivitiesSchema },
                    required: ["activities"]
                },
            },
        });

        const jsonString = response.text.trim();
        if (!jsonString) {
            console.error("Gemini API returned an empty response for daily activities.");
            return null;
        }
        const result = JSON.parse(jsonString);
        return result.activities as DailyActivity[];
    } catch (error) {
        console.error("Error generating daily activities:", error);
        return null;
    }
}


let chatInstance: Chat | null = null;

const getChatInstance = (language: 'vi' | 'en') => {
  if (!ai) {
    return null;
  }
  
  const systemInstruction = language === 'vi' 
    ? "You are Glowy, a friendly and empathetic AI mental wellness companion from GW-Care. Respond in Vietnamese. You are not a doctor, provide supportive conversation and gentle encouragement. If a user expresses serious distress, gently guide them to seek professional help and provide a hotline number for Vietnam (e.g., 111)."
    : "You are Glowy, a friendly and empathetic AI mental wellness companion from GW-Care. Respond in English. You are not a doctor, provide supportive conversation and gentle encouragement. If a user expresses serious distress, gently guide them to seek professional help and provide a national crisis hotline number (e.g., 988 in the US).";

  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
  }
  // This is a simplified approach; a real app might need to re-create the instance if the language changes.
  return chatInstance;
};


export async function sendChatMessage(message: string, history: ChatMessage[], language: 'vi' | 'en'): Promise<string> {
   if (!ai) {
        const errorMsg = "Chat is unavailable: API key not configured.";
        console.error(errorMsg);
        return errorMsg;
    }
  try {
    const chat = getChatInstance(language);
    if (!chat) return "Chat is currently unavailable.";
    
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending chat message:", error);
    return "I'm having a little trouble connecting right now. Please try again in a moment.";
  }
}
