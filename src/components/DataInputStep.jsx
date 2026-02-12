import React from 'react';
import { ArrowRight, BarChart3, Users, DollarSign, Target } from 'lucide-react';

export default function DataInputStep({ formData, setFormData, onNext }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValid = formData.leads && formData.rate && formData.cart && formData.reps;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right duration-500 px-4">
            <div className="space-y-2 text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold font-display">Contexte commercial</h2>
                <p className="text-architect-text/60">Renseignez vos indicateurs actuels</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-architect-text/80 group-hover:text-architect-accent transition-colors">
                        <Target className="w-4 h-4" /> Leads entrants par mois
                    </label>
                    <input
                        type="number"
                        name="leads"
                        value={formData.leads}
                        onChange={handleChange}
                        className="w-full bg-architect-card/60 backdrop-blur border border-architect-accent/20 rounded-lg p-4 text-lg focus:ring-2 focus:ring-architect-accent focus:border-transparent outline-none transition-all placeholder:text-architect-text/20 hover:border-architect-accent/40"
                        placeholder="150"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-architect-text/80 group-hover:text-architect-accent transition-colors">
                        <BarChart3 className="w-4 h-4" /> Taux de conversion actuel (%)
                    </label>
                    <input
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        className="w-full bg-architect-card/60 backdrop-blur border border-architect-accent/20 rounded-lg p-4 text-lg focus:ring-2 focus:ring-architect-accent focus:border-transparent outline-none transition-all placeholder:text-architect-text/20 hover:border-architect-accent/40"
                        placeholder="15"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-architect-text/80 group-hover:text-architect-accent transition-colors">
                        <DollarSign className="w-4 h-4" /> Valeur moyenne par client (€)
                    </label>
                    <input
                        type="number"
                        name="cart"
                        value={formData.cart}
                        onChange={handleChange}
                        className="w-full bg-architect-card/60 backdrop-blur border border-architect-accent/20 rounded-lg p-4 text-lg focus:ring-2 focus:ring-architect-accent focus:border-transparent outline-none transition-all placeholder:text-architect-text/20 hover:border-architect-accent/40"
                        placeholder="5000"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="flex items-center gap-2 text-sm font-medium text-architect-text/80 group-hover:text-architect-accent transition-colors">
                        <Users className="w-4 h-4" /> Nombre de commerciaux
                    </label>
                    <input
                        type="number"
                        name="reps"
                        value={formData.reps}
                        onChange={handleChange}
                        className="w-full bg-architect-card/60 backdrop-blur border border-architect-accent/20 rounded-lg p-4 text-lg focus:ring-2 focus:ring-architect-accent focus:border-transparent outline-none transition-all placeholder:text-architect-text/20 hover:border-architect-accent/40"
                        placeholder="3"
                    />
                </div>
            </div>

            <div className="flex justify-center pt-6">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all ${isValid
                        ? 'bg-architect-accent text-white hover:bg-architect-accent/90 shadow-lg hover:shadow-architect-accent/30 cursor-pointer hover:-translate-y-0.5 transform'
                        : 'bg-architect-card/50 text-architect-text/30 cursor-not-allowed'
                        }`}
                >
                    Continuer
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
