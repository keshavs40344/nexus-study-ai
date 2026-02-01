// src/components/Dashboard/QuickActions.jsx
import React from 'react';
import { Play, Target, Book, BarChart2, Users, Timer, Download, Share2 } from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'focus-mode',
      label: 'Focus Mode',
      icon: <Timer className="w-5 h-5" />,
      color: 'bg-blue-500/20 text-blue-400',
      description: 'Start focused study session'
    },
    {
      id: 'mock-test',
      label: 'Mock Test',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-purple-500/20 text-purple-400',
      description: 'Take practice test'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <Book className="w-5 h-5" />,
      color: 'bg-green-500/20 text-green-400',
      description: 'Browse study materials'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 className="w-5 h-5" />,
      color: 'bg-orange-500/20 text-orange-400',
      description: 'View detailed stats'
    }
  ];

  return (
    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
      <h3 className="font-bold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                {action.icon}
              </div>
              <div className="font-medium text-white group-hover:text-blue-400">
                {action.label}
              </div>
            </div>
            <div className="text-sm text-gray-400">{action.description}</div>
          </button>
        ))}
      </div>
      
      <div className="flex gap-3 mt-6">
        <button className="flex-1 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-gray-300 transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button className="flex-1 py-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-sm text-gray-300 transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
