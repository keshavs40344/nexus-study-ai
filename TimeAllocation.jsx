// src/components/Dashboard/TimeAllocation.jsx
import React from 'react';
import { PieChart, Clock } from 'lucide-react';

const TimeAllocation = ({ subjects }) => {
  const totalTime = subjects.reduce((sum, subject) => sum + (subject.recommendedTime || 100), 0);
  
  // Generate colors for subjects
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white">Time Allocation</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{totalTime} hours total</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {subjects.slice(0, 5).map((subject, index) => {
          const percentage = ((subject.recommendedTime || 100) / totalTime) * 100;
          const color = colors[index % colors.length];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm text-gray-300">{subject.name}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {Math.round(percentage)}%
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {subjects.length > 5 && (
        <button className="w-full mt-4 py-2 text-center text-sm text-blue-400 hover:text-blue-300">
          +{subjects.length - 5} more subjects
        </button>
      )}
    </div>
  );
};

export default TimeAllocation;
