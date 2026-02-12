import React, { useState } from 'react';
import Welcome from './components/Welcome';
import QuestionFlow from './components/QuestionFlow';
import Dashboard from './components/Dashboard';
import { generateSalesAnalysis } from './services/gemini';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Welcome, 1: Questions, 2: Dashboard
  const [formData, setFormData] = useState({});

  // AI Analysis State - Lifted to App for immediate execution
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(null);

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleQuestionsComplete = (data) => {
    setFormData(data);
    setCurrentStep(2);

    // Trigger AI Analysis IMMEDIATELY when questions are done
    // This runs in parallel with the "Scanning" animation and Contact Form
    const runAnalysis = async () => {
      console.log("🚀 Starting AI Analysis in background (App level)...");
      setAiLoading(true);
      setAiError(null);
      try {
        // Pass data twice because the function signature expects (formData, auditAnswers)
        const result = await generateSalesAnalysis(data, data);
        console.log("✅ AI Analysis completed!");
        setAiAnalysis(result);
      } catch (err) {
        console.error("❌ AI Analysis failed:", err);
        setAiError("L'IA n'a pas pu générer l'analyse. Le système est peut-être surchargé ou le modèle indisponible.");
      } finally {
        setAiLoading(false);
      }
    };
    runAnalysis();
  };

  return (
    <div className="min-h-screen">
      {currentStep === 0 && (
        <Welcome onStart={handleStart} />
      )}

      {currentStep === 1 && (
        <QuestionFlow
          initialData={formData}
          onComplete={handleQuestionsComplete}
        />
      )}

      {currentStep === 2 && (
        <Dashboard
          formData={formData}
          aiAnalysis={aiAnalysis}
          aiLoading={aiLoading}
          aiError={aiError}
        />
      )}
    </div>
  );
}
