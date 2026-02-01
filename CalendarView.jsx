// src/components/Schedule/CalendarView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { 
  CheckCircle, Clock, BookOpen, Target, AlertCircle, 
  MoreVertical, Edit2, Trash2, Move, Plus, ChevronDown,
  Calendar as CalendarIcon
} from 'lucide-react';

const CalendarView = ({ 
  schedule, 
  currentDate, 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete, 
  onAddTask,
  onTaskDrag,
  onTaskDrop,
  viewMode 
}) => {
  const [expandedDays, setExpandedDays] = useState(new Set());
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    schedule.forEach(day => {
      const dateStr = day.date.split('T')[0];
      grouped[dateStr] = day.tasks || [];
    });
    return grouped;
  }, [schedule]);

  const toggleDayExpand = (dateStr) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr);
      } else {
        newSet.add(dateStr);
      }
      return newSet;
    });
  };

  const getTaskTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'study': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'practice': return <Target className="w-4 h-4 text-green-400" />;
      case 'test': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'revision': return <Clock className="w-4 h-4 text-purple-400" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  // Calendar header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateStr] || [];
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isCurrentDay = isToday(date);
          const isExpanded = expandedDays.has(dateStr);
          
          const completedTasks = dayTasks.filter(t => t.completed).length;
          const totalTasks = dayTasks.length;
          
          return (
            <div
              key={dateStr}
              className={`min-h-32 rounded-xl border transition-all hover:border-gray-600 ${
                isCurrentDay
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900/30'
              } ${
                !isCurrentMonth ? 'opacity-40' : ''
              }`}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={() => onTaskDrop(dateStr)}
            >
              {/* Day Header */}
              <div className="p-3 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      isCurrentDay ? 'text-blue-400' : 'text-white'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {isCurrentDay && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        Today
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {totalTasks > 0 && (
                      <span className="text-xs text-gray-400">
                        {completedTasks}/{totalTasks}
                      </span>
                    )}
                    <button
                      onClick={() => onAddTask(dateStr)}
                      className="p-1 hover:bg-gray-800 rounded"
                    >
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Day Summary */}
                {dayTasks.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0)} min
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div className="p-3">
                {dayTasks.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No tasks</p>
                    <button
                      onClick={() => onAddTask(dateStr)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      Add task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(isExpanded ? dayTasks : dayTasks.slice(0, 2)).map((task, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => onTaskDrag(task, dateStr)}
                        className={`p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)} ${
                          task.completed
                            ? 'bg-gray-800/30 border-gray-700'
                            : 'bg-gray-800/50 border-gray-800'
                        } hover:bg-gray-800 transition-colors cursor-move`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => onTaskComplete(task.id, dateStr, index)}
                              className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${
                                task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-600 hover:border-green-500'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium truncate ${
                                task.completed ? 'text-gray-500 line-through' : 'text-white'
                              }`}>
                                {task.title}
                              </div>
                              
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  {getTaskTypeIcon(task.type)}
                                  <span>{task.type}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Clock className="w-3 h-3" />
                                  <span>{task.duration || 60}m</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-700 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                            
                            {/* Task Actions Dropdown */}
                            <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-10 hidden group-hover:block">
                              <div className="py-1">
                                <button
                                  onClick={() => onTaskEdit(task, dateStr, index)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit Task
                                </button>
                                <button
                                  onClick={() => onTaskDelete(task.id, dateStr, index)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Task
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayTasks.length > 2 && !isExpanded && (
                      <button
                        onClick={() => toggleDayExpand(dateStr)}
                        className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-2"
                      >
                        +{dayTasks.length - 2} more tasks
                      </button>
                    )}
                    
                    {isExpanded && dayTasks.length > 2 && (
                      <button
                        onClick={() => toggleDayExpand(dateStr)}
                        className="w-full text-center text-sm text-blue-400 hover:text-blue-300 py-2"
                      >
                        Show less
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-400 pt-6 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Study</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Practice</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Test</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Revision</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
