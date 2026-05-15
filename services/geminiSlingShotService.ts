import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini with correct constructor for @google/genai SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Helper to call Gemini with exponential backoff retry for 503 errors
 */
async function callGeminiWithRetry(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isUnavailable = error?.message?.includes('503') || 
                          error?.status === 503 || 
                          error?.message?.toLowerCase().includes('unavailable') ||
                          error?.message?.toLowerCase().includes('high demand');
      
      if (isUnavailable && i < maxRetries) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Gemini 503 detected. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export interface JointAngles {
  shoulder: number;
  elbow: number;
  wrist: number;
  stance?: number;
}

export interface BallData {
  x: number;
  y: number;
  speed?: string;
  distanceToPlayer?: number;
}

export interface AnalysisResponse {
  activity: string;
  jointAngles: JointAngles;
  ballData?: BallData;
  pointOfContact?: string;
  powerScore: number;
  formQuality: string;
  feedback: string;
  platformStability?: number;
  jumpHeight?: number;
}

export interface SessionReport {
  percentile: number;
  accuracy: number;
  maxVelocity: number;
  metrics: {
    STAB: number;
    POW: number;
    ROT: number;
    EXT: number;
    TIM: number;
  };
  strengths: { title: string; desc: string }[];
  corrections: { title: string; desc: string }[];
  feedback: string;
}

/**
 * Process a single frame using Gemini.
 */
export async function processVolleyFrame(
  base64Image: string, 
  mode: 'LIVE' | 'UPLOAD'
): Promise<AnalysisResponse> {
  const systemInstruction = `
    You are a friendly and experienced Volleyball Coach. Analyze the provided image frame for quick technical tips.
    Your goal is to give feedback that is long, detailed, and helpful, but written in very simple English that any volleyball player or fan would understand.
    Avoid complex medical or biomechanical words (like "kinetic chain", "biomechanical efficiency", or "isometric"). 
    Instead, use everyday terms. For example, instead of "kinetic sequencing", talk about "how your power moves from your feet to your hit".
    Be specific about what they are doing right or wrong, but keep the tone supportive and easy to follow.
    Provide a thorough explanation in plain language.
    Return a JSON object matching the requested schema.
  `;

  try {
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { text: "Analyze the biomechanics of this impact frame." },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image.split(',')[1] || base64Image
          }
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["activity", "jointAngles", "powerScore", "formQuality", "feedback"],
          properties: {
             activity: { type: Type.STRING },
             jointAngles: {
               type: Type.OBJECT,
               properties: {
                 shoulder: { type: Type.NUMBER },
                 elbow: { type: Type.NUMBER },
                 wrist: { type: Type.NUMBER },
                 stance: { type: Type.NUMBER }
               }
             },
             ballData: {
               type: Type.OBJECT,
               properties: {
                 x: { type: Type.NUMBER },
                 y: { type: Type.NUMBER }
               }
             },
             pointOfContact: { type: Type.STRING },
             platformStability: { type: Type.NUMBER },
             jumpHeight: { type: Type.NUMBER },
             powerScore: { type: Type.NUMBER },
             formQuality: { type: Type.STRING },
             feedback: { type: Type.STRING }
          }
        }
      }
    }));

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Vision Impact Error:", error);
    throw error;
  }
}

/**
 * Generate session report using Gemini.
 */
export async function generateSessionReport(sessionData: any): Promise<SessionReport> {
  const systemInstruction = `
    You are a friendly and encouraging Volleyball Coach and Performance Analyst. Summarize the session data into a helpful recap for the player.
    Identify big-picture trends in how the athlete is playing. 
    Your feedback MUST be easy to understand for an average volleyballer. Use plain English.
    Instead of saying "kinetic chain" or "biometrics", explain how their movements help or hurt their play (e.g., "how you land safely" instead of "injury prevention on high-impact landing").
    Be detailed and provide long, thoughtful feedback, but avoid fancy jargon.
    Give them simple drills they can actually do to get better.
  `;

  try {
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ text: `Session Data: ${JSON.stringify(sessionData)}` }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            percentile: { type: Type.NUMBER },
            accuracy: { type: Type.NUMBER },
            maxVelocity: { type: Type.NUMBER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                STAB: { type: Type.NUMBER },
                POW: { type: Type.NUMBER },
                ROT: { type: Type.NUMBER },
                EXT: { type: Type.NUMBER },
                TIM: { type: Type.NUMBER }
              }
            },
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  desc: { type: Type.STRING }
                }
              }
            },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  desc: { type: Type.STRING }
                }
              }
            },
            feedback: { type: Type.STRING }
          }
        }
      }
    }));

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Report Error:", error);
    throw error;
  }
}

/**
 * Identify people using Gemini Vision.
 */
export async function identifyPeopleInVideo(images: string[]): Promise<string[]> {
  const systemInstruction = `
    You are an AI sports coordinator. Identify and describe unique people visible in these volleyball images.
    Provide a "physical fingerprint" for each person: clothing color, gear (knee pads, etc.), shoes, and socks.
    Keep descriptions detailed but short (under 15 words).
    Return format: { "people": [string, ...] }
  `;

  try {
    const contentParts = images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.split(',')[1] || img
      }
    }));

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { text: "Identify the unique individuals in these frames." },
        ...contentParts as any
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["people"],
          properties: {
            people: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    }));

    const result = JSON.parse(response.text);
    return result.people;
  } catch (err) {
    console.error("Gemini Identification error:", err);
    return ["Athlete in frame"];
  }
}

/**
 * Deep analysis of a target using Gemini.
 */
export async function analyzeFullVideo(images: string[], targetDescription: string): Promise<AnalysisResponse[]> {
  const systemInstruction = `
    You are a friendly Volleyball Coach. Analyze the play of the athlete described as: "${targetDescription}". 
    Provide a detailed breakdown of how they are moving across these pictures.
    For each thing you see them do, talk about: 
    1) Getting ready (how they move before hitting/passing).
    2) The hit or pass itself (how they use their arms and legs).
    3) Finishing the move (how they land or move to the next spot).
    Point out specific things to fix (like "keeping your arm higher", "getting your arms out early for a pass", or "landing on both feet") and explain why it helps.
    Use simple English that anyone would understand, but keep the feedback long and thorough. Avoid technical jargon like "biomechanical efficiency" or "kinetic chain".
  `;

  try {
    const contentParts = images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.split(',')[1] || img
      }
    }));

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { text: `Analyze the performance of: ${targetDescription}` },
        ...contentParts as any
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["events"],
          properties: {
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["activity", "jointAngles", "powerScore", "formQuality", "feedback"],
                properties: {
                   activity: { type: Type.STRING },
                   jointAngles: {
                     type: Type.OBJECT,
                     properties: {
                       shoulder: { type: Type.NUMBER },
                       elbow: { type: Type.NUMBER },
                       wrist: { type: Type.NUMBER },
                       stance: { type: Type.NUMBER }
                     }
                   },
                   ballData: {
                     type: Type.OBJECT,
                     properties: {
                       x: { type: Type.NUMBER },
                       y: { type: Type.NUMBER }
                     }
                   },
                   pointOfContact: { type: Type.STRING },
                   platformStability: { type: Type.NUMBER },
                   jumpHeight: { type: Type.NUMBER },
                   powerScore: { type: Type.NUMBER },
                   formQuality: { type: Type.STRING },
                   feedback: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }));

    const result = JSON.parse(response.text);
    return result.events;
  } catch (err) {
    console.error("Gemini Full analysis error:", err);
    throw err;
  }
}
