import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Lock, Unlock, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Target, Zap, ArrowRight, ShieldCheck, Mail, User, Sparkles, History, Activity, Map } from 'lucide-react';
import { calculateMaturityScore, calculateOptimizedRevenue, identifyWeaknesses } from '../utils/calculations';
import { getTopRecommendations } from '../utils/recommendations';
import AnimatedScore from './AnimatedScore';
import MetricCard from './MetricCard';
import Logo from './Logo';
import IClosedWidget from './IClosedWidget';
import { generateSalesAnalysis } from '../services/gemini';

const AIAnalysisDisplay = ({ analysis, loading, error }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                <p className="text-sm text-slate-400">L'IA finalise l'analyse de vos réponses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                {error}
            </div>
        );
    }

    return (
        <div className="whitespace-pre-wrap leading-relaxed font-medium">
            {analysis}
        </div>
    );
};

export default function Dashboard({ formData, aiAnalysis, aiLoading, aiError }) {
    // If accessing via history, skip scanning/contact steps (Logic removed, always scanning first)
    const [step, setStep] = useState('scanning');
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // AI Analysis State is now passed via props from App.jsx for earlier execution

    const maturityScore = calculateMaturityScore(formData);
    const revenue = calculateOptimizedRevenue(formData);
    const topRecommendations = getTopRecommendations(formData);

    useEffect(() => {
        if (step === 'scanning') {
            const timer = setTimeout(() => {
                setStep('contact');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Trigger Confetti on Results Load (only for new runs to maintain "Wow" factor, or maybe always?)
    // Let's do it always for the fun factor
    // Confetti removed per user request

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (form.email && form.email.includes('@') && form.firstName && form.lastName) {

            const payload = {
                ...formData, // Include all audit answers
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                currentRevenue: Math.round(revenue.current),
                potentialRevenue: Math.round(revenue.optimized),
                score: maturityScore.total,
                aiAnalysis: aiAnalysis, // Include AI result if ready (passed from props)
                submittedAt: new Date().toISOString()
            };

            console.log("🚀 Sending to Make.com Webhook:", payload);

            // Send data to Make.com Webhook
            try {
                const response = await fetch('https://hook.eu1.make.com/nnv5jp977hmiw3c5oqa4w5c1kuegrnv2', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log("✅ Webhook sent successfully!");
                } else {
                    console.error("❌ Webhook failed with status:", response.status);
                }
            } catch (error) {
                console.error("❌ Webhook error (Network/CORS?):", error);
                // Continue anyway to show results
            }

            setStep('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const radarData = [
        { pillar: 'Acquisition', score: maturityScore.pillars.acquisition, fullMark: 30 },
        { pillar: 'Prospection', score: maturityScore.pillars.prospection, fullMark: 30 },
        { pillar: 'Conversion', score: maturityScore.pillars.conversion, fullMark: 40 },
        { pillar: 'Structure', score: maturityScore.pillars.structure, fullMark: 30 }
    ];

    const projectionData = [
        { month: 'Mois 1', Actuel: Math.round(revenue.current), Optimisé: Math.round(revenue.current) },
        { month: 'Mois 2', Actuel: Math.round(revenue.current * 1.02), Optimisé: Math.round(revenue.optimized * 0.75) },
        { month: 'Mois 3', Actuel: Math.round(revenue.current * 1.01), Optimisé: Math.round(revenue.optimized * 0.85) },
        { month: 'Mois 4', Actuel: Math.round(revenue.current * 1.03), Optimisé: Math.round(revenue.optimized * 0.92) },
        { month: 'Mois 5', Actuel: Math.round(revenue.current * 0.98), Optimisé: Math.round(revenue.optimized * 0.98) },
        { month: 'Mois 6', Actuel: Math.round(revenue.current * 1.04), Optimisé: Math.round(revenue.optimized) }
    ];

    const formatCurrency = (value) => {
        return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €';
    };

    const renderConfetti = () => {
        if (!showConfetti) return null;
        const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#064E3B', '#10B981', '#F59E0B', '#3B82F6'][Math.floor(Math.random() * 4)],
                animationDuration: `${2 + Math.random() * 3}s`,
                animation: 'confettiRain 3s linear forwards'
            };
            return <div key={i} className="confetti-piece" style={style}></div>;
        });
        return <div className="confetti-container">{confettiPieces}</div>;
    };

    // Scanning State
    if (step === 'scanning') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
                <div className="glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40"></div>
                <div className="relative z-10 flex flex-col items-center gap-8 animate-in">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-rolex-900 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-rolex-900 animate-pulse">{Math.round(Math.random() * 100)}%</span>
                        </div>
                    </div>
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-bold text-slate-900 font-display">Analyse de votre structure...</h2>
                        <p className="text-slate-500">Comparaison sectorielle en cours.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Contact Form Step - REDESIGNED for better conversion
    if (step === 'contact') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-glow-effect px-4 relative overflow-hidden py-12">
                <div className="glow-spot top-[-10%] right-[30%] opacity-30 w-[800px] h-[800px]"></div>
                <div className="glow-spot bottom-[-10%] left-[10%] opacity-30 w-[700px] h-[700px]വരെ"></div>

                <div className="w-full max-w-2xl mx-auto relative z-10 space-y-10 animate-in">

                    {/* Header Section */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold uppercase tracking-wider mb-2 border border-emerald-100 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" /> Analyse Terminée
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight font-display">
                            Débloquez vos <br />
                            <span className="text-gradient">résultats personnalisés</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg mx-auto">
                            Recevez votre rapport détaillé par email pour conserver ces insights.
                        </p>
                    </div>

                    {/* Benefits Grid - Matching Welcome Page Style */}
                    <div className="grid grid-cols-2 gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Audit en 2 min</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <Map className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Plan structuré</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Score décisionnel</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <Target className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Méthode terrain</span>
                        </div>
                    </div>

                    {/* The Form Card */}
                    <div className="card-modern p-8 md:p-10 bg-white shadow-2xl relative overflow-hidden">
                        <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Prénom</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        placeholder="Jean"
                                        value={form.firstName}
                                        onChange={handleInputChange}
                                        className="input-modern h-12 text-slate-900 placeholder:text-slate-400 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Nom</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        placeholder="Dupont"
                                        value={form.lastName}
                                        onChange={handleInputChange}
                                        className="input-modern h-12 text-slate-900 placeholder:text-slate-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email professionnel</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="jean.dupont@entreprise.com"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    className="input-modern h-12 w-full text-slate-900 placeholder:text-slate-400 font-medium"
                                />
                            </div>

                            <button type="submit" className="btn-rolex w-full group shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-4">
                                <span className="text-lg">Accéder à mon rapport</span>
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Privacy Notice */}
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-start gap-3 mt-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-500 leading-relaxed">
                                    <strong className="text-slate-700">100% Confidentiel.</strong> Aucune newsletter, aucun spam. Votre email sert uniquement à sauvegarder vos résultats.
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Results Dashboard - With Confetti!
    return (
        <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">

            {renderConfetti()}

            {/* Background Glows */}
            <div className="glow-spot top-[-10%] left-[20%] w-[1000px] h-[1000px] opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="glow-spot top-[40%] right-[-10%] w-[800px] h-[800px] opacity-20"></div>

            {/* Top Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-500 border border-slate-200 hidden sm:block">
                            Dossier #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')} • {form.firstName} {form.lastName}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 pt-12 space-y-16 relative z-10">

                {/* Header Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center animate-in">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100 shadow-sm">
                            Audit Terminé
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1] font-display">
                            Potentiel de <br />
                            <span className="text-gradient">croissance identifié.</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                            Basé sur l'analyse de vos réponses, voici la trajectoire projetée pour {form.firstName} {form.lastName}.
                        </p>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="relative transform hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-emerald-400/20 blur-[100px] rounded-full animate-pulse"></div>
                            <AnimatedScore score={maturityScore.total} maxScore={100} size={240} />
                        </div>
                    </div>
                </div>

                {/* KPIs Row - HIGH VISIBILITY CARDS */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="card-modern bg-white p-8 border-l-4 border-l-slate-300 h-full hover:shadow-xl transition-shadow">
                            <MetricCard
                                icon={TrendingDown}
                                label="Revenu Actuel (Estimé)"
                                value={Math.round(revenue.current)}
                                suffix=" €"
                                trend="normal"
                                delay={100}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="card-modern bg-white p-8 border-l-4 border-l-emerald-500 shadow-xl shadow-emerald-900/5 h-full relative overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <TrendingUp className="w-24 h-24 text-emerald-500" />
                            </div>
                            <MetricCard
                                icon={TrendingUp}
                                label="Potentiel Optimisé"
                                value={Math.round(revenue.optimized)}
                                suffix=" €"
                                trend="up"
                                trendValue={`+${Math.round(revenue.percentageGain)}%`}
                                delay={200}
                            />
                        </div>
                    </div>
                    {/* Third Metric */}
                    <div className="lg:col-span-1 card-modern p-8 flex flex-col justify-center animate-in bg-white h-full hover:shadow-lg transition-shadow" style={{ animationDelay: '300ms' }}>
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Fiabilité</div>
                        <div className="text-3xl font-bold text-slate-900">Élevée</div>
                        <div className="mt-2 text-xs text-slate-500">Données cohérentes avec le marché.</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Radar */}
                    <div className="card-modern p-8 animate-in bg-white hover:shadow-lg transition-shadow" style={{ animationDelay: '400ms' }}>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 font-display">Équilibre de votre Structure</h3>
                            <p className="text-sm text-slate-500">Comparaison par rapport aux standards du marché.</p>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis
                                    dataKey="pillar"
                                    tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
                                />
                                <PolarRadiusAxis angle={90} domain={[0, 40]} tick={false} axisLine={false} />
                                <Radar
                                    name="Votre Score"
                                    dataKey="score"
                                    stroke="#064E3B"
                                    strokeWidth={3}
                                    fill="#064E3B"
                                    fillOpacity={0.15}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Projection Area */}
                    <div className="card-modern p-8 animate-in bg-white hover:shadow-lg transition-shadow" style={{ animationDelay: '500ms' }}>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 font-display">Trajectoire de Revenus</h3>
                            <p className="text-sm text-slate-500">Projection sur 6 mois après optimisation.</p>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActuel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOptimise" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#064E3B" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#064E3B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    tickFormatter={formatCurrency}
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 600, padding: '4px 0' }}
                                    labelStyle={{ fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Actuel"
                                    stroke="#CBD5E1"
                                    strokeWidth={3}
                                    fill="url(#colorActuel)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Optimisé"
                                    stroke="#064E3B"
                                    strokeWidth={3}
                                    fill="url(#colorOptimise)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Recommendations */}
                <div className="space-y-8 animate-in" style={{ animationDelay: '600ms' }}>
                    <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                        <h2 className="text-3xl font-bold text-slate-900">Plan d'Action Prioritaire</h2>
                        <div className="hidden md:block text-slate-500 font-medium">Top Recommandations</div>
                    </div>

                    {topRecommendations.map((rec, index) => (
                        <div
                            key={index}
                            className="card-modern p-8 md:p-10 group transition-all bg-white hover:border-emerald-200 hover:shadow-emerald-900/5 duration-300"
                        >
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-rolex-900 text-white font-bold flex items-center justify-center text-xl shadow-lg shadow-emerald-900/10 transform group-hover:scale-110 transition-transform duration-300">
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors font-display">{rec.title}</h3>
                                        {rec.quickWin && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                                <Zap className="w-3.5 h-3.5 fill-current" /> IMPACT RAPIDE
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-4xl">{rec.description}</p>

                                    <div className="grid md:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 group-hover:bg-emerald-50/30 transition-colors">
                                        {rec.actions.map((action, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-700 font-medium">{action}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Gain Potentiel</div>
                                        <div className="text-xl font-bold text-emerald-700">+{Math.round(rec.estimatedGain).toLocaleString('fr-FR')} € / an</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* AI Analysis Section */}
                <div className="card-modern p-8 md:p-10 bg-white border border-indigo-100 shadow-xl shadow-indigo-900/5 animate-in" style={{ animationDelay: '800ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Analyse de l'agent Skaleos</h2>
                            <p className="text-sm text-slate-500">Basé sur vos 10 points de contrôle</p>
                        </div>
                    </div>

                    <div className="prose prose-indigo max-w-none text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        <AIAnalysisDisplay analysis={aiAnalysis} loading={aiLoading} error={aiError} />
                    </div>
                </div>

                {/* Video Embedding */}
                <div className="card-modern overflow-hidden animate-in bg-white" style={{ animationDelay: '900ms' }}>
                    <div className="grid md:grid-cols-12 gap-0">
                        <div className="md:col-span-5 p-10 md:p-16 flex flex-col justify-center bg-white">
                            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                                Méthodologie
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 font-display">Comprendre la mécanique.</h3>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                La croissance n'est pas un art, c'est une science. Découvrez comment nous aidons les entreprises à visualiser et optimiser leurs ventes.
                            </p>
                            <div className="text-sm font-medium text-slate-500">
                                Rejoignez l'élite des commerciaux B2B.
                            </div>
                        </div>
                        <div className="md:col-span-7 bg-slate-900 relative min-h-[400px]">
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/XV8D1_IesDA?si=xCuLCzhb4ULrKWyO"
                                title="Skaleos Methodology"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="py-20 animate-in" style={{ animationDelay: '1000ms' }}>
                    {/* Title + Photo */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
                        {/* Corentin's Profile Photo */}
                        <div className="relative flex-shrink-0 animate-in" style={{ animationDelay: '1100ms' }}>
                            <div className="relative">
                                <img
                                    src="/corentin-profile.png"
                                    alt="Corentin - Expert en croissance B2B"
                                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                />
                                {/* Subtle glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-2xl blur-xl -z-10"></div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display text-center md:text-left">
                            Ne laissez pas ces revenus sur la table.
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500 font-medium mb-8 text-center">
                        Session de 30 min avec Corentin pour optimiser votre système de vente • Valeur 250€
                    </p>

                    {/* iClosed widget centered */}
                    <div className="flex justify-center animate-in" style={{ animationDelay: '1200ms' }}>
                        <IClosedWidget />
                    </div>
                </div>


                {/* Footer */}
                <div className="border-t border-slate-200 pt-10 pb-6 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        &copy; {new Date().getFullYear()} Skaleos. L'agence de croissance B2B.
                    </p>
                </div>
            </div>
        </div>
    );
}
