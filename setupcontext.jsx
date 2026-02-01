// src/contexts/SetupContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { aiSchedulerService } from '../services/aiSchedulerService';

const SetupContext = createContext();

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within SetupProvider');
  }
  return context;
};

export const SetupProvider = ({ children }) => {
  const [wizardData, setWizardData] = useState(() => {
    const saved = localStorage.getItem('nexus_wizard_data');
    return saved ? JSON.parse(saved) : {
      currentStep: 1,
      selectedExam: null,
      studyConfig: {
        hoursPerDay: 6,
        difficulty: 'medium',
        includeWeekends: true,
        targetScore: 85,
        studyMode: 'balanced'
      },
      preferences: {
        dailyStudySlots: [
          { time: 'morning', duration: 2, active: true },
          { time: 'afternoon', duration: 2, active: true },
          { time: 'evening', duration: 2, active: true }
        ],
        breakFrequency: 'moderate',
        revisionCycles: true
      },
      aiSettings: {
        model: 'nexus',
        optimizationLevel: 'high',
        adaptiveSchedule: true
      }
    };
  });

  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('nexus_wizard_data', JSON.stringify(wizardData));
  }, [wizardData]);

  const updateWizardData = useCallback((updates) => {
    setWizardData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 4) {
      updateWizardData({ currentStep: step });
    }
  }, [updateWizardData]);

  const selectExam = useCallback((exam) => {
    updateWizardData({
      selectedExam: exam,
      currentStep: 2
    });
    toast.success(`Selected ${exam.label}`);
  }, [updateWizardData]);

  const updateStudyConfig = useCallback((config) => {
    updateWizardData({
      studyConfig: { ...wizardData.studyConfig, ...config }
    });
  }, [updateWizardData, wizardData.studyConfig]);

  const updatePreferences = useCallback((preferences) => {
    updateWizardData({
      preferences: { ...wizardData.preferences, ...preferences }
    });
  }, [updateWizardData, wizardData.preferences]);

  const updateAISettings = useCallback((settings) => {
    updateWizardData({
      aiSettings: { ...wizardData.aiSettings, ...settings }
    });
  }, [updateWizardData, wizardData.aiSettings]);

  const generateStudyPlan = useCallback(async () => {
    if (!wizardData.selectedExam) {
      toast.error('Please select an exam first');
      return null;
    }

    setIsGenerating(true);
    
    try {
      // Prepare user config for AI scheduler
      const userConfig = {
        examId: wizardData.selectedExam.id,
        examName: wizardData.selectedExam.label,
        category: wizardData.selectedExam.category,
        startDate: wizardData.studyConfig.startDate || new Date().toISOString().split('T')[0],
        examDate: wizardData.studyConfig.examDate,
        hoursPerDay: wizardData.studyConfig.hoursPerDay,
        difficulty: wizardData.studyConfig.difficulty,
        studyMode: wizardData.studyConfig.studyMode,
        includeWeekends: wizardData.studyConfig.includeWeekends,
        targetScore: wizardData.studyConfig.targetScore,
        totalDays: calculateTotalDays(
          wizardData.studyConfig.startDate,
          wizardData.studyConfig.examDate,
          wizardData.studyConfig.includeWeekends
        ),
        preferences: wizardData.preferences,
        aiSettings: wizardData.aiSettings
      };

      // Generate schedule using AI
      const plan = await aiSchedulerService.generateStudyPlan(userConfig);
      
      // Add metadata
      const enhancedPlan = {
        ...plan,
        metadata: {
          ...plan.metadata,
          exam: wizardData.selectedExam,
          config: userConfig,
          generatedAt: new Date().toISOString()
        }
      };

      setGeneratedSchedule(enhancedPlan);
      
      // Save to localStorage
      localStorage.setItem('nexus_generated_schedule', JSON.stringify(enhancedPlan));
      
      toast.success('Study plan generated successfully!');
      return enhancedPlan;
    } catch (error) {
      toast.error('Failed to generate study plan');
      console.error('Error generating study plan:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [wizardData]);

  const calculateTotalDays = (startDate, examDate, includeWeekends) => {
    if (!startDate || !examDate) return 0;
    
    const start = new Date(startDate);
    const exam = new Date(examDate);
    const diffTime = Math.abs(exam - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (!includeWeekends) {
      // Calculate weekends between dates
      let weekends = 0;
      const current = new Date(start);
      
      while (current <= exam) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekends++;
        }
        current.setDate(current.getDate() + 1);
      }
      
      return totalDays - weekends;
    }
    
    return totalDays;
  };

  const resetWizard = useCallback(() => {
    setWizardData({
      currentStep: 1,
      selectedExam: null,
      studyConfig: {
        hoursPerDay: 6,
        difficulty: 'medium',
        includeWeekends: true,
        targetScore: 85,
        studyMode: 'balanced'
      },
      preferences: {
        dailyStudySlots: [
          { time: 'morning', duration: 2, active: true },
          { time: 'afternoon', duration: 2, active: true },
          { time: 'evening', duration: 2, active: true }
        ],
        breakFrequency: 'moderate',
        revisionCycles: true
      },
      aiSettings: {
        model: 'nexus',
        optimizationLevel: 'high',
        adaptiveSchedule: true
      }
    });
    setGeneratedSchedule(null);
    localStorage.removeItem('nexus_wizard_data');
    localStorage.removeItem('nexus_generated_schedule');
  }, []);

  const exportSchedule = useCallback((format = 'json') => {
    if (!generatedSchedule) {
      toast.error('No schedule generated yet');
      return null;
    }

    const exported = aiSchedulerService.exportSchedule(generatedSchedule.schedule, format);
    
    // Create download
    const blob = new Blob([exported], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-schedule-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Schedule exported as ${format.toUpperCase()}`);
    return exported;
  }, [generatedSchedule]);

  const value = {
    wizardData,
    generatedSchedule,
    isGenerating,
    updateWizardData,
    goToStep,
    selectExam,
    updateStudyConfig,
    updatePreferences,
    updateAISettings,
    generateStudyPlan,
    resetWizard,
    exportSchedule,
    calculateTotalDays
  };

  return (
    <SetupContext.Provider value={value}>
      {children}
    </SetupContext.Provider>
  );
};
