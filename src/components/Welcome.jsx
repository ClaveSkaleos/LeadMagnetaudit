import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, TrendingDown, Activity, BarChart3, Users, Zap, Target } from 'lucide-react';
import Logo from './Logo';

// --- Count-up animation hook ---
function useCountUp(target, duration = 1400) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(target * ease));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    return display;
}

// --- Preview Data ---
const PREVIEW_SCORE = 61;
const PREVIEW_PILLARS = [
    { label: 'Acquisition', value: 14, max: 30, color: '#F59E0B' },
    { label: 'Prospection', value: 18, max: 30, color: '#10B981' },
    { label: 'Conversion', value: 21, max: 40, color: '#F59E0B' },
    { label: 'Structure', value: 8, max: 30, color: '#EF4444' },
];
const PREVIEW_RECO = [
    {
        number: 1,
        tag: '⚡ IMPACT RAPIDE',
        tagColor: { bg: 'rgba(245,158,11,0.08)', color: '#D97706', border: 'rgba(245,158,11,0.25)' },
        title: 'Optimiser le taux de show-up',
        desc: 'Votre taux de présence aux RDV est de 52%, soit 23 points sous la norme marché. Chaque no-show brûle du CAC.',
        actions: [
            'SMS de confirmation 24h avant le RDV',
            'Lien de reprogrammation automatique',
            'Meilleure qualification en amont',
            'Page de confirmation avec valeur perçue',
        ],
        gain: '18 400',
    },
    {
        number: 2,
        tag: null,
        title: 'Réduire le CPL (Coût par Lead)',
        desc: 'À 87€/lead, votre acquisition coûte 2x la référence sectorielle. Votre CAC global de 1 240€ compresse les marges.',
        actions: [
            'Couper les campagnes au ROI négatif',
            'Tester des audiences lookalike Meta',
            'Développer un canal organique (SEO)',
        ],
        gain: '11 200',
    },
];

// --- Animated Score Ring ---
function ScoreRing() {
    const score = useCountUp(PREVIEW_SCORE, 1600);
    const r = 42;
    const circ = 2 * Math.PI * r;

    return (
        <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '32px 28px',
            borderTop: '3px solid #F59E0B',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 8 }}>
                        Maturité Commerciale
                    </div>
                    <div style={{ fontSize: 54, fontWeight: 800, color: '#111827', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
                        {score}<span style={{ fontSize: 22, color: '#CBD5E1', fontWeight: 600 }}>/100</span>
                    </div>
                    <div style={{
                        marginTop: 10,
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 12px', borderRadius: 100,
                        background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.2)',
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', letterSpacing: '0.04em' }}>Optimisation nécessaire</span>
                    </div>
                </div>
                <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r={r} fill="none" stroke="#F1F5F9" strokeWidth="11" />
                        <circle
                            cx="50" cy="50" r={r} fill="none"
                            stroke="#F59E0B" strokeWidth="11" strokeLinecap="round"
                            strokeDasharray={circ}
                            strokeDashoffset={circ - (circ * score / 100)}
                            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                        />
                    </svg>
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800, color: '#111827' }}>
                        {score}
                    </span>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#F8FAFC', borderRadius: 14, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: 5 }}>Revenu Actuel</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <TrendingDown size={15} color="#94A3B8" /> 42 000 €
                    </div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', marginBottom: 5 }}>Potentiel Optimisé</div>
                    <div style={{ fontSize: 19, fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <TrendingUp size={15} color="#10B981" /> 71 600 €
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Pillar Bars Card ---
function PillarsCard() {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            background: 'white',
            borderRadius: 20,
            padding: '32px 28px',
            borderTop: '3px solid #07674b',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 24, fontFamily: 'Artifika, Georgia, serif' }}>
                Équilibre de votre Structure
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {PREVIEW_PILLARS.map((p) => (
                    <div key={p.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{p.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
                                {p.value}<span style={{ color: '#CBD5E1' }}>/{p.max}</span>
                            </span>
                        </div>
                        <div style={{ height: 8, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                borderRadius: 100,
                                background: p.color,
                                width: animated ? `${(p.value / p.max) * 100}%` : '0%',
                                transition: 'width 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                boxShadow: `0 0 8px ${p.color}60`,
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Main Welcome ---
export default function Welcome({ onStart }) {
    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: [
                'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(7,103,75,0.09) 0%, transparent 60%)',
                'radial-gradient(ellipse 60% 50% at 85% 10%, rgba(19,179,125,0.06) 0%, transparent 55%)',
                'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(230,176,72,0.07) 0%, transparent 60%)',
                '#FAFAF9',
            ].join(', '),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
            position: 'relative',
        }}>
            {/* Logo */}
            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 50 }}>
                <Logo />
            </div>

            {/* ===== HERO ===== */}
            <div className="animate-in" style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: 760,
                margin: '0 auto',
                padding: '120px 24px 64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 32,
            }}>
                {/* Eyebrow badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '6px 16px', borderRadius: 100,
                    background: 'rgba(7,103,75,0.07)', border: '1px solid rgba(7,103,75,0.18)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#07674b',
                }}>
                    <Zap size={12} />
                    Audit Commercial Gratuit — Résultats en 2 minutes
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(38px, 6vw, 64px)',
                    fontWeight: 400,
                    fontFamily: 'Artifika, Georgia, serif',
                    color: '#0F172A',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    margin: 0,
                }}>
                    Diagnostiquez votre<br />
                    <span style={{
                        background: 'linear-gradient(130deg, #07674b 0%, #13b37d 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>performance commerciale.</span>
                </h1>

                {/* Subtitle */}
                <p style={{ fontSize: 18, color: '#64748B', maxWidth: 540, lineHeight: 1.7, margin: 0 }}>
                    Identifiez le levier exact qui bloque votre passage au niveau supérieur — avec un plan d'action chiffré et personnalisé.
                </p>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 400 }}>
                    <button
                        onClick={onStart}
                        className="btn-rolex"
                        style={{ width: '100%', fontSize: 17, padding: '18px 40px' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            Lancer mon analyse GRATUITE
                            <ArrowRight size={18} />
                        </span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: '#94A3B8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={14} color="#10B981" /> 100% Confidentiel
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={14} color="#10B981" /> Gratuit
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Activity size={14} color="#10B981" /> 2 minutes
                        </span>
                    </div>
                </div>

                {/* Social proof strip */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 0,
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
                    padding: '4px',
                    width: '100%',
                    maxWidth: 560,
                }}>
                    {[
                        { icon: <Users size={16} color="#07674b" />, value: '+80', label: 'Fondateurs accompagnés' },
                        { icon: <BarChart3 size={16} color="#07674b" />, value: '+2M€', label: 'de CA analysé' },
                        { icon: <Target size={16} color="#07674b" />, value: '4 piliers', label: 'de croissance évalués' },
                    ].map((stat, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <div style={{ width: 1, height: 36, background: '#E2E8F0', flexShrink: 0 }} />}
                            <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 16px', gap: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {stat.icon}
                                    <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>{stat.value}</span>
                                </div>
                                <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{stat.label}</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* ===== WHAT YOU GET ===== */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: 1040,
                padding: '0 24px 80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 40,
            }}>
                {/* Section header */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px', borderRadius: 100, marginBottom: 16,
                        background: 'rgba(7,103,75,0.06)', border: '1px solid rgba(7,103,75,0.15)',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#07674b',
                    }}>
                        <BarChart3 size={12} /> Exemple de rapport — Données fictives
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(26px, 4vw, 38px)',
                        fontWeight: 400,
                        fontFamily: 'Artifika, Georgia, serif',
                        color: '#0F172A',
                        margin: '0 0 12px',
                    }}>
                        Voici ce que vous allez obtenir
                    </h2>
                    <p style={{ fontSize: 16, color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                        Un rapport personnalisé avec votre score, vos leviers de croissance et vos actions prioritaires.
                    </p>
                </div>

                {/* Row 1 — Score + Pillars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                    <ScoreRing />
                    <PillarsCard />
                </div>

                {/* Row 2 — Priority actions */}
                <div>
                    <div style={{
                        fontSize: 20,
                        fontWeight: 400,
                        fontFamily: 'Artifika, Georgia, serif',
                        color: '#0F172A',
                        paddingBottom: 16,
                        marginBottom: 20,
                        borderBottom: '1px solid #E2E8F0',
                    }}>
                        Plan d'Action Prioritaire
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {PREVIEW_RECO.map((rec, idx) => (
                            <div key={rec.number} className="card-modern" style={{
                                background: 'white',
                                padding: '28px 32px',
                                borderTop: `3px solid ${idx === 0 ? '#07674b' : '#E2E8F0'}`,
                                transition: 'all 0.3s ease',
                            }}>
                                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                                    {/* Number badge */}
                                    <div style={{
                                        width: 34, height: 34, borderRadius: '50%',
                                        background: idx === 0 ? '#07674b' : '#F1F5F9',
                                        color: idx === 0 ? 'white' : '#94A3B8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 800, flexShrink: 0,
                                    }}>
                                        {rec.number}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {/* Title + tag */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <h4 style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'Artifika, Georgia, serif', margin: 0 }}>
                                                {rec.title}
                                            </h4>
                                            {rec.tag && (
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                                                    padding: '3px 10px', borderRadius: 100,
                                                    background: rec.tagColor.bg, color: rec.tagColor.color, border: `1px solid ${rec.tagColor.border}`,
                                                }}>
                                                    {rec.tag}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 16 }}>{rec.desc}</p>
                                        {/* Actions */}
                                        <div style={{
                                            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                            gap: 10, background: '#F8FAFC', borderRadius: 14, padding: '16px 18px',
                                            border: '1px solid #E2E8F0', marginBottom: 14,
                                        }}>
                                            {rec.actions.map((action, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                    <CheckCircle2 size={14} color="#07674b" style={{ marginTop: 2, flexShrink: 0 }} />
                                                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, lineHeight: 1.5 }}>{action}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Gain */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8' }}>Gain Potentiel</span>
                                            <span style={{ fontSize: 18, fontWeight: 800, color: '#07674b', fontFamily: 'Inter, sans-serif' }}>
                                                +{rec.gain} € / an
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 0 32px' }}>
                    {/* Urgency line */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px', borderRadius: 100,
                        background: 'rgba(230,176,72,0.08)', border: '1px solid rgba(230,176,72,0.25)',
                        fontSize: 12, fontWeight: 600, color: '#92400E',
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#E6B048', animation: 'glowPulse 2s infinite' }} />
                        Analyse disponible maintenant — Résultats immédiats
                    </div>
                    <button
                        onClick={onStart}
                        className="btn-rolex"
                        style={{ fontSize: 17, padding: '18px 48px' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            Obtenir mon rapport personnalisé
                            <ArrowRight size={18} />
                        </span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, color: '#94A3B8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={14} color="#10B981" /> 100% Confidentiel
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={14} color="#10B981" /> Gratuit
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Activity size={14} color="#10B981" /> 2 minutes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
