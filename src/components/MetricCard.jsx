import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({
    icon: Icon,
    label,
    value,
    prefix = '',
    suffix = '',
    trend,
    trendValue,
    // Removed 'gradient' prop as we enforce a consistent style
    delay = 0
}) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 2000;
            const steps = 60;
            const stepValue = value / steps;
            const stepDuration = duration / steps;
            let currentStep = 0;

            const interval = setInterval(() => {
                currentStep++;
                setAnimatedValue(Math.min(Math.round(stepValue * currentStep), value));

                if (currentStep >= steps) {
                    clearInterval(interval);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div
            className="card-premium p-8 animate-fade-in-up group hover:border-emerald-200 transition-colors duration-300"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-6">
                {/* Icon Container - Clean White with Border */}
                <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                    <Icon className="w-5 h-5 text-slate-600 group-hover:text-emerald-700 transition-colors" />
                </div>

                {trend && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${trend === 'up'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                        {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {prefix}
                    {animatedValue.toLocaleString('fr-FR')}
                    {suffix}
                </div>
            </div>
        </div>
    );
}
