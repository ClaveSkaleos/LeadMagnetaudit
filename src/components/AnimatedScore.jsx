import React, { useEffect, useState } from 'react';

export default function AnimatedScore({ score, maxScore = 100, size = 200 }) {
    const [currentScore, setCurrentScore] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);

    const strokeWidth = 8; /* Thinner stroke for elegance */
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (animatedScore / maxScore) * circumference;

    // Animate score on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 300);

        return () => clearTimeout(timer);
    }, [score]);

    // Count-up animation
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const stepValue = score / steps;
        const stepDuration = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setCurrentScore(Math.min(Math.round(stepValue * currentStep), score));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [score]);

    // Dynamic color based on percentage score
    const getColor = () => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 75) return { start: '#064E3B', end: '#10B981' }; // Dark Green (75-100%)
        if (percentage >= 50) return { start: '#059669', end: '#34D399' }; // Light Green (50-75%)
        if (percentage >= 30) return { start: '#D97706', end: '#F59E0B' }; // Orange (30-50%)
        return { start: '#DC2626', end: '#F87171' }; // Red (0-30%)
    };

    const colors = getColor();

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <defs>
                    <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.start} />
                        <stop offset="100%" stopColor={colors.end} />
                    </linearGradient>
                </defs>

                {/* Background circle - Very subtle slate */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F1F5F9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Animated progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#scoreGradient-${score})`}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
            </svg>

            {/* Score text in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-slate-900 mb-1 tracking-tight">
                    {currentScore}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                    Score Global
                </div>
            </div>
        </div>
    );
}
