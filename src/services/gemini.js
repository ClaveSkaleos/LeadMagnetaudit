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
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });

            const prompt = `
Rôle :
Agis comme un VP Sales senior spécialisé en structuration de systèmes commerciaux B2B.
Ton ton est clinique, direct, factuel. Pas de motivation, pas d'emojis.

Mission :
Analyse les données commerciales fournies selon des seuils d'évaluation précis.
Base ton analyse uniquement sur les chiffres donnés.

DONNÉES DU PROSPECT :
- Volume de Leads en appel : ${formData.leads_volume}/mois (Inbound)
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

RÈGLES DE SCORING :
• Score global sur 100
• Le score 100/100 est INTERDIT sauf si tous les indicateurs sont au niveau "Excellent"
• Même avec un score élevé (80–90), un Top 3 d'optimisations est OBLIGATOIRE
• Le score doit refléter la performance globale, pas un seul KPI

SEUILS D'ÉVALUATION :

Volume de leads en appel (leads_volume)
• 1–2 / mois → Critique
• 3–8 → Faible
• 9–20 → Correct
• 20+ → Bon

Qualification des prospects (qualified_rate)
• ≥ 70% → Bon
• 50–69% → Moyen
• < 50% → Critique

CAC vs Panier moyen (cac / average_deal)
• CAC ≤ 25% du panier → Bon
• 25–40% → À surveiller
• ≥ 40% → Mauvais
• ≥ 50% → Critique
• Règle : un client doit idéalement rapporter ≥ 3× son coût d'acquisition

Nouveaux contacts & Taux de réponse (response_rate)
• ≥ 50% → Excellent
• 20–49% → Correct
• < 20% → Critique

Système de suivi des accroches (follow_up_system)
• Non → Ajout automatique dans le Top 3

Taux de présence RDV (show_up_rate)
• ≥ 75% → Bon
• 60–74% → Moyen
• < 60% → Critique

Taux de closing (closing_rate)
• ≥ 50% → Excellent
• 40–49% → Bon
• 30–39% → Correct
• < 30% → Critique
• Toujours corréler avec le panier moyen :
• Panier élevé + closing faible → problème de valeur perçue / pricing / discours

FORMAT DE RÉPONSE OBLIGATOIRE :

1. Score Global : XX / 100
(Ne jamais donner 100 sauf perfection totale)

2. Diagnostic (3–4 lignes max)
Où se situe la fuite principale + impact potentiel.

3. Top 3 Plans d'Action Prioritaires
Pour chaque action :
• Description précise
• Pourquoi
• Étape exécutable < 24h

4. Corrélation Prix / CAC / Closing
Indiquer si le modèle économique est sain ou fragile.

CONTRAINTES :
• Toujours proposer un Top 3, même si tout est bon
• Jamais de conseils vagues ("optimiser", "travailler")
• Pas de spéculation sur des données absentes
• Prioriser l'impact financier

Objectif :
Fournir un diagnostic reproductible et une feuille de route immédiate, orientée levier business.
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
