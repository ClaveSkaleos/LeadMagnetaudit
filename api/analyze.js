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
Rôle :
Agis comme un VP Sales senior spécialisé en structuration de systèmes commerciaux B2B.
Tu es direct, factuel et orienté résultat. Pas de blabla, pas de motivation.

Mission :
Analyse les données commerciales fournies. Identifie le goulot d’étranglement principal qui limite la performance globale.

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
- Ratio Deal/CAC (Rentabilité) : ${formData.cac ? (formData.average_deal / formData.cac).toFixed(2) : 'N/A'} (Cible > 3.0)
- Nombre de commerciaux : ${formData.sales_reps}
- Utilisation CRM : ${formData.crm_usage}
- Playbook de vente : ${formData.playbook ? 'Oui' : 'Non'}
- Pilotage (Dashboards) : ${formData.dashboards ? 'Oui' : 'Non'}


Contraintes :
• Base-toi uniquement sur les chiffres donnés.
• Priorise l’impact financier, pas le confort organisationnel.
• Si une donnée est absente, ignore-la sans spéculer.
• Pas de phrases vagues (“améliorer”, “travailler”, “optimiser”).
• Pas d'emojis. Pas de phrases inspirantes.

RÈGLES DE PRIORISATION (IMPORTANT) :
1. Si le Ratio Deal/CAC (Panier moyen / Coût acquisition) est inférieur à 3, c'est une ALERTE ROUGE. Si inférieur à 2, c'est CRITIQUE (perte d'argent probable).
2. Si "Système de suivi Outbound" est "Non", c'est souvent la PRIO #1 (pilotage à l'aveugle).
3. Tu dois TOUJOURS donner une action, même si les chiffres semblent bons.

Format de réponse OBLIGATOIRE :

1. Diagnostic (3–4 lignes max)
• Où se situe la fuite principale (lead, qualification, show-up, closing, panier, process).
• Impact estimé sur le chiffre d’affaires ou le volume.

2. Goulot d’étranglement prioritaire
• Nom précis de l’indicateur.
• Pourquoi c’est lui et pas un autre.

3. Action exécutable demain matin (1 seule)
• Étape par étape.
• Temps estimé.
• Qui doit le faire.
• Outil ou méthode concrète.

4. Gain potentiel estimé
• Exemple : “+X RDV / mois” ou “+Y% closing” ou “+Z€ mensuel estimé”.

Ton attendu : clinique, autoritaire, orienté système.
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
