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
