// src/components/SetupWizard/SetupFlow.jsx
import React from 'react';
import { ChevronLeft, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SetupFlow = ({ currentStep, totalSteps, onStepClick, selectedExam, onReset }) => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Exam', description: 'Select your exam' },
    { number: 2, title: 'Schedule', description: 'Set study parameters' },
    { number: 3, title: 'Preferences', description: 'Customize your routine' },
    { number: 4, title: 'AI Config', description: 'Configure optimization' }
  ];

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${getStepProgress()}%` }}
        ></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left - Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          
          {/* Center - Steps */}
          <div className="hidden md:flex items-center gap-8">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => onStepClick(step.number)}
                className={`flex items-center gap-3 transition-all ${
                  currentStep >= step.number
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {step.number}
                </div>
                <div className="text-left">
                  <div className="font-medium">Step {step.number}</div>
                  <div className="text-sm opacity-75">{step.title}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Right - Selected Exam */}
          <div className="text-right">
            {selectedExam && (
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${selectedExam.bg}`}>
                  <span className="text-lg">{selectedExam.logo}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {selectedExam.label}
                  </div>
                  <div className="text-xs text-gray-400">
                    {selectedExam.examCode}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Steps */}
        <div className="md:hidden flex items-center justify-between py-2">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => onStepClick(step.number)}
              className={`flex flex-col items-center ${
                currentStep === step.number
                  ? 'text-blue-400'
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {step.number}
              </div>
              <div className="text-xs">{step.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetupFlow;
