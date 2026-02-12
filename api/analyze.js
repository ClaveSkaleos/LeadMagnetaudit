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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        Agis comme un expert senior en stratégie commerciale B2B SaaS (type VP Sales).
        Ton but est d'analyser les données d'un audit commercial et de donner un feedback percutant, direct et actionnable.
        
        DONNÉES DU PROSPECT :
        - Industrie : SaaS B2B
        - Volume de Leads : ${formData.leads_volume}/mois
        - Taux de Closing : ${formData.closing_rate}%
        - Panier moyen : ${formData.average_deal}€
        - Nombre de commerciaux : ${formData.sales_reps}
        - Taux de qualification : ${formData.qualified_rate}%
        - Utilisation CRM : ${formData.crm_usage}
        - Playbook de vente : ${formData.playbook ? 'Oui' : 'Non'}
        - Audit de fiabilité (réponses Oui/Non) : ${JSON.stringify(auditAnswers || formData)}

        TA MISSION :
        1. Rédige une "Analyse Stratégique" de 3-4 lignes qui connecte les points (ex: beaucoup de leads mais closing faible = problème de qualif ou de process). Sois cash mais bienveillant.
        2. Propose UNE action ultra-concrète et inhabituelle (pas juste "faire un playbook") qu'il peut faire demain matin pour débloquer la situation.

        FORMAT DE RÉPONSE :
        N'utilise PAS de formatage en gras (pas de **texte**). Écris en texte simple uniquement.
        Commence par un titre "Analyse Stratégique Skaleos".
        Fais deux paragraphes distincts : "Le Diagnostic" et "L'Action Immédiate".
        Ton ton doit être expert, concis, et orienté résultat. Pas de blabla corporate.
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
