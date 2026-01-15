import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Erreur : GEMINI_API_KEY non trouvée dans le .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("🔍 Récupération de la liste des modèles...");
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Erreur API :", data.error.message);
      return;
    }

    console.log("✅ Modèles disponibles pour votre clé :");
    data.models.forEach((m: any) => {
      console.log(`- ${m.name} (Supporte: ${m.supportedGenerationMethods.join(', ')})`);
    });

  } catch (error) {
    console.error("❌ Erreur lors du fetch :", error);
  }
}

listModels();