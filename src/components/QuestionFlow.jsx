import React, { useState } from 'react';
import { Target, TrendingUp, Zap, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { SECTIONS, getQuestionsBySection } from '../data/questions';
import QuestionInput from './QuestionInput';
import Logo from './Logo';

const SECTION_ICONS = {
    'Target': Target,
    'TrendingUp': TrendingUp,
    'Settings': Settings,
    'Zap': Zap
};

export default function QuestionFlow({ initialData, onComplete }) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [formData, setFormData] = useState(initialData || {});

    const currentSection = SECTIONS[currentSectionIndex];
    const currentQuestions = getQuestionsBySection(currentSection.id);
    const IconComponent = SECTION_ICONS[currentSection.icon] || Target;

    const progress = ((currentSectionIndex + 1) / SECTIONS.length) * 100;

    const handleInputChange = (questionId, value) => {
        setFormData(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const isAllQuestionsAnswered = () => {
        return currentQuestions.every(q => {
            if (!q.required) return true;
            const value = formData[q.id];
            if (q.type === 'multiselect') {
                return value && value.length > 0;
            }
            if (q.type === 'boolean') {
                return value === true || value === false;
            }
            return value !== undefined && value !== null && value !== '';
        });
    };

    const handleNext = () => {
        if (currentSectionIndex < SECTIONS.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            onComplete(formData);
        }
    };

    const handleBack = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">

            {/* Ambient Background Effect */}
            <div className="glow-spot top-[-20%] right-[-10%] w-[1000px] h-[1000px] opacity-30"></div>

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-2 bg-slate-100 z-50">
                <div
                    className="h-full bg-rolex-900 transition-all duration-700 ease-out box-shadow-lg"
                    style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(6, 78, 59, 0.2)' }}
                />
            </div>

            <div className="absolute top-6 left-6 z-40">
                <Logo />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 relative z-10">
                <div className="w-full max-w-2xl mx-auto">

                    {/* Section Header */}
                    <div className="text-center mb-12 animate-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-xl mb-6 text-rolex-900">
                            <IconComponent className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-display">{currentSection.title}</h2>
                        <p className="text-lg text-slate-500">{currentSection.description}</p>
                    </div>

                    {/* Questions Cards */}
                    <div className="space-y-8 animate-in" style={{ animationDelay: '100ms' }}>
                        {currentQuestions.map((question, index) => (
                            <div
                                key={question.id}
                                className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 relative group"
                            >
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <label className="block text-xl md:text-2xl font-bold text-slate-900 leading-snug font-display">
                                            <span className="text-emerald-500 mr-2">{index + 1}.</span>
                                            {question.label}
                                        </label>
                                        {!question.required && (
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-wide">
                                                Optionnel
                                            </span>
                                        )}
                                    </div>

                                    {question.helper && (
                                        <p className="text-sm text-slate-500 italic -mt-2">{question.helper}</p>
                                    )}

                                    {/* Inputs container */}
                                    <div className="pt-2">
                                        <QuestionInput
                                            question={question}
                                            value={formData[question.id]}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-12">
                        <button
                            onClick={handleBack}
                            disabled={currentSectionIndex === 0}
                            className="text-slate-500 font-semibold hover:text-rolex-900 transition-colors disabled:opacity-0 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Précédent
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!isAllQuestionsAnswered()}
                            className="btn-rolex px-10 py-4 shadow-xl disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                        >
                            {currentSectionIndex < SECTIONS.length - 1 ? 'Continuer' : 'Voir résultats'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
