// src/components/Schedule/Stats.jsx
import React from 'react';
import { TrendingUp, Clock, Target, Calendar, BarChart3, CheckCircle } from 'lucide-react';

const ScheduleStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
        <div className="text-center py-4">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-gray-400">No statistics available</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Tasks Completed',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      color: 'text-green-400',
      bg: 'bg-green-500/20'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Study Hours',
      value: `${Math.round(stats.completedHours)}h`,
      subValue: `/${Math.round(stats.totalHours)}h`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Days Planned',
      value: stats.daysCount,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20'
    }
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <h3 className="font-bold text-white mb-6">Schedule Statistics</h3>
      
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="font-bold text-white">
                  {item.value}
                  {item.subValue && (
                    <span className="text-gray-400">{item.subValue}</span>
                  )}
                </div>
              </div>
            </div>
            
            {index === 0 && ( // Completion rate progress bar
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, stats.completionRate)}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-400">Overall Progress</div>
          <div className="text-sm font-medium text-white">
            {Math.round(stats.completionRate)}%
          </div>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${Math.min(100, stats.completionRate)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Upcoming Deadlines */}
      {stats.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-3">Upcoming Deadlines</div>
          <div className="space-y-2">
            {stats.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="text-gray-300 truncate">
                  {new Date(deadline.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-gray-400">
                  {deadline.tasks?.length || 0} tasks
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleStats;
