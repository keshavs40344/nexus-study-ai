// src/components/Dashboard/UpcomingSchedule.jsx
import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const UpcomingSchedule = ({ schedule }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Concept Building':
        return 'text-blue-400 bg-blue-500/20';
      case 'Practice & Application':
        return 'text-purple-400 bg-purple-500/20';
      case 'Revision':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {schedule.map((day, index) => (
        <div key={index} className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-white">{formatDate(day.date)}</div>
                <div className="text-xs text-gray-400">{day.subject}</div>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${getPhaseColor(day.phase)}`}>
              {day.phase}
            </div>
          </div>
          
          <div className="space-y-2 ml-11">
            {day.tasks?.slice(0, 2).map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-300 truncate max-w-[160px]">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{task.duration || 60}m</span>
                </div>
              </div>
            ))}
          </div>
          
          {day.tasks?.length > 2 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <button className="w-full flex items-center justify-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                <span>+{day.tasks.length - 2} more tasks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingSchedule;
