// src/components/Schedule/TimelineView.jsx
import React, { useState, useMemo } from 'react';
import { format, parseISO, differenceInHours, addHours, startOfDay, endOfDay } from 'date-fns';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Clock,
  Calendar, Target, BookOpen, CheckCircle, MoreVertical,
  Edit2, Trash2, Move, AlertCircle
} from 'lucide-react';

const TimelineView = ({
  schedule,
  currentDate,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  viewMode
}) => {
  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [timeRange, setTimeRange] = useState('day'); // 'day', 'week', 'month'

  // Get tasks for selected day
  const dayTasks = useMemo(() => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    const daySchedule = schedule.find(day => 
      day.date.split('T')[0] === dateStr
    );
    
    return daySchedule?.tasks || [];
  }, [schedule, selectedDay]);

  // Group tasks by hour
  const tasksByHour = useMemo(() => {
    const groups = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      tasks: []
    }));
    
    dayTasks.forEach(task => {
      // For demo, assign random hours
      const hour = Math.floor(Math.random() * 24);
      groups[hour].tasks.push(task);
    });
    
    return groups;
  }, [dayTasks]);

  const getTaskTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'study': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'practice': return <Target className="w-4 h-4 text-green-400" />;
      case 'test': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'revision': return <Clock className="w-4 h-4 text-purple-400" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    setSelectedDay(newDate);
  };

  const isToday = format(selectedDay, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDay('prev')}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {format(selectedDay, 'EEEE')}
            </div>
            <div className="text-gray-400">
              {format(selectedDay, 'MMMM d, yyyy')}
              {isToday && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-sm">
                  Today
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => navigateDay('next')}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {dayTasks.length} tasks scheduled
          </div>
          <button
            onClick={() => onAddTask(selectedDay)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Timeline Header */}
        <div className="grid grid-cols-12 border-b border-gray-800">
          <div className="col-span-2 p-4 text-gray-400">Time</div>
          <div className="col-span-10 p-4 text-gray-400">Schedule</div>
        </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-gray-800">
          {tasksByHour.map((hourData, index) => {
            const { hour, tasks } = hourData;
            const currentHour = new Date().getHours();
            const isCurrentHour = isToday && hour === currentHour;
            
            return (
              <div
                key={hour}
                className={`grid grid-cols-12 transition-colors ${
                  isCurrentHour ? 'bg-blue-500/10' : 'hover:bg-gray-800/30'
                }`}
              >
                {/* Time Column */}
                <div className="col-span-2 p-4 border-r border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isCurrentHour ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'
                    }`}></div>
                    <div className="font-medium text-white">
                      {formatHour(hour)}
                    </div>
                    {isCurrentHour && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        Now
                      </span>
                    )}
                  </div>
                </div>

                {/* Schedule Column */}
                <div className="col-span-10 p-4">
                  {tasks.length === 0 ? (
                    <div className="text-gray-500 text-sm">No tasks scheduled</div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className={`p-4 rounded-xl border ${
                            task.completed
                              ? 'bg-gray-800/30 border-gray-700'
                              : 'bg-gray-800/50 border-gray-800 hover:border-gray-700'
                          } transition-colors`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => onTaskComplete(task.id, format(selectedDay, 'yyyy-MM-dd'), taskIndex)}
                                className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${
                                  task.completed
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-600 hover:border-green-500'
                                }`}
                              >
                                {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                              </button>
                              
                              <div>
                                <div className={`font-medium ${
                                  task.completed ? 'text-gray-500 line-through' : 'text-white'
                                }`}>
                                  {task.title}
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    {getTaskTypeIcon(task.type)}
                                    <span>{task.type}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{task.duration || 60}m</span>
                                  </div>
                                  
                                  {task.priority && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {task.priority} priority
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onTaskEdit(task, format(selectedDay, 'yyyy-MM-dd'), taskIndex)}
                                className="p-2 hover:bg-gray-700 rounded-lg"
                              >
                                <Edit2 className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => onTaskDelete(task.id, format(selectedDay, 'yyyy-MM-dd'), taskIndex)}
                                className="p-2 hover:bg-gray-700 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {dayTasks.length}
          </div>
          <div className="text-sm text-gray-400">Total Tasks</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {dayTasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {dayTasks.reduce((sum, task) => sum + (task.duration || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Minutes</div>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {dayTasks.length > 0 
              ? Math.round((dayTasks.filter(t => t.completed).length / dayTasks.length) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-400">Completion Rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSelectedDay(new Date())}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          Go to Today
        </button>
        
        <button
          onClick={() => {
            const randomTasks = dayTasks.filter(t => !t.completed);
            if (randomTasks.length > 0) {
              const randomTask = randomTasks[Math.floor(Math.random() * randomTasks.length)];
              onTaskComplete(randomTask.id, format(selectedDay, 'yyyy-MM-dd'), 0);
            }
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
        >
          Complete Random Task
        </button>
        
        <button
          onClick={() => onAddTask(selectedDay)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
        >
          Schedule New Task
        </button>
      </div>
    </div>
  );
};

export default TimelineView;
