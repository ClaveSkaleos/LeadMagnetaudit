import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const QUESTIONS = [
    "Pouvez-vous prouver mathématiquement pourquoi un deal a échoué, ou devez-vous vous fier au récit de votre commercial ?",
    "Si votre meilleur vendeur quitte l'entreprise demain, votre système maintient-il sa performance sans lui ?",
    "Votre CRM contient-il plus de 20% d'opportunités sans action depuis 14 jours ?",
    "Vos prévisions reposent-elles sur des données objectives ou sur l'optimisme de votre équipe ?",
    "Le transfert d'informations entre vente et production est-il automatisé ou basé sur des emails ?"
];

export default function AuditStep({ auditAnswers, setAuditAnswers, onNext }) {
    const handleAnswer = (index, value) => {
        const newAnswers = [...auditAnswers];
        newAnswers[index] = value;
        setAuditAnswers(newAnswers);
    };

    const allAnswered = auditAnswers.every(a => a !== null);

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right duration-500 px-4">
            <div className="space-y-3 text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-architect-alert/10 border border-architect-alert/20 px-4 py-2 rounded-full mb-2">
                    <AlertCircle className="w-4 h-4 text-architect-alert" />
                    <span className="text-sm font-medium text-architect-alert">Audit de fiabilité</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display">Évaluez votre système</h2>
                <p className="text-architect-text/60 max-w-xl mx-auto">Répondez honnêtement à ces 5 questions pour identifier vos failles structurelles</p>
            </div>

            <div className="space-y-4">
                {QUESTIONS.map((q, i) => (
                    <div key={i} className="bg-architect-card/50 backdrop-blur p-6 rounded-xl border border-architect-accent/10 hover:border-architect-accent/30 transition-all group">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-architect-accent/20 flex items-center justify-center text-sm font-bold text-architect-accent">
                                {i + 1}
                            </div>
                            <p className="text-base md:text-lg font-medium leading-relaxed pt-0.5">{q}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAnswer(i, 'oui')}
                                className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium ${auditAnswers[i] === 'oui'
                                    ? 'bg-architect-accent/20 text-architect-accent border-architect-accent shadow-lg shadow-architect-accent/20'
                                    : 'border-architect-accent/20 hover:bg-architect-accent/5 text-architect-text/60 hover:text-architect-text'
                                    }`}
                            >
                                <CheckCircle2 className="w-4 h-4" /> OUI
                            </button>
                            <button
                                onClick={() => handleAnswer(i, 'non')}
                                className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium ${auditAnswers[i] === 'non'
                                    ? 'bg-architect-alert/20 text-architect-alert border-architect-alert shadow-lg shadow-architect-alert/20'
                                    : 'border-architect-accent/20 hover:bg-architect-accent/5 text-architect-text/60 hover:text-architect-text'
                                    }`}
                            >
                                <XCircle className="w-4 h-4" /> NON
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-6">
                <button
                    onClick={onNext}
                    disabled={!allAnswered}
                    className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all ${allAnswered
                        ? 'bg-architect-accent text-white hover:bg-architect-accent/90 shadow-lg hover:shadow-architect-accent/30 cursor-pointer hover:-translate-y-0.5 transform'
                        : 'bg-architect-card/50 text-architect-text/30 cursor-not-allowed'
                        }`}
                >
                    Voir les résultats
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
