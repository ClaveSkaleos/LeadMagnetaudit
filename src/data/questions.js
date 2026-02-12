export const SECTIONS = [
    {
        id: 'acquisition',
        title: 'Acquisition',
        icon: 'Target',
        description: 'Vos flux de prospects entrants'
    },
    {
        id: 'prospection',
        title: 'Prospection',
        icon: 'Zap',
        description: 'Votre démarche sortante (Outbound)'
    },
    {
        id: 'conversion',
        title: 'Conversion',
        icon: 'TrendingUp',
        description: 'Votre performance commerciale'
    },
    {
        id: 'structure',
        title: 'Structure',
        icon: 'Settings',
        description: 'Votre organisation interne'
    }
];

export const QUESTIONS = [
    // ACQUISITION - Section 1 (3 questions)
    {
        id: 'leads_volume',
        section: 'acquisition',
        type: 'number',
        label: 'Combien de prospects avez-vous en appel par mois ?',
        placeholder: '150',
        unit: 'prospects/mois',
        required: true,
        helper: 'Tous canaux confondus'
    },
    {
        id: 'qualified_rate',
        section: 'acquisition',
        type: 'percentage',
        label: 'Quel % de vos prospects sont réellement qualifiés ?',
        placeholder: '40',
        unit: '%',
        required: true,
        helper: 'Prospects correspondant à votre client idéal'
    },
    {
        id: 'cac',
        section: 'acquisition',
        type: 'number',
        label: 'Quel est votre coût d\'acquisition client (CAC) ?',
        placeholder: '500',
        unit: '€',
        required: false,
        helper: '(Optionnel) Si inconnu, laisser vide.'
    },

    // PROSPECTION - Section 2 (3 questions) - NEW
    {
        id: 'outbound_volume',
        section: 'prospection',
        type: 'number',
        label: 'Combien de nouveaux contacts approchez-vous par semaine ?',
        placeholder: '50',
        unit: 'contacts/semaine',
        required: true,
        helper: 'LinkedIn, Email, Téléphone...'
    },
    {
        id: 'response_rate',
        section: 'prospection',
        type: 'percentage',
        label: 'Quel est votre taux de réponse moyen ?',
        placeholder: '5',
        unit: '%',
        required: true,
        helper: 'Estimation'
    },
    {
        id: 'follow_up_system',
        section: 'prospection',
        type: 'boolean',
        label: 'Avez-vous un système pour tracker quelles accroches marchent le mieux ?',
        helper: 'Tests A/B, reporting des messages',
        required: true
    },

    // CONVERSION - Section 3 (4 questions)
    {
        id: 'show_up_rate',
        section: 'conversion',
        type: 'percentage',
        label: 'Quel % de vos prospects se présentent aux RDV ?',
        placeholder: '70',
        unit: '%',
        required: true,
        helper: 'Taux de présence aux rendez-vous programmés'
    },
    {
        id: 'closing_rate',
        section: 'conversion',
        type: 'percentage',
        label: 'Quel est votre taux de closing ?',
        placeholder: '25',
        unit: '%',
        required: true,
        helper: 'Pourcentage de prospects qui deviennent clients'
    },
    {
        id: 'average_deal',
        section: 'conversion',
        type: 'number',
        label: 'Quel est votre panier moyen ?',
        placeholder: '5000',
        unit: '€',
        required: true,
        helper: 'Valeur moyenne d\'un client'
    },
    {
        id: 'sales_reps',
        section: 'conversion',
        type: 'number',
        label: 'Combien de commerciaux actifs avez-vous ?',
        placeholder: '3',
        unit: 'commerciaux',
        required: true
    },

    // STRUCTURE - Section 4 (3 questions)
    {
        id: 'crm_usage',
        section: 'structure',
        type: 'select',
        label: 'Comment utilisez-vous votre CRM ?',
        options: [
            { value: 'systematic', label: 'Usage systématique et rigoureux' },
            { value: 'sometimes', label: 'Usage occasionnel' },
            { value: 'no', label: 'Rarement utilisé' },
            { value: 'no-crm', label: 'Nous n\'avons pas de CRM' }
        ],
        required: true
    },
    {
        id: 'playbook',
        section: 'structure',
        type: 'boolean',
        label: 'Utilisez-vous des techniques de vente structurées ?',
        helper: 'Méthodologie claire et enseignée à l\'équipe'
    },
    {
        id: 'dashboards',
        section: 'structure',
        type: 'boolean',
        label: 'Votre équipe peut-elle suivre ses performances facilement ?',
        helper: 'Accès simple aux chiffres clés'
    }
];

// Benchmarks sectoriels B2B SaaS PME
export const BENCHMARKS = {
    qualifiedRate: 50,  // %
    showUpRate: 75,     // %
    closingRate: 25,    // %
    optimalCacMultiplier: 3  // CAC should be < 3× monthly contract value
};

// Helper functions
export const getQuestionsBySection = (sectionId) => {
    return QUESTIONS.filter(q => q.section === sectionId);
};

export const getQuestionById = (questionId) => {
    return QUESTIONS.find(q => q.id === questionId);
};
