// src/pages/EnhancedSetupWizard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetup } from '../contexts/SetupContext';
import { useExamStore } from '../contexts/ExamStoreContext';
import { toast } from 'react-hot-toast';
import SetupFlow from '../components/SetupWizard/SetupFlow';
import ExamSelection from '../components/SetupWizard/ExamSelection';
import StudyParameters from '../components/SetupWizard/StudyParameters';
import ScheduleConfig from '../components/SetupWizard/ScheduleConfig';
import AIConfiguration from '../components/SetupWizard/AIConfiguration';
import LoadingOverlay from '../components/SetupWizard/LoadingOverlay';

const EnhancedSetupWizard = () => {
  const navigate = useNavigate();
  const { setExamConfig } = useExamStore();
  const {
    wizardData,
    generatedSchedule,
    isGenerating,
    goToStep,
    selectExam,
    updateStudyConfig,
    updatePreferences,
    updateAISettings,
    generateStudyPlan,
    resetWizard,
    calculateTotalDays
  } = useSetup();

  const [isLoading, setIsLoading] = useState(false);

  // Calculate derived data
  const totalDays = calculateTotalDays(
    wizardData.studyConfig.startDate,
    wizardData.studyConfig.examDate,
    wizardData.studyConfig.includeWeekends
  );

  const totalStudyHours = wizardData.studyConfig.hoursPerDay * totalDays;

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    
    try {
      // Generate the final study plan
      const plan = await generateStudyPlan();
      
      if (plan) {
        // Set in main exam store
        const userConfig = {
          examId: wizardData.selectedExam.id,
          examName: wizardData.selectedExam.label,
          examDate: wizardData.studyConfig.examDate,
          startDate: wizardData.studyConfig.startDate,
          hoursPerDay: wizardData.studyConfig.hoursPerDay,
          difficulty: wizardData.studyConfig.difficulty,
          studyMode: wizardData.studyConfig.studyMode,
          includeWeekends: wizardData.studyConfig.includeWeekends,
          targetScore: wizardData.studyConfig.targetScore,
          totalDays,
          preferences: wizardData.preferences,
          aiSettings: wizardData.aiSettings,
          userId: `user_${Date.now()}`,
          createdAt: new Date().toISOString()
        };

        setExamConfig(userConfig);
        
        toast.success('Setup completed successfully!');
        
        // Navigate to dashboard after delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      toast.error('Failed to complete setup');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (wizardData.currentStep) {
      case 1:
        return (
          <ExamSelection
            selectedExam={wizardData.selectedExam}
            onSelectExam={selectExam}
            onNext={() => goToStep(2)}
          />
        );
      case 2:
        return (
          <StudyParameters
            config={wizardData.studyConfig}
            onUpdate={updateStudyConfig}
            totalDays={totalDays}
            totalStudyHours={totalStudyHours}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        );
      case 3:
        return (
          <ScheduleConfig
            preferences={wizardData.preferences}
            onUpdate={updatePreferences}
            studyConfig={wizardData.studyConfig}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        );
      case 4:
        return (
          <AIConfiguration
            aiSettings={wizardData.aiSettings}
            onUpdate={updateAISettings}
            studyConfig={wizardData.studyConfig}
            selectedExam={wizardData.selectedExam}
            totalDays={totalDays}
            onBack={() => goToStep(3)}
            onComplete={handleCompleteSetup}
          />
        );
      default:
        return <ExamSelection onSelectExam={selectExam} />;
    }
  };

  if (isGenerating || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <SetupFlow
        currentStep={wizardData.currentStep}
        totalSteps={4}
        onStepClick={goToStep}
        selectedExam={wizardData.selectedExam}
        onReset={resetWizard}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentStep()}
      </div>
      
      {/* Quick Stats Bar */}
      {wizardData.selectedExam && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {wizardData.selectedExam?.label}
                </div>
                <div className="text-sm text-gray-400">Selected Exam</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {totalDays || '--'} days
                </div>
                <div className="text-sm text-gray-400">Study Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {wizardData.studyConfig.hoursPerDay} hours/day
                </div>
                <div className="text-sm text-gray-400">Daily Commitment</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {wizardData.studyConfig.targetScore}%
                </div>
                <div className="text-sm text-gray-400">Target Score</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSetupWizard;
