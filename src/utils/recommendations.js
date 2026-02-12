// Simplified recommendations engine for 10-question diagnostic
import { calculateMaturityScore, calculateOptimizedRevenue, identifyWeaknesses } from './calculations';

/**
 * Calculate realistic financial gains based on actual metrics
 */
const calculateRealGains = (data) => {
    const leadVolume = parseFloat(data.leads_volume) || 0;
    const showUpRate = parseFloat(data.show_up_rate) || 75;
    const closingRate = parseFloat(data.closing_rate) || 0;
    const avgDeal = parseFloat(data.average_deal) || 0;

    // Current state
    const currentRDVs = leadVolume * (showUpRate / 100);
    const currentDeals = currentRDVs * (closingRate / 100);
    const currentMonthlyRevenue = currentDeals * avgDeal;

    return {
        leadVolume,
        showUpRate,
        closingRate,
        avgDeal,
        currentRDVs,
        currentDeals,
        currentMonthlyRevenue
    };
};

/**
 * Generate prioritized recommendations
 */
export const generateRecommendations = (data) => {
    const recommendations = [];
    const metrics = calculateRealGains(data);
    const { leadVolume, showUpRate, closingRate, avgDeal, currentRDVs, currentDeals, currentMonthlyRevenue } = metrics;

    // Priority 1: Critical CRM usage
    if (data.crm_usage !== 'systematic') {
        // CRM impact: better tracking = +10% closing rate improvement
        const improvedClosing = closingRate * 1.10;
        const additionalDeals = (currentRDVs * (improvedClosing / 100)) - currentDeals;
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 1,
            category: 'structure',
            title: 'Imposez l\'utilisation rigoureuse du CRM',
            description: 'Sans CRM, impossible d\'avoir de la visibilité et d\'optimiser vos process',
            impact: 'critical',
            estimatedGain: Math.round(annualGain),
            timeframe: '1-2 semaines',
            difficulty: 'low',
            quickWin: true,
            actions: [
                'Définir le process de saisie obligatoire',
                'Former l\'équipe aux bonnes pratiques',
                'Installer des contrôles qualité hebdomadaires',
                'Créer des dashboards de suivi en temps réel'
            ]
        });
    }

    // Priority 2: Show-up rate
    if (showUpRate < 75) {
        // Show-up improvement: from current to 75%
        const targetShowUp = 75;
        const improvedRDVs = leadVolume * (targetShowUp / 100);
        const additionalRDVs = improvedRDVs - currentRDVs;
        const additionalDeals = additionalRDVs * (closingRate / 100);
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 1,
            category: 'conversion',
            title: `Améliorez votre taux de présence (${Math.round(showUpRate)}% → 75%)`,
            description: 'Chaque RDV fantôme = temps commercial perdu + opportunité manquée',
            impact: 'high',
            estimatedGain: Math.round(annualGain),
            timeframe: '1-2 semaines',
            difficulty: 'low',
            quickWin: true,
            actions: [
                'Rappels automatiques 24h et 2h avant',
                'Qualifier l\'engagement avant de booker',
                'Réduire le délai entre prise de RDV et RDV',
                'Demander d\'ajouter au calendrier'
            ]
        });
    }

    // Priority 3: Closing rate
    if (closingRate < 30) {
        // Closing improvement: +5-10 points realistic gain
        const targetClosing = Math.min(closingRate + 10, 35);
        const improvedDeals = currentRDVs * (targetClosing / 100);
        const additionalDeals = improvedDeals - currentDeals;
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 2,
            category: 'conversion',
            title: `Optimisez votre closing (${Math.round(closingRate)}% → ${Math.round(targetClosing)}%)`,
            description: 'Un closing faible révèle un problème de qualification ou de pitch',
            impact: 'high',
            estimatedGain: Math.round(annualGain),
            timeframe: '4-8 semaines',
            difficulty: 'high',
            quickWin: false,
            actions: [
                'Analyser les raisons de perte systématiquement',
                'Créer un Book de Vente structuré',
                'Former l\'équipe aux objections',
                'Tester des ajustements de pricing/offre'
            ]
        });
    }

    // Priority 4: Qualification
    const qualifiedRate = parseFloat(data.qualified_rate) || 0;
    if (qualifiedRate < 50) {
        // Better qualification = +15% closing rate (less time wasted on bad fits)
        const improvedClosing = closingRate * 1.15;
        const improvedDeals = currentRDVs * (improvedClosing / 100);
        const additionalDeals = improvedDeals - currentDeals;
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 2,
            category: 'acquisition',
            title: `Améliorez la qualification (${Math.round(qualifiedRate)}% → 60%)`,
            description: 'Trop de leads non qualifiés saturent votre équipe et baissent le closing',
            impact: 'medium',
            estimatedGain: Math.round(annualGain),
            timeframe: '2-4 semaines',
            difficulty: 'medium',
            quickWin: false,
            actions: [
                'Définir votre ICP (Ideal Customer Profile)',
                'Mettre en place un lead scoring',
                'Former le marketing à la qualification',
                'Créer des filtres sur les formulaires'
            ]
        });
    }

    // Priority 5: Book de Vente (ex-Playbook)
    if (!data.playbook) {
        // Playbook impact: +8% closing improvement from standardization
        const improvedClosing = closingRate * 1.08;
        const improvedDeals = currentRDVs * (improvedClosing / 100);
        const additionalDeals = improvedDeals - currentDeals;
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 3,
            category: 'structure',
            title: 'Créez un Book de Vente documenté',
            description: 'Standardisez vos approches gagnantes pour ne plus dépendre du talent individuel',
            impact: 'medium',
            estimatedGain: Math.round(annualGain),
            timeframe: '3-4 semaines',
            difficulty: 'medium',
            quickWin: false,
            actions: [
                'Documenter le pitch gagnant',
                'Lister les objections et réponses',
                'Définir le processus étape par étape',
                'Créer des templates (emails, propositions)'
            ]
        });
    }

    // Priority 6: Dashboards
    if (!data.dashboards) {
        // Dashboards impact: +5% performance from visibility
        const improvedClosing = closingRate * 1.05;
        const improvedDeals = currentRDVs * (improvedClosing / 100);
        const additionalDeals = improvedDeals - currentDeals;
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 3,
            category: 'structure',
            title: 'Implémentez des dashboards en temps réel',
            description: 'Donnez de la visibilité à votre équipe sur le pipeline',
            impact: 'medium',
            estimatedGain: Math.round(annualGain),
            timeframe: '1-2 semaines',
            difficulty: 'low',
            quickWin: true,
            actions: [
                'Identifier les KPIs critiques à tracker',
                'Configurer les dashboards dans le CRM',
                'Former l\'équipe à la lecture des métriques',
                'Installer des rituels de review hebdomadaires'
            ]
        });
    }

    // Priority 7: Outbound Volume
    const outboundVol = parseFloat(data.outbound_volume) || 0;
    const responseRate = parseFloat(data.response_rate) || 0;
    if (outboundVol < 50 || responseRate < 20) {
        // Prospection outbound: add 25% more qualified leads
        const additionalLeads = leadVolume * 0.25;
        const additionalRDVs = additionalLeads * (showUpRate / 100);
        const additionalDeals = additionalRDVs * (closingRate / 100);
        const monthlyGain = additionalDeals * avgDeal;
        const annualGain = monthlyGain * 12;

        recommendations.push({
            priority: 2,
            category: 'prospection',
            title: `Intensifiez la prospection outbound (${outboundVol} → 50+/semaine)`,
            description: 'Ne dépendez pas que de l\'inbound, prenez les devants',
            impact: 'high',
            estimatedGain: Math.round(annualGain),
            timeframe: '2-4 semaines',
            difficulty: 'medium',
            quickWin: false,
            actions: [
                'Définir une cible de contacts hebdomadaire',
                'Créer des séquences de prospection automatisées',
                'Tester différents canaux (LinkedIn, Email, Phone)',
                'Mesurer le taux de réponse par canal'
            ]
        });
    }

    // Sort by priority and impact
    recommendations.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return impactOrder[a.impact] - impactOrder[b.impact];
    });

    return recommendations;
};

/**
 * Get top 3 recommendations
 */
export const getTopRecommendations = (data) => {
    const allRecommendations = generateRecommendations(data);
    return allRecommendations.slice(0, 3);
};

/**
 * Get quick wins
 */
export const getQuickWins = (data) => {
    const allRecommendations = generateRecommendations(data);
    return allRecommendations.filter(r => r.quickWin).slice(0, 3);
};
