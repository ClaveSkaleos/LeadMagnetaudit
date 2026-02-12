// Simplified recommendations engine for 10-question diagnostic
import { calculateMaturityScore, calculateOptimizedRevenue, identifyWeaknesses } from './calculations';

/**
 * Generate prioritized recommendations
 */
export const generateRecommendations = (data) => {
    const recommendations = [];
    const revenue = calculateOptimizedRevenue(data);

    // FIXED: Calculate gain base correctly
    const annualGain = revenue.annualGain || ((revenue.optimized - revenue.current) * 12);

    // Priority 1: Critical CRM usage
    if (data.crm_usage !== 'systematic') {
        recommendations.push({
            priority: 1,
            category: 'structure',
            title: 'Imposez l\'utilisation rigoureuse du CRM',
            description: 'Sans CRM, impossible d\'avoir de la visibilité et d\'optimiser vos process',
            impact: 'critical',
            estimatedGain: Math.round(annualGain * 0.30), // Increased from 0.12
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
    const showUpRate = parseFloat(data.show_up_rate) || 0;
    if (showUpRate < 70) {
        recommendations.push({
            priority: 1,
            category: 'conversion',
            title: `Améliorez votre taux de présence (${showUpRate}% → 75%)`,
            description: 'Chaque RDV fantôme = temps commercial perdu',
            impact: 'high',
            estimatedGain: Math.round(annualGain * 0.25), // Increased from 0.15
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
    const closingRate = parseFloat(data.closing_rate) || 0;
    if (closingRate < 25) {
        recommendations.push({
            priority: 2,
            category: 'conversion',
            title: `Optimisez votre closing (${closingRate}% → 30%)`,
            description: 'Un closing faible révèle un problème de qualification ou de pitch',
            impact: 'high',
            estimatedGain: Math.round(annualGain * 0.40), // Increased from 0.20
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
    if (qualifiedRate < 40) {
        recommendations.push({
            priority: 2,
            category: 'acquisition',
            title: `Améliorez la qualification (${qualifiedRate}% → 50%)`,
            description: 'Trop de leads non qualifiés saturent votre équipe',
            impact: 'medium',
            estimatedGain: Math.round(annualGain * 0.25), // Increased from 0.10
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
        recommendations.push({
            priority: 3,
            category: 'structure',
            title: 'Créez un Book de Vente documenté',
            description: 'Standardisez vos approches gagnantes pour ne plus dépendre du talent individuel',
            impact: 'medium',
            estimatedGain: Math.round(annualGain * 0.18), // Increased from 0.08
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
        recommendations.push({
            priority: 3,
            category: 'structure',
            title: 'Implémentez des dashboards en temps réel',
            description: 'Donnez de la visibilité à votre équipe sur le pipeline',
            impact: 'medium',
            estimatedGain: Math.round(annualGain * 0.12), // Increased from 0.05
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
    if (outboundVol < 30) {
        recommendations.push({
            priority: 2,
            category: 'prospection',
            title: `Intensifiez la prospection outbound (${outboundVol} → 50+/mois)`,
            description: 'Ne dépendez pas que de l\'inbound, prenez les devants',
            impact: 'high',
            estimatedGain: Math.round(annualGain * 0.35), // Increased from 0.15
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
