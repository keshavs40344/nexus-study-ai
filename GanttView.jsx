// src/components/Schedule/GanttView.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, parseISO, differenceInDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, 
  Filter, Calendar, Clock, Target, BookOpen, CheckCircle,
  MoreVertical, Edit2, Trash2, Move
} from 'lucide-react';

const GanttView = ({ 
  schedule, 
  onTaskComplete, 
  onTaskEdit, 
  onTaskDelete, 
  onAddTask,
  viewMode 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const ganttRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate timeline bounds
  const timelineData = useMemo(() => {
    if (!schedule || schedule.length === 0) return null;
    
    const dates = schedule.map(day => parseISO(day.date));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    
    // Add some padding
    startDate.setDate(startDate.getDate() - 2);
    endDate.setDate(endDate.getDate() + 2);
    
    const totalDays = differenceInDays(endDate, startDate) + 1;
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group tasks by subject for better visualization
    const subjects = {};
    schedule.forEach(day => {
      (day.tasks || []).forEach(task => {
        if (!subjects[task.subject]) {
          subjects[task.subject] = [];
        }
        subjects[task.subject].push({
          ...task,
          date: day.date,
          dateObj: parseISO(day.date)
        });
      });
    });
    
    return {
      startDate,
      endDate,
      totalDays,
      days,
      subjects,
      schedule
    };
  }, [schedule]);

  const getTaskColor = (type, completed) => {
    if (completed) return '#374151'; // Gray for completed
    
    const colors = {
      study: '#3B82F6',
      practice: '#10B981',
      test: '#EF4444',
      revision: '#8B5CF6'
    };
    
    return colors[type?.toLowerCase()] || '#6B7280';
  };

  const getTaskPosition = (taskDate, startDate, totalDays, cellWidth) => {
    const daysFromStart = differenceInDays(parseISO(taskDate), startDate);
    return daysFromStart * cellWidth;
  };

  const handleScroll = (direction) => {
    if (!containerRef.current) return;
    
    const scrollAmount = 200;
    const newScroll = direction === 'left' 
      ? scrollPosition - scrollAmount
      : scrollPosition + scrollAmount;
    
    setScrollPosition(Math.max(0, newScroll));
    containerRef.current.scrollLeft = newScroll;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(3, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.25));
  };

  if (!timelineData) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-lg font-bold text-white mb-2">No schedule data</h3>
        <p className="text-gray-400">Create a schedule to see the Gantt chart</p>
      </div>
    );
  }

  const { startDate, endDate, totalDays, days, subjects } = timelineData;
  const cellWidth = 100 * zoomLevel;

  return (
    <div className="space-y-6">
      {/* Gantt Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <ZoomOut className="w-4 h-4 text-gray-400" />
            </button>
            <div className="text-sm text-gray-400">{Math.round(zoomLevel * 100)}%</div>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <ZoomIn className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </div>
      </div>

      {/* Gantt Container */}
      <div 
        ref={containerRef}
        className="relative overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/30"
        style={{ height: '600px' }}
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        <div 
          ref={ganttRef}
          style={{ 
            width: `${totalDays * cellWidth}px`,
            minWidth: '100%'
          }}
        >
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
            <div className="flex">
              <div className="w-64 flex-shrink-0 p-4 border-r border-gray-800">
                <h3 className="font-bold text-white">Subject / Task</h3>
              </div>
              
              <div className="flex flex-1">
                {days.map((day, index) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 p-4 border-r border-gray-800 ${isWeekend ? 'bg-gray-800/30' : ''} ${isToday ? 'bg-blue-500/10' : ''}`}
                      style={{ width: `${cellWidth}px` }}
                    >
                      <div className="text-center">
                        <div className={`font-medium ${isToday ? 'text-blue-400' : 'text-white'}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(day, 'EEE')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="divide-y divide-gray-800">
            {Object.entries(subjects).map(([subject, tasks], subjectIndex) => (
              <div key={subject} className="group">
                {/* Subject Row */}
                <div className="flex hover:bg-gray-800/30 transition-colors">
                  <div className="w-64 flex-shrink-0 p-4 border-r border-gray-800 bg-gray-800/20">
                    <div className="font-bold text-white">{subject}</div>
                    <div className="text-sm text-gray-400">
                      {tasks.length} tasks
                    </div>
                  </div>
                  
                  <div className="flex flex-1 relative">
                    {tasks.map((task, taskIndex) => {
                      const left = getTaskPosition(task.date, startDate, totalDays, cellWidth);
                      const width = cellWidth * (task.duration ? Math.max(1, task.duration / 60) : 1);
                      const isToday = format(parseISO(task.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                      
                      return (
                        <div
                          key={taskIndex}
                          className="absolute"
                          style={{
                            left: `${left}px`,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: `${width}px`
                          }}
                        >
                          <div
                            onClick={() => setSelectedTask(task)}
                            className={`h-8 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                              task.completed ? 'opacity-50' : ''
                            }`}
                            style={{
                              backgroundColor: getTaskColor(task.type, task.completed),
                              borderColor: task.completed ? '#374151' : '#1F2937',
                              opacity: task.completed ? 0.6 : 1
                            }}
                          >
                            <div className="flex items-center justify-between px-3 h-full">
                              <div className="text-xs text-white truncate">
                                {task.title}
                              </div>
                              {task.completed && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            
                            {/* Task Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <div className="font-medium text-white mb-2">{task.title}</div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>{format(parseISO(task.date), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{task.duration || 60} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="w-3 h-3" />
                                  <span className="capitalize">{task.type}</span>
                                </div>
                                {task.priority && (
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {task.priority} priority
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Today Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{
              left: `${getTaskPosition(format(new Date(), 'yyyy-MM-dd'), startDate, totalDays, cellWidth)}px`
            }}
          >
            <div className="absolute -top-2 -left-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
              Today
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Study</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-400">Practice</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-400">Test</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-gray-400">Revision</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-gray-400">Completed</span>
        </div>
      </div>

      {/* Selected Task Details */}
      {selectedTask && (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Task Details</h3>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Title</span>
                  <span className="text-white">{selectedTask.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Subject</span>
                  <span className="text-white">{selectedTask.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">{selectedTask.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedTask.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    selectedTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Schedule</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">
                    {format(parseISO(selectedTask.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{selectedTask.duration || 60} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    selectedTask.completed
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedTask.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => onTaskComplete(selectedTask.id, selectedTask.date, 0)}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => onTaskEdit(selectedTask, selectedTask.date, 0)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttView;
