import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, ArrowLeft, Star, TrendingUp } from 'lucide-react';
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

            <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center animate-in space-y-12">

                {/* Main Value Prop */}
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-display">
                        Diagnostiquez votre <br />
                        <span className="text-gradient">performance commerciale.</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Identifiez en 2 minutes le levier exact qui bloque votre passage au niveau supérieur.
                    </p>
                </div>

                {/* Benefits List - 3 checks + credibility */}
                <div className="flex flex-col gap-4 justify-center items-center text-left bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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

                {/* CTA Area */}
                <div className="flex flex-col items-center gap-6 w-full max-w-md">
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

        </div>
    );
}
