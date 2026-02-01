// src/components/Schedule/AIEditor.jsx
import React, { useState } from 'react';
import { X, BrainCircuit, RefreshCw, Zap, Target, Clock, BarChart3, CheckCircle } from 'lucide-react';

const ScheduleAIEditor = ({ schedule, config, onClose, onApply }) => {
  const [optimizationType, setOptimizationType] = useState('balance');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const optimizationOptions = [
    {
      id: 'balance',
      title: 'Balance Workload',
      description: 'Evenly distribute tasks to avoid burnout',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'priority',
      title: 'Priority-Based',
      description: 'Focus on high-priority tasks first',
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'time',
      title: 'Time Optimization',
      description: 'Minimize gaps and maximize efficiency',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'performance',
      title: 'Performance Boost',
      description: 'Optimize for maximum retention',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    setTimeout(() => {
      const generatedSuggestions = [
        {
          id: 1,
          type: 'reschedule',
          title: 'Move heavy tasks to weekends',
          description: 'Reschedule 3 high-intensity tasks from weekdays to weekends',
          impact: 'High',
          tasksAffected: 3
        },
        {
          id: 2,
          type: 'balance',
          title: 'Balance daily workload',
          description: 'Even out study hours across all days',
          impact: 'Medium',
          tasksAffected: 8
        },
        {
          id: 3,
          type: 'consolidate',
          title: 'Consolidate similar tasks',
          description: 'Group similar subjects together for better focus',
          impact: 'High',
          tasksAffected: 5
        },
        {
          id: 4,
          type: 'add-breaks',
          title: 'Add more breaks',
          description: 'Insert 15-minute breaks between intensive sessions',
          impact: 'Low',
          tasksAffected: 12
        }
      ];
      
      setSuggestions(generatedSuggestions);
      setIsOptimizing(false);
    }, 2000);
  };

  const handleApplyOptimization = () => {
    // Here you would apply the AI optimizations
    const optimizedSchedule = [...schedule]; // This would be the AI-optimized schedule
    onApply(optimizedSchedule);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Schedule Optimizer</h2>
                <p className="text-gray-400">Let AI improve your study schedule</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Optimization Options */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Optimization Goal</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {optimizationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setOptimizationType(option.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    optimizationType === option.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      optimizationType === option.id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="font-bold text-white">{option.title}</div>
                  </div>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Schedule Analysis */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Current Schedule Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {schedule.length}
                </div>
                <div className="text-sm text-gray-400">Total Days</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {schedule.flatMap(d => d.tasks).length}
                </div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {Math.round(schedule.flatMap(d => d.tasks).filter(t => t.completed).length / Math.max(1, schedule.flatMap(d => d.tasks).length) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Completion</div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {Math.round(schedule.reduce((sum, day) => sum + (day.tasks?.reduce((tSum, t) => tSum + (t.duration || 0), 0) || 0), 0) / 60)}
                </div>
                <div className="text-sm text-gray-400">Total Hours</div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 bg-gray-800/30 border border-gray-800 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{suggestion.title}</div>
                          <div className="text-sm text-gray-400">{suggestion.description}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        suggestion.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                        suggestion.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {suggestion.impact} Impact
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 ml-11">
                      Affects {suggestion.tasksAffected} tasks
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to Optimize</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Click the button below to let AI analyze and optimize your schedule
                based on your selected goals.
              </p>
            </div>
          )}

          {/* Optimization Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-4">
              {suggestions.length > 0 ? (
                <button
                  onClick={handleApplyOptimization}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Apply Optimizations
                </button>
              ) : (
                <button
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-5 h-5" />
                      Run AI Optimization
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAIEditor;
