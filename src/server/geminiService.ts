import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { AppAnalysis } from "../types";

const AppAnalysisSchema = z.object({
  appName: z.string(),
  score: z.number().min(0).max(20),
  riskLevel: z.enum(["SAFE", "MODERATE", "HIGH", "CRITICAL"]),
  countryOfOrigin: z.string(),
  shareholders: z.array(z.string()),
  positivePoints: z.array(z.string()),
  negativePoints: z.array(z.string()),
  summary: z.string().max(3000)
});



export const analyzeAppUrl = async (url: string): Promise<AppAnalysis> => {
  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        tools: [{ googleSearch: {} } as any] // Recherche Google
      });
    const prompt = `
      Tu es un expert en cybersécurité travaillant pour le gouvernement français. 
      Ta mission est d'analyser la sécurité et la fiabilité d'une application mobile basée sur son lien store.
      
      Lien de l'application: ${url}

      Utilise Google Search pour trouver :
      1. Le nom exact de l'application.
      2. Le pays d'origine du développeur ou de l'entreprise.
      3. Les actionnaires majoritaires ou la société mère (ex: Tencent, Meta, etc.).
      4. Les scandales récents de vie privée ou de sécurité (si existants).
      5. La réputation générale.

      Génère un score de fiabilité sur 20.
      - 18-20: Très sûr (Open source, auditée, EU based, etc.)
      - 14-17: Sûr (Grande entreprise US standard)
      - 10-13: Prudence (Data collection aggressive, pub)
      - 0-9: Dangereux (Malware, Spyware, origine douteuse sans transparence)

      IMPORTANT: Tu dois me répondre UNIQUEMENT avec un bloc JSON valide (pas de markdown autour si possible, ou alors dans un bloc code).
      
      Structure JSON attendue :
      {
        "appName": "Nom de l'app",
        "score": 15,
        "riskLevel": "SAFE" | "MODERATE" | "HIGH" | "CRITICAL",
        "countryOfOrigin": "Pays",
        "shareholders": ["Nom Actionnaire 1", "Nom Actionnaire 2"],
        "positivePoints": ["Point positif 1", "Point positif 2"],
        "negativePoints": ["Point négatif 1", "Point négatif 2"],
        "summary": "Un résumé court en français (max 2 phrases) pour le député."
      }
    `;

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response.response.text();
    if (!text) throw new Error("IA_EMPTY_RESPONSE");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON_NOT_FOUND");

    const rawData = JSON.parse(jsonMatch[0]);
    
    // Validation Zod
    const validatedData = AppAnalysisSchema.parse(rawData);

    return {
      ...validatedData,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Échec de l'analyse:", error);
    throw new Error("Erreur technique lors de l'analyse de l'application.");
  }
};