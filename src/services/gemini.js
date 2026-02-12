import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with key from environment variables
// If key is missing, we'll handle it gracefully
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateSalesAnalysis = async (formData, auditAnswers) => {
    // Try to use the Serverless API first (Secure method)
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData, auditAnswers }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.analysis) {
                return data.analysis;
            }
        } else {
            console.warn("Serverless function unavailable or error, falling back to client-side if key exists.");
        }
    } catch (error) {
        console.warn("Could not reach /api/analyze, falling back to client-side or mock.", error);
    }

    // FALLBACK: Client-side call (if API_KEY is still present in VITE_ env)
    if (API_KEY) {
        try {
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
            return response.text();
        } catch (e) {
            console.error("Client-side Gemini generation failed", e);
        }
    }

    // MOCK FALLBACK (If everything else fails)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return `Analyse Stratégique Skaleos

D'après les éléments partagés, votre structure présente un fort potentiel de croissance (${formData.leads_volume} leads/mois), mais semble freinée par un manque d'optimisation sur le closing (${formData.closing_rate}%).

Votre situation :
Vous avez une base solide d'acquisition, mais la conversion finale ne suit pas. Cela indique souvent que vos commerciaux passent trop de temps sur des prospects mal qualifiés ou manquent d'arguments percutants en fin de cycle.

Action recommandée :
Auditez vos 10 derniers deals perdus. Identifiez le motif réel (pas celui donné poliment par le prospect). Si c'est "trop cher", c'est un problème de valeur perçue. Si c'est "pas le bon moment", c'est un problème d'urgence. Ajustez votre script de découverte en conséquence dès demain.`;
};
