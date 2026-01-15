import express from 'express';
import cors from 'cors';
import { analyzeAppUrl } from './geminiService.js'; // Ta fonction
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

const prisma = new PrismaClient();
dotenv.config();

export const getOrAnalyzeApp = async (url: string) => {
  const QUINZE_JOURS_MS = 15 * 24 * 60 * 60 * 1000;
  const now = new Date();

  // Chercher si on a déjà l'app en DB
  const existingAnalysis = await prisma.appAnalysis.findFirst({
    where: { url: url },
    orderBy: { timestamp: 'desc' }
  });

  if (existingAnalysis) {
    const age = now.getTime() - new Date(existingAnalysis.timestamp).getTime();

    if (age < QUINZE_JOURS_MS) {
      console.log("📦 Cache Hit : On renvoie les données de la DB");
      return {
        ...existingAnalysis,
        fromCache: true
      };
    }
    console.log("⏰ Cache Expiré : On relance une analyse");
  }

  // Si rien en cache ou trop vieux -> Gemini
  console.log("📡 Appel Gemini...");
  const freshData = await analyzeAppUrl(url);

  const savedData = await prisma.appAnalysis.create({
    data: {
      url: url,
      appName: freshData.appName,
      score: freshData.score,
      riskLevel: freshData.riskLevel,
      countryOfOrigin: freshData.countryOfOrigin,
      shareholders: freshData.shareholders,
      positivePoints: freshData.positivePoints,
      negativePoints: freshData.negativePoints,
      summary: freshData.summary,
    }
  });

  return { ...savedData, fromCache: false };
};

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/app-check', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await getOrAnalyzeApp(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur d'analyse" });
  }
});

app.listen(3001, () => console.log("Serveur démarré sur le port 3001"));