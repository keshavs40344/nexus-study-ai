// src/components/Dashboard/TaskCard.jsx
import React, { useState } from 'react';
import { CheckCircle, Clock, Target, BookOpen, AlertCircle, MoreVertical } from 'lucide-react';

const TaskCard = ({ task, onComplete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getTaskIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'study':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'practice':
        return <Target className="w-4 h-4 text-green-400" />;
      case 'test':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'revision':
        return <Clock className="w-4 h-4 text-purple-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${task.completed ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-800/50 border-gray-800 hover:border-gray-700'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onComplete()}
            className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-600 hover:border-green-500'
            }`}
          >
            {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
          </button>
          
          <div className="flex-1">
            <div className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
              {task.title}
            </div>
            
            {task.description && (
              <div className="text-sm text-gray-400 mt-1">{task.description}</div>
            )}
            
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {getTaskIcon(task.type)}
                <span>{task.type || 'Task'}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{task.duration || 60} min</span>
              </div>
              
              {task.priority && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              )}
              
              {task.estimatedPoints && (
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                  +{task.estimatedPoints} XP
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {showDetails && task.resources && task.resources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Resources:</div>
          <div className="flex flex-wrap gap-2">
            {task.resources.map((resource, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
