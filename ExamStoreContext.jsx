// src/contexts/ExamStoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { examDataService } from '../services/examDataService';
import { scheduleService } from '../services/scheduleService';

const ExamStoreContext = createContext();

export const useExamStore = () => {
  const context = useContext(ExamStoreContext);
  if (!context) {
    throw new Error('useExamStore must be used within ExamStoreProvider');
  }
  return context;
};

export const ExamStoreProvider = ({ children }) => {
  const [userConfig, setUserConfig] = useState(() => {
    const saved = localStorage.getItem('nexus_user_config');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [performanceStats, setPerformanceStats] = useState({
    accuracy: 0,
    speed: 0,
    consistency: 0,
    mockScores: [],
    subjectScores: {}
  });
  
  const [studyStreak, setStudyStreak] = useState(() => {
    const saved = localStorage.getItem('nexus_study_streak');
    return saved ? JSON.parse(saved) : { days: 0, lastDate: null };
  });

  // Initialize from localStorage
  useEffect(() => {
    if (userConfig) {
      const scheduleId = `schedule_${userConfig.examId}_${userConfig.userId}`;
      const savedSchedule = localStorage.getItem(scheduleId);
      if (savedSchedule) {
        setCurrentSchedule(JSON.parse(savedSchedule));
      }
    }
  }, [userConfig]);

  // Save to localStorage
  useEffect(() => {
    if (userConfig) {
      localStorage.setItem('nexus_user_config', JSON.stringify(userConfig));
    }
  }, [userConfig]);

  useEffect(() => {
    if (currentSchedule) {
      const scheduleId = `schedule_${userConfig.examId}_${userConfig.userId}`;
      localStorage.setItem(scheduleId, JSON.stringify(currentSchedule));
    }
  }, [currentSchedule, userConfig]);

  // Update streak
  useEffect(() => {
    const today = new Date().toDateString();
    if (studyStreak.lastDate !== today) {
      const newStreak = {
        days: studyStreak.lastDate ? studyStreak.days + 1 : 1,
        lastDate: today
      };
      setStudyStreak(newStreak);
      localStorage.setItem('nexus_study_streak', JSON.stringify(newStreak));
    }
  }, []);

  const setExamConfig = (config) => {
    setUserConfig(config);
    
    // Generate schedule
    const examSyllabus = examDataService.getExamSyllabus(config.examId);
    const { scheduleId, schedule } = scheduleService.generateSchedule(config, examSyllabus);
    
    setCurrentSchedule({
      id: scheduleId,
      data: schedule,
      stats: scheduleService.getScheduleStats(scheduleId)
    });
  };

  const updateSchedule = (updates) => {
    if (!currentSchedule) return;
    
    const updated = scheduleService.updateSchedule(currentSchedule.id, updates);
    setCurrentSchedule({
      ...currentSchedule,
      data: updated,
      stats: scheduleService.getScheduleStats(currentSchedule.id)
    });
  };

  const markTaskComplete = (taskId, completionData = {}) => {
    if (!currentSchedule) return;
    
    scheduleService.markTaskComplete(currentSchedule.id, taskId, completionData);
    
    // Update performance stats
    if (completionData.mockScore) {
      setPerformanceStats(prev => ({
        ...prev,
        mockScores: [...prev.mockScores, completionData.mockScore]
      }));
    }
  };

  const getTodayTasks = () => {
    if (!currentSchedule) return [];
    return scheduleService.getTodayTasks(currentSchedule.id);
  };

  const getExamDetails = (examId) => {
    return examDataService.getExamById(examId);
  };

  const searchExams = (query, category) => {
    return examDataService.searchExams(query, category);
  };

  const getRecommendedExams = () => {
    if (!userConfig) return examDataService.getAllExams().slice(0, 6);
    
    return examDataService.getRecommendedExams({
      category: userConfig.preferences?.category,
      duration: userConfig.studyDuration
    });
  };

  const exportSchedule = (format = 'json') => {
    if (!currentSchedule) return null;
    return scheduleService.exportSchedule(currentSchedule.id, format);
  };

  const resetProgress = () => {
    setCurrentSchedule(null);
    setPerformanceStats({
      accuracy: 0,
      speed: 0,
      consistency: 0,
      mockScores: [],
      subjectScores: {}
    });
    localStorage.removeItem('nexus_user_config');
  };

  const value = {
    userConfig,
    currentSchedule,
    performanceStats,
    studyStreak,
    setExamConfig,
    updateSchedule,
    markTaskComplete,
    getTodayTasks,
    getExamDetails,
    searchExams,
    getRecommendedExams,
    exportSchedule,
    resetProgress,
    setPerformanceStats
  };

  return (
    <ExamStoreContext.Provider value={value}>
      {children}
    </ExamStoreContext.Provider>
  );
};
