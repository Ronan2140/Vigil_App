# VigilApp - Audit de Souveraineté Numérique

**Outil d'analyse automatisée de la sécurité et de la souveraineté des applications mobiles.**

Développé dans le cadre d'un Projet de Fin d'Études pour l'Assemblée Nationale, **VigilApp** permet d'identifier instantanément les risques liés à une application mobile (actionnariat étranger, collecte de données, juridiction) en utilisant l'intelligence artificielle couplée à une recherche en temps réel.

## Fonctionnalités Clés

* **Audit IA & Grounding :** Utilise Google Gemini (Flash) avec accès au web pour identifier les actionnaires réels et les "Golden Shares" cachées.
* **Système de Cache Intelligent :** Architecture "Cache-Aside". Si une application a été analysée il y a moins de 15 jours, le résultat est servi instantanément depuis la base de données (économie de quota et latence zéro).
* **Scoring de Risque :** Attribution automatique d'un score de souveraineté (0-20) et d'un niveau de risque (SAFE à CRITICAL).
* **100% Conteneurisé :** Déploiement simplifié via Docker. Isolation totale de l'environnement.

## Stack Technique

* **Frontend :** React 18, Vite, TypeScript.
* **Backend :** Node.js, Express.
* **Base de données :** PostgreSQL 15, gérée via Prisma ORM.
* **Intelligence Artificielle :** Google Gemini API (Modèle Flash avec Grounding Search).
* **Infrastructure :** Docker & Docker Compose.
* **Validation :** Zod (pour garantir la structure des données JSON renvoyées par l'IA).

## Prérequis

* **Docker** et **Docker Compose** installés sur la machine.
* Une clé API **Google Gemini** (AI Studio).

## Installation & Lancement

Le projet est conçu pour être lancé en une seule commande.

### 1. Cloner le projet

```bash
git clone https://github.com/Ronan2140/VigilApp.git
cd vigilapp