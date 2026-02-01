// src/components/Dashboard/StudyStreak.jsx
import React from 'react';
import { Flame, Trophy, Zap, Award } from 'lucide-react';

const StudyStreak = ({ streak }) => {
  const getStreakLevel = (days) => {
    if (days >= 100) return { level: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: <Trophy className="w-5 h-5" /> };
    if (days >= 50) return { level: 'Master', color: 'text-red-400', bg: 'bg-red-500/20', icon: <Award className="w-5 h-5" /> };
    if (days >= 30) return { level: 'Advanced', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: <Zap className="w-5 h-5" /> };
    if (days >= 7) return { level: 'Consistent', color: 'text-green-400', bg: 'bg-green-500/20', icon: <Flame className="w-5 h-5" /> };
    return { level: 'Beginner', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <Flame className="w-5 h-5" /> };
  };

  const streakLevel = getStreakLevel(streak);

  // Generate streak calendar
  const generateStreakCalendar = () => {
    const calendar = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate random streak for demo
      const hasStudied = Math.random() > 0.3 || i === 0;
      
      calendar.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        studied: hasStudied
      });
    }
    
    return calendar;
  };

  const calendar = generateStreakCalendar();

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white">Study Streak</h3>
        <div className={`px-3 py-1 rounded-full text-sm ${streakLevel.bg} ${streakLevel.color} flex items-center gap-2`}>
          {streakLevel.icon}
          {streakLevel.level}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-white mb-2">{streak}</div>
        <div className="text-gray-400">consecutive days</div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">This week</span>
          <span className="text-sm text-green-400">
            {calendar.filter(day => day.studied).length}/7 days
          </span>
        </div>
        <div className="flex justify-between">
          {calendar.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-1 ${
                day.studied 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {day.studied ? '🔥' : day.date}
              </div>
              <div className="text-xs text-gray-400">{day.date}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Next milestone</span>
          <span className="text-white font-medium">
            {streak < 7 ? 7 : streak < 30 ? 30 : streak < 50 ? 50 : 100} days
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500`}
            style={{ width: `${Math.min(100, (streak / (streak < 7 ? 7 : streak < 30 ? 30 : streak < 50 ? 50 : 100)) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StudyStreak;
