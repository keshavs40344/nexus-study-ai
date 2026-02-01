// src/components/Schedule/ListView.jsx
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import {
  CheckCircle, Clock, BookOpen, Target, AlertCircle, ChevronDown,
  ChevronRight, Filter, ArrowUpDown, MoreVertical, Edit2, Trash2,
  Calendar as CalendarIcon, AlertTriangle
} from 'lucide-react';

const ListView = ({ 
  schedule, 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete, 
  onAddTask,
  onTaskDrag,
  onTaskDrop,
  viewMode 
}) => {
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [sortBy, setSortBy] = useState('date'); // 'date', 'priority', 'type', 'duration'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Flatten and sort tasks
  const sortedTasks = useMemo(() => {
    const allTasks = schedule.flatMap(day => 
      (day.tasks || []).map(task => ({
        ...task,
        date: day.date,
        phase: day.phase,
        dateObj: parseISO(day.date)
      }))
    );

    return allTasks.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.dateObj - b.dateObj;
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          comparison = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'duration':
          comparison = (b.duration || 0) - (a.duration || 0);
          break;
        default:
          comparison = a.dateObj - b.dateObj;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [schedule, sortBy, sortOrder]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    sortedTasks.forEach(task => {
      const dateStr = task.date.split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(task);
    });
    return grouped;
  }, [sortedTasks]);

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

  const getPriorityBadge = (priority) => {
    const config = {
      high: { color: 'bg-red-500/20 text-red-400', icon: <AlertTriangle className="w-3 h-3" /> },
      medium: { color: 'bg-yellow-500/20 text-yellow-400', icon: null },
      low: { color: 'bg-blue-500/20 text-blue-400', icon: null }
    };
    
    const cfg = config[priority?.toLowerCase()] || config.medium;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${cfg.color}`}>
        {cfg.icon}
        {priority}
      </span>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="bg-gray-800/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">All Tasks</h3>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              {sortedTasks.length} tasks
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white"
              >
                <option value="date">Date</option>
                <option value="priority">Priority</option>
                <option value="type">Type</option>
                <option value="duration">Duration</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 border-b border-gray-800 pb-3 mb-3">
          <div className="col-span-1"></div>
          <div className="col-span-4">Task</div>
          <div 
            className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => handleSort('type')}
          >
            Type
            {sortBy === 'type' && (
              <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
          <div 
            className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => handleSort('priority')}
          >
            Priority
            {sortBy === 'priority' && (
              <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
          <div 
            className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
            onClick={() => handleSort('duration')}
          >
            Duration
            {sortBy === 'duration' && (
              <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {Object.entries(tasksByDate).map(([dateStr, tasks]) => {
          const date = parseISO(dateStr);
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
          const isExpanded = expandedDays.has(dateStr);
          
          return (
            <div key={dateStr} className="bg-gray-900/30 rounded-xl overflow-hidden">
              {/* Day Header */}
              <div className="p-4 bg-gray-800/30 border-b border-gray-800">
                <button
                  onClick={() => toggleDayExpand(dateStr)}
                  className="w-full flex items-center justify-between hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isToday ? 'bg-blue-500/20' : 'bg-gray-800'}`}>
                        <CalendarIcon className={`w-4 h-4 ${isToday ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      
                      <div>
                        <div className="font-bold text-white">
                          {format(date, 'EEEE, MMMM d')}
                          {isToday && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {tasks.length} tasks • {tasks.reduce((sum, t) => sum + (t.duration || 0), 0)} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">
                      {tasks.filter(t => t.completed).length}/{tasks.length} completed
                    </div>
                  </div>
                </button>
              </div>

              {/* Tasks for this day */}
              {isExpanded && (
                <div className="p-4 space-y-2">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => onTaskDrag(task, dateStr)}
                      className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border ${
                        task.completed
                          ? 'bg-gray-800/30 border-gray-700'
                          : 'bg-gray-800/50 border-gray-800 hover:border-gray-700'
                      } transition-colors cursor-move`}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <button
                          onClick={() => onTaskComplete(task.id, dateStr, index)}
                          className={`w-5 h-5 rounded border-2 ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-600 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                      </div>

                      {/* Task Title */}
                      <div className="col-span-4">
                        <div className={`font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-white'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {task.description || task.subject}
                        </div>
                      </div>

                      {/* Type */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          {getTaskTypeIcon(task.type)}
                          <span className="text-sm">{task.type}</span>
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="col-span-2">
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Duration */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{task.duration || 60}m</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-700 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          
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
                </div>
              )}
            </div>
          );
        })}
        
        {Object.keys(tasksByDate).length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-white mb-2">No tasks found</h3>
            <p className="text-gray-400">Try adjusting your filters or add new tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
