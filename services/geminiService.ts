
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Project, MatchingResponse, ChatMessage } from "../types";

export const getTeammateMatches = async (
  currentUser: UserProfile,
  targetProject: Project,
  potentialUsers: UserProfile[]
): Promise<MatchingResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const eventContext = targetProject.hackathonName ? `This is for the ${targetProject.hackathonName} event.` : "";
  
  const prompt = `
    Act as the CollabQuest AI Matching Engine.
    Current User Profile (Lead): ${JSON.stringify(currentUser)}
    Project Context: ${JSON.stringify(targetProject)}
    ${eventContext}
    Potential Teammates to Scan: ${JSON.stringify(potentialUsers)}

    CRITICAL ALGORITHMIC RULES:
    1. SYNERGY FIRST: Find teammates who fill the gaps of the Current User Profile relative to the Project requirements.
    2. EVENT RELEVANCE: If a hackathon name is provided, prioritize users whose interests or skills align with that event's typical tech (e.g., Azure for Microsoft hackathons).
    3. MERIT-BASED ONLY: Strictly use provided skills, interests, and availability.
    4. BIAS-SHIELD: Do not infer data. Ignore any mention of university or location.
    5. EXPLAINABILITY: In your reasoning, explicitly state why the match complements the Current User's existing skills.

    OUTPUT REQUIREMENTS:
    - userId: string
    - score: number (0-100)
    - confidence: number (0-100) 
    - reasoning: explanation linking candidate skills to the Lead's gaps.
    - complementarySkills: skills the candidate has that the Lead lacks or that the Project specifically needs.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  userId: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                  complementarySkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["userId", "score", "confidence", "reasoning", "complementarySkills"],
                propertyOrdering: ["userId", "score", "confidence", "reasoning", "complementarySkills"]
              }
            }
          },
          required: ["matches"],
          propertyOrdering: ["matches"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return { matches: [] };
    }
    const parsed = JSON.parse(text);
    if (!parsed.matches) return { matches: [] };
    return parsed as MatchingResponse;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("INVALID_API_KEY");
    }
    throw new Error("MATCHING_FAILED");
  }
};

export const getVerificationSummary = async (profile: UserProfile): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Act as a merit-based talent auditor. 
    User Profile: ${JSON.stringify(profile)}
    
    In 2-3 professional and encouraging sentences, explain why this profile is now "Merit Verified" for the CollabQuest platform. 
    Explicitly mention how their portfolio/link (${profile.portfolioUrl}) serves as the critical proof of their claimed skills (${profile.skills.join(', ')}). 
    Keep it concise, energetic, and focused on the value of their provided evidence.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return text;
  } catch (error: any) {
    console.error("Verification Summary Error:", error);
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("fetch") || msg.includes("network")) throw new Error("NETWORK_ERROR");
    if (msg.includes("429") || msg.includes("quota")) throw new Error("RATE_LIMIT");
    if (msg.includes("api key not valid")) throw new Error("INVALID_API_KEY");
    throw new Error("UNKNOWN_ERROR");
  }
};

export const simulatePeerResponse = async (
  peer: UserProfile,
  project: Project,
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Hey! I'm here, but the AI service is currently unavailable. Let's sync soon!";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const eventMention = project.hackathonName ? `We are competing in the ${project.hackathonName}.` : "";
  
  const prompt = `
    Act as ${peer.name}, a student teammate in a hackathon.
    YOUR PERSONALITY & BACKGROUND:
    - Bio: ${peer.bio}
    - Key Skills: ${peer.skills.join(", ")}
    - Interests: ${peer.interests.join(", ")}
    
    PROJECT CONTEXT:
    - Title: ${project.title}
    - Mission: ${project.description}
    - ${eventMention}
    
    CHAT CONTEXT:
    ${history.slice(-8).map(m => `${m.senderName}: ${m.text}`).join("\n")}
    
    USER JUST SAID: "${newMessage}"
    
    GOAL: Respond as ${peer.name}. 
    RULES:
    1. Stay in character!
    2. Mention your specific expertise if it helps.
    3. Be encouraging and proactive. 
    4. Casual student vibe. Max 25 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "Sounds like a solid plan. I'm on it!";
  } catch (error) {
    return "That sounds good to me. I'm excited to start!";
  }
};
