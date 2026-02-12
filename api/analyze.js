import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Enable CORS for Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { formData, auditAnswers } = req.body;

        // This runs on SERVER side, so use standard process.env (no VITE_ prefix needed)
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("Server Error: GEMINI_API_KEY is missing in environment variables.");
            return res.status(500).json({ error: "Server configuration error: Missing API Key" });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Use gemini-1.5-flash for better logical reasoning and speed
        // User requested experimental model gemini-3-flash-preview
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
Rôle :
Agis comme un VP Sales senior spécialisé en structuration de systèmes commerciaux B2B.
Ton ton est clinique, direct, factuel. Pas de motivation, pas d’emojis.

Mission :
Analyse les données commerciales fournies et identifie le point de fuite principal.
Base ton analyse uniquement sur les chiffres donnés.

DONNÉES DU PROSPECT :
- Volume de Leads : ${formData.leads_volume}/mois (Inbound)
- Taux de qualification : ${formData.qualified_rate}%
- Volume Outbound : ${formData.outbound_volume || 0} contacts/semaine
- Taux de réponse Outbound : ${formData.response_rate || 0}%
- Système de suivi Outbound : ${formData.follow_up_system ? 'Oui' : 'Non'}
- Taux de présence RDV (Show-up) : ${formData.show_up_rate}%
- Taux de Closing : ${formData.closing_rate}%
- Panier moyen : ${formData.average_deal}€
- Coût Acquisition Client (CAC) : ${formData.cac || 'Non renseigné'}€
- Ratio CAC/Panier : ${formData.cac ? Math.round((formData.cac / formData.average_deal) * 100) : 'N/A'}% (Cible < 25%)
- Nombre de commerciaux : ${formData.sales_reps}
- Utilisation CRM : ${formData.crm_usage}
- Playbook de vente : ${formData.playbook ? 'Oui' : 'Non'}
- Pilotage (Dashboards) : ${formData.dashboards ? 'Oui' : 'Non'}

RÈGLES D’ÉVALUATION OBLIGATOIRES :

1. Qualification des prospects (qualified_rate)
• ≥ 70% → Bon
• 50–69% → Moyen, optimisation nécessaire
• < 50% → Critique (mauvais ciblage ou mauvais message)

2. Coût d’acquisition (CAC) vs Panier moyen (average_deal)
• CAC ≤ 20–25% du panier → Bon
• CAC ≈ 30–40% → À surveiller
• CAC ≥ 50% → Critique
• Si CAC proche du panier → Non viable

3. Système de suivi des accroches (follow_up_system)
• Si “Non” → Recommander obligatoirement la mise en place d’un tracking

4. Taux de présence aux RDV (show_up_rate)
• ≥ 75% → Bon
• 60–74% → Moyen
• < 60% → Critique (rappels / qualification insuffisante)

5. Taux de closing (closing_rate)
• ≥ 50% → Excellent
• 40–49% → Bon
• 30–39% → Moyen (souvent lié au prix ou au discours)
• < 30% → Critique
• Toujours corréler avec le panier moyen : Si panier élevé + closing faible → prix / valeur mal alignés

Format de réponse OBLIGATOIRE :

1. Diagnostic (3–4 lignes max)
Où se situe la fuite principale et son impact estimé.

2. Indicateur critique prioritaire
Nom précis + raison.

3. Action exécutable demain matin (UNE seule)
Étapes concrètes, outil ou méthode, temps estimé.

4. Gain potentiel estimé
Exemple : “+X RDV / mois” ou “+Y% closing”.

Contraintes :
• Toujours proposer un Top 3, même si tout est bon
• Jamais de conseils vagues ("optimiser", "travailler")
• Pas de spéculation sur des données absentes
• Prioriser l'impact financier
• NE JAMAIS UTILISER DE GRAS (pas d'étoiles doubles **), le texte brut uniquement.

Objectif :
Fournir un diagnostic reproductible et une feuille de route immédiate, orientée levier business.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ analysis: text });

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        return res.status(500).json({ error: "Failed to generate analysis" });
    }
}
