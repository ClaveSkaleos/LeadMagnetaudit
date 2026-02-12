import { QUESTIONS, BENCHMARKS } from '../data/questions';

/**
 * Calculates a maturity score (0-100) based on form responses.
 * CRITICAL FIX: Score should correlate INVERSELY with revenue potential
 * High score = Low potential gain (already optimized)
 * Low score = High potential gain (lots of room to improve)
 */
export const calculateMaturityScore = (formData) => {
    let pillars = {
        acquisition: 0,
        prospection: 0,
        conversion: 0,
        structure: 0
    };

    // --- ACQUISITION (Max 30) ---
    const qualRate = parseFloat(formData.qualified_rate) || 0;
    if (qualRate >= 50) pillars.acquisition += 15;
    else if (qualRate >= 30) pillars.acquisition += 10;
    else pillars.acquisition += 5;

    if (formData.leads_volume > 50) pillars.acquisition += 5;
    else if (formData.leads_volume > 20) pillars.acquisition += 3;

    if (formData.cac) pillars.acquisition += 5;
    if (formData.outbound_volume && formData.outbound_volume > 0) pillars.acquisition += 5;

    // --- PROSPECTION (Max 30) ---
    const outboundVol = parseFloat(formData.outbound_volume) || 0;
    if (outboundVol > 100) pillars.prospection += 10;
    else if (outboundVol > 30) pillars.prospection += 5;

    const respRate = parseFloat(formData.response_rate) || 0;
    if (respRate >= 10) pillars.prospection += 10;
    else if (respRate >= 5) pillars.prospection += 5;

    if (formData.follow_up_system === true) pillars.prospection += 10;

    // --- CONVERSION (Max 40) ---
    const closingRate = parseFloat(formData.closing_rate) || 0;
    if (closingRate >= 30) pillars.conversion += 15;
    else if (closingRate >= 20) pillars.conversion += 10;
    else if (closingRate >= 10) pillars.conversion += 5;

    const showUp = parseFloat(formData.show_up_rate) || 0;
    if (showUp >= 80) pillars.conversion += 15;
    else if (showUp >= 70) pillars.conversion += 10;
    else if (showUp >= 60) pillars.conversion += 6;

    if (formData.sales_reps >= 3) pillars.conversion += 5;
    else if (formData.sales_reps >= 2) pillars.conversion += 3;

    if (formData.average_deal > 5000) pillars.conversion += 5;

    // --- STRUCTURE (Max 30) ---
    if (formData.crm_usage === 'systematic') pillars.structure += 10;
    else if (formData.crm_usage === 'sometimes') pillars.structure += 5;

    if (formData.playbook === true) pillars.structure += 10;
    if (formData.dashboards === true) pillars.structure += 10;

    const total = pillars.acquisition + pillars.prospection + pillars.conversion + pillars.structure;

    return {
        total: Math.min(Math.round(total), 100),
        pillars
    };
};

/**
 * Estimates revenue potential based on industry benchmarks.
 * CRITICAL FIX: High maturity score should = LOW potential gain
 */
export const calculateOptimizedRevenue = (formData) => {
    const leadVolume = parseFloat(formData.leads_volume) || 0;
    const closingRate = parseFloat(formData.closing_rate) || 0;
    const avgDeal = parseFloat(formData.average_deal) || 0;

    const annualRevenue = leadVolume * (closingRate / 100) * avgDeal * 12;
    const currentMonthly = annualRevenue / 12;

    // Calculate the maturity score to determine potential
    const maturity = calculateMaturityScore(formData);
    const maturityScore = maturity.total;

    // INVERSE CORRELATION: High maturity = Low multiplier (very conservative)
    // Score 90-100 = 1.02-1.05x (marginal gain)
    // Score 80-90 = 1.05-1.12x (minor optimization)
    // Score 60-80 = 1.12-1.25x (solid improvement)
    // Score 40-60 = 1.25-1.35x (significant improvement)
    // Score 0-40 = 1.35-1.50x (transformational but realistic)

    let multiplier = 1.0;

    if (maturityScore >= 90) {
        // Top tier: 2-5% potential only
        multiplier = 1.02 + ((100 - maturityScore) / 100) * 0.03;
    } else if (maturityScore >= 80) {
        // Very Strong: 5-12% boost potential
        multiplier = 1.05 + ((90 - maturityScore) / 10) * 0.07;
    } else if (maturityScore >= 60) {
        // Strong but gaps: 12-25% revenue potential
        multiplier = 1.12 + ((80 - maturityScore) / 20) * 0.13;
    } else if (maturityScore >= 40) {
        // Average: 25-35% potential
        multiplier = 1.25 + ((60 - maturityScore) / 20) * 0.10;
    } else {
        // Low maturity: 35-50% potential (capped at 1.5x)
        multiplier = 1.35 + ((40 - maturityScore) / 40) * 0.15;
    }

    // Cap at realistic maximum
    multiplier = Math.min(multiplier, 1.50);
    multiplier = Math.max(multiplier, 1.02); // Minimum 2% improvement ALWAYS

    const optimizedMonthly = currentMonthly * multiplier;

    return {
        current: Math.round(currentMonthly),
        optimized: Math.round(optimizedMonthly),
        percentageGain: Math.round((multiplier - 1) * 100),
        annualGain: Math.round((optimizedMonthly - currentMonthly) * 12)
    };
};

/**
 * Returns generic weaknesses based on data
 */
export const identifyWeaknesses = (formData) => {
    const weaknesses = [];
    if (formData.crm_usage !== 'systematic') weaknesses.push("Manque de rigueur CRM");
    if (!formData.playbook) weaknesses.push("Absence de Book de Vente");
    if ((formData.closing_rate || 0) < 20) weaknesses.push("Taux de closing faible");
    if ((formData.show_up_rate || 0) < 70) weaknesses.push("Taux de présence faible");
    return weaknesses;
};
