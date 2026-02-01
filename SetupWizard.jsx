// src/pages/SetupWizard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../contexts/ExamStoreContext';
import { toast } from 'react-hot-toast';
import {
  Search, ChevronRight, ChevronLeft, Calendar, Clock, Target,
  BookOpen, Users, Award, Sparkles, Zap, CheckCircle, Loader2,
  BrainCircuit, TrendingUp, BarChart2, Cpu, Shield, Globe,
  GraduationCap, Briefcase, Stethoscope, Scale, Banknote,
  Calculator, Book, PenTool, Target as TargetIcon
} from 'lucide-react';
import { EXAM_CATEGORIES } from '../data/examDatabase';

const SetupWizard = () => {
  const navigate = useNavigate();
  const { setExamConfig, getRecommendedExams } = useExamStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [config, setConfig] = useState({
    examId: '',
    examName: '',
    category: '',
    examDate: '',
    startDate: new Date().toISOString().split('T')[0],
    hoursPerDay: 6,
    difficulty: 'medium',
    studyMode: 'balanced',
    includeWeekends: true,
    targetScore: 85,
    dailyStudySlots: [
      { time: 'morning', duration: 2, active: true },
      { time: 'afternoon', duration: 2, active: true },
      { time: 'evening', duration: 2, active: true }
    ]
  });

  const [filteredExams, setFilteredExams] = useState([]);
  const [recommendedExams, setRecommendedExams] = useState([]);

  // Load recommended exams
  useEffect(() => {
    const exams = getRecommendedExams();
    setRecommendedExams(exams);
    setFilteredExams(exams);
  }, [getRecommendedExams]);

  // Filter exams based on search and category
  useEffect(() => {
    let filtered = recommendedExams;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exam => exam.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exam => 
        exam.label.toLowerCase().includes(query) ||
        exam.examCode.toLowerCase().includes(query) ||
        exam.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredExams(filtered);
  }, [searchQuery, selectedCategory, recommendedExams]);

  const handleExamSelect = (exam) => {
    setConfig({
      ...config,
      examId: exam.id,
      examName: exam.label,
      category: exam.category
    });
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !config.examId) {
      toast.error('Please select an exam');
      return;
    }
    
    if (currentStep === 2) {
      if (!config.examDate) {
        toast.error('Please select exam date');
        return;
      }
      if (config.hoursPerDay < 1) {
        toast.error('Please set valid study hours');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Validate dates
      const today = new Date();
      const examDate = new Date(config.examDate);
      const startDate = new Date(config.startDate);
      
      if (examDate <= today) {
        toast.error('Exam date must be in the future');
        setLoading(false);
        return;
      }
      
      if (startDate >= examDate) {
        toast.error('Start date must be before exam date');
        setLoading(false);
        return;
      }
      
      // Calculate total days
      const diffTime = Math.abs(examDate - startDate);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (totalDays < 7) {
        toast.error('You need at least 7 days for preparation');
        setLoading(false);
        return;
      }
      
      // Prepare final config
      const finalConfig = {
        ...config,
        totalDays,
        userId: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        preferences: {
          includeWeekends: config.includeWeekends,
          studyMode: config.studyMode,
          dailyStudySlots: config.dailyStudySlots
        }
      };
      
      // Set exam configuration
      setExamConfig(finalConfig);
      
      toast.success('Study plan generated successfully!');
      
      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to generate study plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const icons = {
      finance: <Banknote className="w-5 h-5" />,
      government: <Briefcase className="w-5 h-5" />,
      medical: <Stethoscope className="w-5 h-5" />,
      engineering: <Calculator className="w-5 h-5" />,
      law: <Scale className="w-5 h-5" />,
      defense: <Shield className="w-5 h-5" />,
      banking: <Banknote className="w-5 h-5" />,
      management: <TrendingUp className="w-5 h-5" />
    };
    return icons[categoryId] || <Book className="w-5 h-5" />;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      hard: 'bg-orange-500/20 text-orange-400',
      extreme: 'bg-red-500/20 text-red-400'
    };
    return colors[difficulty] || colors.medium;
  };

  // Step 1: Exam Selection
  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Step 1 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Exam</h2>
        <p className="text-gray-400">
          Select from 50+ exams supported by our AI-powered platform
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams (CA, NEET, UPSC, JEE, GATE...)"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {EXAM_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
              <span className="text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Exams Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recommended Exams</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4" />
            AI-Powered Recommendations
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => handleExamSelect(exam)}
              className={`bg-gray-900/50 border rounded-2xl p-6 text-left transition-all hover:scale-[1.02] group ${
                config.examId === exam.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${exam.bg}`}>
                    <span className="text-2xl">{exam.logo}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-400">
                      {exam.label}
                    </h4>
                    <div className="text-sm text-gray-500">{exam.examCode}</div>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                  {exam.difficulty}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{exam.frequency}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{exam.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{exam.popularity}% popularity</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {getCategoryIcon(exam.category)}
                  <span>{exam.category}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
              </div>
            </button>
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h4 className="text-xl font-bold text-white mb-2">No exams found</h4>
            <p className="text-gray-400">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Study Parameters
  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Step 2 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Set Study Parameters</h2>
        <p className="text-gray-400">
          Customize your study plan based on your preferences and schedule
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Exam Date */}
          <div>
            <label className="block text-white font-medium mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Exam Date
              </div>
            </label>
            <input
              type="date"
              value={config.examDate}
              onChange={(e) => setConfig({ ...config, examDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-400 mt-2">
              Select the date of your actual exam
            </p>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-white font-medium mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Start Date
              </div>
            </label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              max={config.examDate}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-400 mt-2">
              When would you like to start preparing?
            </p>
          </div>

          {/* Daily Study Hours */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-white font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Daily Study Hours: {config.hoursPerDay} hours
                </div>
              </label>
              <span className="text-sm text-gray-400">
                {config.hoursPerDay * 7} hours/week
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={config.hoursPerDay}
              onChange={(e) => setConfig({ ...config, hoursPerDay: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Light (1h)</span>
              <span>Moderate (4-6h)</span>
              <span>Intensive (12h)</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Difficulty Level */}
          <div>
            <label className="block text-white font-medium mb-3">
              <div className="flex items-center gap-2">
                <TargetIcon className="w-5 h-5" />
                Study Intensity
              </div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'easy', label: 'Relaxed', desc: 'Slow pace, low pressure', color: 'green' },
                { id: 'medium', label: 'Balanced', desc: 'Standard preparation', color: 'blue' },
                { id: 'hard', label: 'Intensive', desc: 'Fast pace, focused', color: 'orange' },
                { id: 'extreme', label: 'Extreme', desc: 'Maximum effort', color: 'red' }
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setConfig({ ...config, difficulty: level.id })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    config.difficulty === level.id
                      ? `border-${level.color}-500 bg-${level.color}-500/10`
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  <div className={`font-medium text-${level.color}-400 mb-1`}>
                    {level.label}
                  </div>
                  <div className="text-sm text-gray-400">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Score */}
          <div>
            <label className="block text-white font-medium mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Target Score: {config.targetScore}%
              </div>
            </label>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={config.targetScore}
              onChange={(e) => setConfig({ ...config, targetScore: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Pass (50%)</span>
              <span>Good (75%)</span>
              <span>Excellent (95%)</span>
            </div>
          </div>

          {/* Weekend Study */}
          <div>
            <label className="block text-white font-medium mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekend Study
              </div>
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setConfig({ ...config, includeWeekends: true })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  config.includeWeekends
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                }`}
              >
                Include Weekends
              </button>
              <button
                onClick={() => setConfig({ ...config, includeWeekends: false })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  !config.includeWeekends
                    ? 'border-gray-600 bg-gray-800 text-gray-300'
                    : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
                }`}
              >
                Weekdays Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
        <h4 className="font-bold text-white mb-4">Plan Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {config.examDate 
                ? Math.ceil((new Date(config.examDate) - new Date(config.startDate)) / (1000 * 60 * 60 * 24))
                : '--'
              }
            </div>
            <div className="text-sm text-gray-400">Total Days</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {config.hoursPerDay * (config.includeWeekends ? 7 : 5)}
            </div>
            <div className="text-sm text-gray-400">Hours/Week</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {config.difficulty}
            </div>
            <div className="text-sm text-gray-400">Intensity</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {config.targetScore}%
            </div>
            <div className="text-sm text-gray-400">Target</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Study Schedule Configuration
  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Step 3 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Configure Study Schedule</h2>
        <p className="text-gray-400">
          Customize your daily study routine for optimal productivity
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Time Slots */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Daily Study Slots</h3>
          <div className="space-y-4">
            {config.dailyStudySlots.map((slot, index) => (
              <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const updatedSlots = [...config.dailyStudySlots];
                        updatedSlots[index].active = !updatedSlots[index].active;
                        setConfig({ ...config, dailyStudySlots: updatedSlots });
                      }}
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        slot.active
                          ? 'bg-blue-600'
                          : 'bg-gray-800 border border-gray-700'
                      }`}
                    >
                      {slot.active && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <span className={`font-medium ${slot.active ? 'text-white' : 'text-gray-500'}`}>
                      {slot.time.charAt(0).toUpperCase() + slot.time.slice(1)} Session
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Duration:</span>
                    <select
                      value={slot.duration}
                      onChange={(e) => {
                        const updatedSlots = [...config.dailyStudySlots];
                        updatedSlots[index].duration = parseInt(e.target.value);
                        setConfig({ ...config, dailyStudySlots: updatedSlots });
                      }}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm"
                    >
                      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((hours) => (
                        <option key={hours} value={hours}>
                          {hours} hour{hours !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {slot.active && (
                  <div className="ml-9">
                    <div className="text-sm text-gray-400 mb-2">Suggested Activities:</div>
                    <div className="flex flex-wrap gap-2">
                      {getSuggestedActivities(slot.time).map((activity, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-800/50 rounded-lg text-sm text-gray-300"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-white">AI Recommendation</div>
                <div className="text-sm text-gray-300">
                  Based on your settings, the AI suggests {getTotalDailyHours()} hours per day
                  with breaks between sessions for optimal retention.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Study Preferences */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Study Preferences</h3>
          
          {/* Study Mode */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Study Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'focused', label: 'Focused', icon: '🎯', desc: 'Deep work sessions' },
                { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Mix of study types' },
                { id: 'varied', label: 'Varied', icon: '🔄', desc: 'Frequent changes' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setConfig({ ...config, studyMode: mode.id })}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    config.studyMode === mode.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{mode.icon}</div>
                  <div className="font-medium text-white">{mode.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Break Preferences */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Break Frequency</label>
            <div className="space-y-3">
              {[
                { id: 'frequent', label: 'Frequent Breaks', desc: 'Break every 25 minutes (Pomodoro)' },
                { id: 'moderate', label: 'Moderate Breaks', desc: 'Break every 45 minutes' },
                { id: 'minimal', label: 'Minimal Breaks', desc: 'Break every 90 minutes' }
              ].map((breakOption) => (
                <div
                  key={breakOption.id}
                  className="flex items-center justify-between p-3 bg-gray-900/30 border border-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-white">{breakOption.label}</div>
                    <div className="text-sm text-gray-400">{breakOption.desc}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Schedule */}
          <div>
            <label className="block text-white font-medium mb-3">Revision Cycles</label>
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300">Spaced Repetition</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                  Recommended
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Daily Review</span>
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly Revision</span>
                  <span>2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly Mock Test</span>
                  <span>3 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Sample Daily Schedule</h3>
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
          <div className="space-y-4">
            {[
              { time: '6:00 AM - 8:00 AM', activity: 'Morning Session', type: 'New Concepts' },
              { time: '8:00 AM - 9:00 AM', activity: 'Break & Breakfast', type: 'Rest' },
              { time: '9:00 AM - 11:00 AM', activity: 'Practice Problems', type: 'Application' },
              { time: '11:00 AM - 12:00 PM', activity: 'Quick Revision', type: 'Review' },
              { time: '12:00 PM - 2:00 PM', activity: 'Break & Lunch', type: 'Rest' },
              { time: '2:00 PM - 4:00 PM', activity: 'Study Session', type: 'Deep Work' },
              { time: '4:00 PM - 5:00 PM', activity: 'Physical Activity', type: 'Break' },
              { time: '5:00 PM - 7:00 PM', activity: 'Evening Review', type: 'Revision' }
            ].map((slot, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-400">{slot.time}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{slot.activity}</div>
                    <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                      {slot.type}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full mt-2">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: AI Configuration
  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Step 4 of 4</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">AI Configuration</h2>
        <p className="text-gray-400">
          Configure how the AI should optimize your study plan
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - AI Settings */}
        <div className="space-y-6">
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">AI Optimization Settings</h3>
            
            <div className="space-y-4">
              {/* Priority Weighting */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Topic Priority Weighting</span>
                  <span className="text-sm text-gray-400">High</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-4/5"></div>
                </div>
              </div>

              {/* Difficulty Adjustment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Dynamic Difficulty</span>
                  <span className="text-sm text-gray-400">Enabled</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-3/4"></div>
                </div>
              </div>

              {/* Schedule Flexibility */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Schedule Flexibility</span>
                  <span className="text-sm text-gray-400">Adaptive</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">AI Model</h3>
            <div className="space-y-3">
              {[
                { id: 'gpt4', name: 'GPT-4 Turbo', desc: 'Most advanced, best accuracy', icon: '🤖' },
                { id: 'claude', name: 'Claude 3', desc: 'Excellent reasoning, fast', icon: '🧠' },
                { id: 'gemini', name: 'Gemini Pro', desc: 'Good balance, free tier', icon: '⭐' },
                { id: 'nexus', name: 'Nexus AI (Default)', desc: 'Optimized for study planning', icon: '🚀' }
              ].map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{model.icon}</span>
                    <div>
                      <div className="font-medium text-white">{model.name}</div>
                      <div className="text-sm text-gray-400">{model.desc}</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    {model.id === 'nexus' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Plan Preview</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Selected Exam</span>
                <span className="font-medium text-white">{config.examName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Exam Date</span>
                <span className="font-medium text-white">
                  {config.examDate ? new Date(config.examDate).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Study Duration</span>
                <span className="font-medium text-white">
                  {config.examDate && config.startDate
                    ? `${Math.ceil((new Date(config.examDate) - new Date(config.startDate)) / (1000 * 60 * 60 * 24))} days`
                    : '--'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Daily Commitment</span>
                <span className="font-medium text-white">{getTotalDailyHours()} hours/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Study Mode</span>
                <span className="font-medium text-white capitalize">{config.studyMode}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white">AI Prediction</div>
                  <div className="text-sm text-gray-300">
                    Based on your settings, the AI predicts a score of {predictScore()}%
                    with consistent effort.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Summary */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Features Included</h3>
            <div className="space-y-3">
              {[
                'AI-Generated Daily Schedule',
                'Progress Tracking & Analytics',
                'Smart Revision Reminders',
                'Mock Test Scheduling',
                'Resource Recommendations',
                'Performance Predictions',
                'Adaptive Learning Path',
                'Community Support'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions
  const getTotalDailyHours = () => {
    return config.dailyStudySlots
      .filter(slot => slot.active)
      .reduce((total, slot) => total + slot.duration, 0);
  };

  const getSuggestedActivities = (timeOfDay) => {
    const activities = {
      morning: ['New Concepts', 'Theory Reading', 'Video Lectures'],
      afternoon: ['Practice Problems', 'Case Studies', 'Group Study'],
      evening: ['Revision', 'Mock Tests', 'Notes Making']
    };
    return activities[timeOfDay] || ['Study Session'];
  };

  const predictScore = () => {
    let baseScore = 60;
    
    // Adjust based on hours
    baseScore += (config.hoursPerDay - 4) * 2;
    
    // Adjust based on difficulty
    const difficultyMultiplier = {
      easy: 0.9,
      medium: 1,
      hard: 1.1,
      extreme: 1.2
    }[config.difficulty];
    
    // Adjust based on study mode
    const modeMultiplier = {
      relaxed: 0.9,
      balanced: 1,
      intensive: 1.1
    }[config.studyMode];
    
    let predicted = baseScore * difficultyMultiplier * modeMultiplier;
    
    // Cap at 95%
    return Math.min(95, Math.max(50, Math.round(predicted)));
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const getStepProgress = () => {
    return (currentStep / 4) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-1 bg-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </button>
            
            <div className="flex items-center gap-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`hidden md:inline text-sm ${
                    currentStep === step ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Exam'}
                    {step === 2 && 'Schedule'}
                    {step === 3 && 'Preferences'}
                    {step === 4 && 'AI Config'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-800">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
              currentStep === 1
                ? 'opacity-50 cursor-not-allowed text-gray-500'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="flex items-center gap-4">
            {currentStep < 4 && (
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            
            {currentStep === 4 && (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Study Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-16 h-16 text-blue-500" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Creating Your Perfect Study Plan
            </h3>
            
            <div className="space-y-4 max-w-md mx-auto">
              {[
                'Analyzing exam patterns and weightage...',
                'Optimizing study intervals and breaks...',
                'Generating revision cycles...',
                'Curating resources and materials...',
                'Finalizing AI-powered schedule...'
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupWizard;
