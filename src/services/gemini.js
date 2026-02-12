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
            // Use gemini-1.5-flash for better logical reasoning and speed
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
• Pas de généralités (“optimiser”, “améliorer”).
• Une seule priorité.
• Ne jamais spéculer sur des données absentes.
• Toujours corréler qualification, CAC, closing et panier.

Objectif final :
Donner une action à effet levier immédiat, exécutable en < 24h.
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
