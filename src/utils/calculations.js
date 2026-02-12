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

    // --- ACQUISITION (Max 30) --- More punitive thresholds
    const qualRate = parseFloat(formData.qualified_rate) || 0;
    if (qualRate >= 70) pillars.acquisition += 15;      // Raised from 50
    else if (qualRate >= 50) pillars.acquisition += 8;  // Reduced from 10
    else if (qualRate >= 30) pillars.acquisition += 3;  // New tier
    else pillars.acquisition += 0;                       // Reduced from 5

    if (formData.leads_volume > 50) pillars.acquisition += 5;
    else if (formData.leads_volume > 30) pillars.acquisition += 3;  // Raised from 20
    else if (formData.leads_volume > 10) pillars.acquisition += 1;  // New tier

    if (formData.cac) pillars.acquisition += 5;
    if (formData.outbound_volume && formData.outbound_volume > 0) pillars.acquisition += 5;

    // --- PROSPECTION (Max 30) --- More punitive
    const outboundVol = parseFloat(formData.outbound_volume) || 0;
    if (outboundVol > 100) pillars.prospection += 10;
    else if (outboundVol > 50) pillars.prospection += 5;   // Raised from 30
    else if (outboundVol > 20) pillars.prospection += 2;   // New tier

    const respRate = parseFloat(formData.response_rate) || 0;
    if (respRate >= 20) pillars.prospection += 10;         // Raised from 10
    else if (respRate >= 10) pillars.prospection += 5;     // Reduced points
    else if (respRate >= 5) pillars.prospection += 2;      // Reduced from 5

    if (formData.follow_up_system === true) pillars.prospection += 10;

    // --- CONVERSION (Max 40) --- More punitive
    const closingRate = parseFloat(formData.closing_rate) || 0;
    if (closingRate >= 40) pillars.conversion += 15;       // Raised from 30
    else if (closingRate >= 30) pillars.conversion += 10;  // Same threshold
    else if (closingRate >= 20) pillars.conversion += 5;   // Reduced from 10
    else if (closingRate >= 10) pillars.conversion += 2;   // Reduced from 5

    const showUp = parseFloat(formData.show_up_rate) || 0;
    if (showUp >= 85) pillars.conversion += 15;            // Raised from 80
    else if (showUp >= 75) pillars.conversion += 10;       // Raised from 70
    else if (showUp >= 65) pillars.conversion += 5;        // Raised from 60, reduced points
    else if (showUp >= 50) pillars.conversion += 2;        // New tier

    if (formData.sales_reps >= 3) pillars.conversion += 5;
    else if (formData.sales_reps >= 2) pillars.conversion += 3;

    if (formData.average_deal > 5000) pillars.conversion += 5;

    // --- STRUCTURE (Max 30) --- More punitive
    if (formData.crm_usage === 'systematic') pillars.structure += 10;
    else if (formData.crm_usage === 'sometimes') pillars.structure += 3;  // Reduced from 5
    // No points for rarely/no CRM

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
    const showUpRate = parseFloat(formData.show_up_rate) || 75;
    const closingRate = parseFloat(formData.closing_rate) || 0;
    const avgDeal = parseFloat(formData.average_deal) || 0;

    // Current monthly revenue calculation
    // Leads → Show up at RDV → Close → Revenue
    const currentRDVs = leadVolume * (showUpRate / 100);
    const currentDeals = currentRDVs * (closingRate / 100);
    const currentMonthly = currentDeals * avgDeal;

    // Calculate the maturity score to determine potential
    const maturity = calculateMaturityScore(formData);
    const maturityScore = maturity.total;

    // Optimized scenario: identify improvement levers
    let optimizedShowUpRate = showUpRate;
    let optimizedClosingRate = closingRate;
    let optimizedLeadVolume = leadVolume;

    // Show-up rate optimization (realistic targets)
    if (showUpRate < 75) {
        optimizedShowUpRate = Math.min(75, showUpRate + 15); // Cap at 75%, max +15 pts
    } else if (showUpRate < 85) {
        optimizedShowUpRate = Math.min(85, showUpRate + 5); // Cap at 85%, max +5 pts
    }

    // Closing rate optimization (realistic targets based on maturity)
    if (closingRate < 30) {
        optimizedClosingRate = Math.min(35, closingRate + 10); // Cap at 35%, max +10 pts
    } else if (closingRate < 40) {
        optimizedClosingRate = Math.min(45, closingRate + 5); // Cap at 45%, max +5 pts
    } else if (closingRate < 50) {
        optimizedClosingRate = Math.min(55, closingRate + 3); // Cap at 55%, max +3 pts
    }

    // Lead volume optimization (via prospection improvements)
    const outboundVol = parseFloat(formData.outbound_volume) || 0;
    const responseRate = parseFloat(formData.response_rate) || 0;
    if (outboundVol < 50 || responseRate < 20) {
        // If weak prospection, potential to add 20-30% more leads
        optimizedLeadVolume = leadVolume * 1.25;
    } else if (outboundVol < 100 || responseRate < 30) {
        // Moderate prospection, 10-15% more leads possible
        optimizedLeadVolume = leadVolume * 1.15;
    } else {
        // Strong prospection, 5-10% incremental improvement
        optimizedLeadVolume = leadVolume * 1.05;
    }

    // Optimized monthly revenue calculation
    const optimizedRDVs = optimizedLeadVolume * (optimizedShowUpRate / 100);
    const optimizedDeals = optimizedRDVs * (optimizedClosingRate / 100);
    const optimizedMonthly = optimizedDeals * avgDeal;

    // Ensure optimized is ALWAYS higher than current (minimum +5%)
    const finalOptimized = Math.max(optimizedMonthly, currentMonthly * 1.05);

    const percentageGain = currentMonthly > 0
        ? Math.round(((finalOptimized - currentMonthly) / currentMonthly) * 100)
        : 0;

    return {
        current: Math.round(currentMonthly),
        optimized: Math.round(finalOptimized),
        percentageGain: percentageGain,
        annualGain: Math.round((finalOptimized - currentMonthly) * 12)
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
