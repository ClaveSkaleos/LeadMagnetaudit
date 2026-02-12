import React, { useState } from 'react';
import Welcome from './components/Welcome';
import QuestionFlow from './components/QuestionFlow';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Welcome, 1: Questions, 2: Dashboard
  const [formData, setFormData] = useState({});

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleQuestionsComplete = (data) => {
    setFormData(data);
    setCurrentStep(2);
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
        <Dashboard formData={formData} />
      )}
    </div>
  );
}
