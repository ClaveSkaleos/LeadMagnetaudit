import React from 'react';

export default function QuestionInput({ question, value, onChange }) {

    // Number Input
    if (question.type === 'number') {
        return (
            <div className="relative">
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    placeholder={question.placeholder || '0'}
                    className="input-modern"
                />
                {question.unit && (
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                        {question.unit}
                    </span>
                )}
            </div>
        );
    }

    // Percentage Input
    if (question.type === 'percentage') {
        return (
            <div className="relative">
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(question.id, e.target.value)}
                    placeholder={question.placeholder || '0'}
                    className="input-modern"
                    max="100"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                    %
                </span>
            </div>
        );
    }

    // Select Input
    if (question.type === 'select') {
        return (
            <div className="grid gap-3">
                {question.options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(question.id, option.value)}
                        className={`
                            relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
                            flex items-center justify-between group
                            ${value === option.value
                                ? 'border-rolex-900 bg-emerald-50/30'
                                : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        <span className={`text-lg font-medium ${value === option.value ? 'text-rolex-900' : 'text-slate-600'}`}>
                            {option.label}
                        </span>

                        {/* Radio visual */}
                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${value === option.value ? 'border-rolex-900' : 'border-slate-300'}
                        `}>
                            {value === option.value && <div className="w-3 h-3 rounded-full bg-rolex-900" />}
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    // Boolean Input (Yes/No)
    if (question.type === 'boolean') {
        return (
            <div className="flex gap-4">
                {/* YES Option */}
                <button
                    onClick={() => onChange(question.id, true)}
                    className={`
                        flex-1 p-5 rounded-2xl border-2 transition-all font-bold text-lg
                        ${value === true
                            ? 'border-rolex-900 bg-rolex-900 text-white shadow-lg transform scale-[1.02]'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                        }
                    `}
                >
                    Oui
                </button>

                {/* NO Option */}
                <button
                    onClick={() => onChange(question.id, false)}
                    className={`
                        flex-1 p-5 rounded-2xl border-2 transition-all font-bold text-lg
                        ${value === false
                            ? 'border-slate-800 bg-white text-slate-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }
                    `}
                >
                    Non
                </button>
            </div>
        );
    }

    return null; /* Fallback */
}
