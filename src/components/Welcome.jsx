import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, ArrowLeft, Star, TrendingUp, BarChart3, Activity } from 'lucide-react';
import Logo from './Logo';

export default function Welcome({ onStart }) {

    return (
        <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-glow-effect overflow-hidden py-12 px-6">

            <div className="absolute top-6 left-6 z-50">
                <Logo />
            </div>

            {/* Ambient Glow Elements */}
            <div className="glow-spot top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] opacity-40 blur-[120px]"></div>
            <div className="glow-spot bottom-[-20%] right-[-10%] w-[600px] h-[600px] opacity-30 blur-[100px]"></div>

            <div className="relative z-10 w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center animate-in">

                {/* Main Value Prop */}
                <div className="space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-display">
                            Diagnostiquez votre <br />
                            <span className="text-gradient">performance commerciale.</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
                            Identifiez en 2 minutes le levier exact qui bloque votre passage au niveau supérieur.
                        </p>
                    </div>

                    {/* Benefits List - 3 checks + credibility */}
                    <div className="flex flex-col gap-4 text-left bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm w-full max-w-md">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span className="font-medium text-slate-700">Audit commercial en 2 minutes</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span className="font-medium text-slate-700">Plan d’action structuré</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span className="font-medium text-slate-700">Score final décisionnel</span>
                            </div>
                        </div>

                        {/* Credibility Section */}
                        <div className="w-full border-t border-slate-200 pt-4 mt-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-700">Déployé sur +2M€ de CA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Area */}
                    <div className="flex flex-col items-center lg:items-start gap-4 w-full max-w-md">
                        <button
                            onClick={onStart}
                            className="btn-rolex w-full text-lg py-5 shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Lancer mon analyse GRATUITE
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                        </button>

                        <div className="flex items-center gap-6 text-sm text-slate-500 justify-center w-full">
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

                {/* Result Preview (New mockup section) */}
                <div className="relative w-full max-w-md mx-auto hidden lg:block transform hover:rotate-2 transition-transform duration-500">
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/30 to-rolex-900/30 rounded-[2rem] blur-xl opacity-50"></div>
                    <div className="card-modern relative bg-white/90 backdrop-blur-xl p-8 shadow-2xl border border-white/40 overflow-hidden">
                        
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <BarChart3 className="w-32 h-32" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            {/* Mock Header */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                                    Aperçu de vos résultats
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 font-display">Plan d'Action Personnalisé</h3>
                            </div>

                            {/* Mock Score Indicator */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center bg-white shadow-inner">
                                    <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-emerald-500 rounded-full rotate-45 opacity-50"></div>
                                    <div className="absolute inset-0 w-full h-full border-4 border-transparent border-r-emerald-500 rounded-full rotate-45 opacity-70"></div>
                                    <span className="text-2xl font-bold text-slate-800">82<span className="text-sm text-slate-400">/100</span></span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-700">Maturité Commerciale</div>
                                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> Supérieur à la moyenne
                                    </div>
                                </div>
                            </div>

                            {/* Mock Action Plan list */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 opacity-90">
                                    <div className="w-8 h-8 rounded-full bg-rolex-900 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                                        <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                                        <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 opacity-70">
                                    <div className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-slate-200 rounded-full w-2/3"></div>
                                        <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 opacity-40">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Blur CTA overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4 z-20">
                                <div className="text-sm font-bold text-slate-500 italic flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Découvrez votre plan
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
