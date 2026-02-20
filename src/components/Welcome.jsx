import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Star, TrendingUp, TrendingDown, Zap, Target, Activity, BarChart3, Lock } from 'lucide-react';
import Logo from './Logo';

// --- Fictive Preview Data ---
const PREVIEW_SCORE = 61;
const PREVIEW_SCORE_COLOR = '#F59E0B'; // amber for a "needs improvement" score
const PREVIEW_RECO = [
    {
        number: 1,
        tag: '⚡ IMPACT RAPIDE',
        tagColor: 'bg-amber-50 text-amber-600 border-amber-100',
        title: 'Optimiser le taux de show-up',
        desc: 'Votre taux de présence aux rendez-vous est de 52%, soit 23 points en-dessous de la norme marché. Chaque no-show représente du CAC brûlé.',
        actions: [
            'Envoyer un SMS de confirmation 24h avant le RDV',
            'Proposer un lien de reprogrammation automatique',
            'Qualifier davantage en amont pour des prospects engagés',
            'Ajouter une page de confirmation avec valeur perçue',
        ],
        gain: '18 400',
    },
    {
        number: 2,
        tag: null,
        title: 'Réduire le CPL (Coût par Lead)',
        desc: 'À 87€/lead, votre acquisition coûte 2x la référence sectorielle. Votre CAC global de 1 240€ compresse sévèrement les marges.',
        actions: [
            'Auditer et couper les campagnes au ROI négatif',
            'Tester des audiences lookalike sur Meta',
            'Développer un canal organique (contenu + SEO)',
        ],
        gain: '11 200',
    },
];

const PREVIEW_PILLARS = [
    { label: 'Acquisition', value: 14, max: 30, color: 'bg-amber-400' },
    { label: 'Prospection', value: 18, max: 30, color: 'bg-emerald-500' },
    { label: 'Conversion', value: 21, max: 40, color: 'bg-amber-400' },
    { label: 'Structure', value: 8, max: 30, color: 'bg-red-400' },
];

export default function Welcome({ onStart }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-glow-effect overflow-hidden pt-28 pb-12 md:py-12 px-6">

            <div className="absolute top-6 left-6 z-50">
                <Logo />
            </div>

            {/* Ambient Glow Elements */}
            <div className="glow-spot top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] opacity-40 blur-[120px]"></div>
            <div className="glow-spot bottom-[-20%] right-[-10%] w-[600px] h-[600px] opacity-30 blur-[100px]"></div>

            {/* === HERO SECTION (original layout) === */}
            <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center animate-in space-y-12 mt-4 md:mt-0">

                {/* Main Value Prop */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-display text-black tracking-tight leading-[1.12]">
                        Diagnostiquez votre <br />
                        <span className="text-gradient">performance commerciale.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Identifiez en 2 minutes le levier exact qui bloque votre passage au niveau supérieur.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="flex flex-col gap-4 justify-center items-center text-left bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium text-slate-700">Audit commercial en 2 minutes</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium text-slate-700">Plan d'action structuré</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="font-medium text-slate-700">Score final décisionnel</span>
                        </div>
                    </div>
                    <div className="w-full border-t border-slate-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="text-sm text-slate-700">Méthodologie issue du terrain</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="text-sm text-slate-700">Indicateurs fiables</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <span className="text-sm text-slate-700">Déployé sur +2M€ de CA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                    <button
                        onClick={onStart}
                        className="btn-rolex w-full text-lg py-5 shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Lancer mon analyse GRATUITE
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    </button>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>100% Confidentiel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Gratuit</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* === DETAILED PREVIEW SECTION === */}
            <div className="relative z-10 w-full max-w-5xl mx-auto mt-24 space-y-6">

                {/* Section Header */}
                <div className="text-center space-y-3 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border" style={{ background: 'rgba(7,103,75,0.07)', color: '#07674b', borderColor: 'rgba(7,103,75,0.2)' }}>
                        <BarChart3 className="w-4 h-4" /> Exemple de rapport — Données fictives
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display text-black">
                        Voici ce que vous allez obtenir
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Un rapport personnalisé avec votre score, vos leviers de croissance et vos actions prioritaires.</p>
                </div>

                {/* Preview Cards Row 1 — Score + Pillars */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Score Card */}
                    <div className="card-modern bg-white p-8 flex flex-col items-center gap-6 border-l-4 border-amber-400 shadow-lg">
                        <div className="w-full flex items-center justify-between mb-2">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Maturité Commerciale</div>
                                <div className="text-5xl font-extrabold text-slate-900">{PREVIEW_SCORE}<span className="text-2xl text-slate-400 font-bold">/100</span></div>
                            </div>
                            <div className="w-24 h-24 relative flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                                    <circle
                                        cx="50" cy="50" r="42" fill="none"
                                        stroke={PREVIEW_SCORE_COLOR} strokeWidth="10" strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 42 * PREVIEW_SCORE / 100} ${2 * Math.PI * 42}`}
                                    />
                                </svg>
                                <span className="absolute text-xl font-extrabold text-slate-900">{PREVIEW_SCORE}</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="text-xs text-slate-400 font-semibold uppercase mb-1">Revenu Actuel</div>
                                <div className="text-xl font-bold text-slate-700 flex items-center gap-1"><TrendingDown className="w-4 h-4 text-slate-400" /> 42 000 €</div>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <div className="text-xs text-emerald-600 font-semibold uppercase mb-1">Potentiel Optimisé</div>
                                <div className="text-xl font-bold text-emerald-700 flex items-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-500" /> 71 600 €</div>
                            </div>
                        </div>
                    </div>

                    {/* Pillars Card */}
                    <div className="card-modern bg-white p-8 shadow-lg">
                        <h3 className="font-bold text-slate-900 text-lg mb-6 font-display">Équilibre de votre Structure</h3>
                        <div className="space-y-4">
                            {PREVIEW_PILLARS.map((p) => (
                                <div key={p.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-slate-700">{p.label}</span>
                                        <span className="text-sm font-bold text-slate-500">{p.value}<span className="text-slate-300">/{p.max}</span></span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${p.color} transition-all`}
                                            style={{ width: `${(p.value / p.max) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview Cards Row 2 — Priority Actions */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-display text-slate-900 font-display border-b border-slate-200 pb-4">Plan d'Action Prioritaire</h3>
                    {PREVIEW_RECO.map((rec) => (
                        <div key={rec.number} className="card-modern bg-white p-7 md:p-9 shadow-md hover:shadow-xl transition-shadow">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: '#07674b' }}>
                                    {rec.number}
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h4 className="text-xl font-display text-slate-900">{rec.title}</h4>
                                        {rec.tag && (
                                            <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${rec.tagColor}`}>
                                                {rec.tag}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 mb-5 leading-relaxed">{rec.desc}</p>
                                    <div className="grid md:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-5 border border-slate-100 mb-4">
                                        {rec.actions.map((action, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-700 text-sm font-medium">{action}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gain Potentiel</span>
                                        <span className="text-lg font-bold" style={{ color: '#07674b' }}>+{rec.gain} € / an</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Final CTA */}
                <div className="flex flex-col items-center gap-4 pt-6 pb-12">
                    <button
                        onClick={onStart}
                        className="btn-rolex text-lg py-5 px-12 shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Obtenir mon rapport personnalisé
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    </button>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Confidentiel</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Gratuit</div>
                        <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-500" /> 2 minutes</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
