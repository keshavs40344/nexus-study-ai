// src/pages/SchedulePage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../contexts/ExamStoreContext';
import { toast } from 'react-hot-toast';
import {
  Calendar, List, Grid, Filter, Download, Upload, RotateCw, 
  Plus, Search, ChevronLeft, ChevronRight, Settings, Share2,
  CalendarDays, Clock, Target, BookOpen, CheckCircle, AlertCircle,
  MoreVertical, Edit2, Trash2, Move, Zap, BrainCircuit, RefreshCw,
  BarChart3, Timeline, GanttChart, Table, CalendarClock, CalendarRange,
  ArrowUpDown, FilterX, Save, Eye, EyeOff, Lock, Unlock, Maximize2,
  Minimize2, ZoomIn, ZoomOut, DownloadCloud, Printer, Share
} from 'lucide-react';

// Components
import ScheduleCalendarView from '../components/Schedule/CalendarView';
import ScheduleListView from '../components/Schedule/ListView';
import ScheduleGanttView from '../components/Schedule/GanttView';
import ScheduleTimelineView from '../components/Schedule/TimelineView';
import ScheduleFilters from '../components/Schedule/Filters';
import ScheduleStats from '../components/Schedule/Stats';
import ScheduleExport from '../components/Schedule/Export';
import ScheduleAIEditor from '../components/Schedule/AIEditor';
import TaskEditor from '../components/Schedule/TaskEditor';

// Services
import { scheduleService } from '../services/scheduleService';
import { aiSchedulerService } from '../services/aiSchedulerService';

const SchedulePage = () => {
  const navigate = useNavigate();
  const { userConfig, currentSchedule, updateSchedule, markTaskComplete } = useExamStore();
  
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list', 'gantt', 'timeline'
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'all'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filters, setFilters] = useState({
    subjects: [],
    types: [],
    priorities: [],
    status: ['pending', 'completed'],
    searchQuery: ''
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [scheduleView, setScheduleView] = useState('full'); // 'full', 'compact', 'minimal'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate schedule statistics
  const scheduleStats = useMemo(() => {
    if (!currentSchedule?.data) return null;
    
    const tasks = currentSchedule.data.flatMap(day => day.tasks || []);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    const subjects = [...new Set(tasks.map(t => t.subject))];
    const phases = [...new Set(currentSchedule.data.map(d => d.phase))];
    
    const totalHours = tasks.reduce((sum, task) => sum + (task.duration || 0), 0);
    const completedHours = tasks
      .filter(t => t.completed)
      .reduce((sum, task) => sum + (task.duration || 0), 0);
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      totalHours,
      completedHours,
      pendingHours: totalHours - completedHours,
      subjectsCount: subjects.length,
      phasesCount: phases.length,
      daysCount: currentSchedule.data.length,
      upcomingDeadlines: currentSchedule.data
        .filter(day => new Date(day.date) > new Date() && !day.allComplete)
        .slice(0, 5)
    };
  }, [currentSchedule]);

  // Filter and sort schedule
  const filteredSchedule = useMemo(() => {
    if (!currentSchedule?.data) return [];
    
    let filtered = [...currentSchedule.data];
    
    // Apply date range filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateRange) {
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        filtered = filtered.filter(day => 
          new Date(day.date) >= today && new Date(day.date) <= weekEnd
        );
        break;
      case 'month':
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() + 1);
        filtered = filtered.filter(day => 
          new Date(day.date) >= today && new Date(day.date) <= monthEnd
        );
        break;
      case 'quarter':
        const quarterEnd = new Date(today);
        quarterEnd.setMonth(today.getMonth() + 3);
        filtered = filtered.filter(day => 
          new Date(day.date) >= today && new Date(day.date) <= quarterEnd
        );
        break;
      // 'all' shows everything
    }
    
    // Apply other filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.map(day => ({
        ...day,
        tasks: (day.tasks || []).filter(task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query)
        )
      })).filter(day => day.tasks.length > 0);
    }
    
    if (filters.subjects.length > 0) {
      filtered = filtered.map(day => ({
        ...day,
        tasks: (day.tasks || []).filter(task =>
          filters.subjects.includes(task.subject)
        )
      })).filter(day => day.tasks.length > 0);
    }
    
    if (filters.types.length > 0) {
      filtered = filtered.map(day => ({
        ...day,
        tasks: (day.tasks || []).filter(task =>
          filters.types.includes(task.type)
        )
      })).filter(day => day.tasks.length > 0);
    }
    
    if (filters.priorities.length > 0) {
      filtered = filtered.map(day => ({
        ...day,
        tasks: (day.tasks || []).filter(task =>
          filters.priorities.includes(task.priority)
        )
      })).filter(day => day.tasks.length > 0);
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.map(day => ({
        ...day,
        tasks: (day.tasks || []).filter(task => {
          if (filters.status.includes('completed') && task.completed) return true;
          if (filters.status.includes('pending') && !task.completed) return true;
          return false;
        })
      })).filter(day => day.tasks.length > 0);
    }
    
    return filtered;
  }, [currentSchedule, dateRange, filters]);

  // Handle task completion
  const handleTaskComplete = useCallback(async (taskId, dayIndex, taskIndex) => {
    try {
      markTaskComplete(taskId, {
        notes: 'Completed via schedule',
        timeTaken: 60
      });
      
      toast.success('Task marked as complete!');
    } catch (error) {
      toast.error('Failed to complete task');
    }
  }, [markTaskComplete]);

  // Handle task drag and drop
  const handleTaskDragStart = useCallback((task, sourceDay) => {
    setIsDragging(true);
    // Implementation for drag start
  }, []);

  const handleTaskDrop = useCallback((targetDay, targetIndex) => {
    setIsDragging(false);
    // Implementation for drop
    toast.info('Task moved successfully');
  }, []);

  // Handle AI rescheduling
  const handleAIReschedule = useCallback(async () => {
    try {
      toast.loading('AI is optimizing your schedule...');
      
      // Get current schedule data
      const scheduleData = currentSchedule.data;
      
      // Call AI service to reschedule
      const optimizedSchedule = await aiSchedulerService.optimizeSchedule(
        scheduleData,
        userConfig
      );
      
      // Update schedule
      updateSchedule(optimizedSchedule);
      
      toast.dismiss();
      toast.success('Schedule optimized by AI!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to optimize schedule');
      console.error(error);
    }
  }, [currentSchedule, userConfig, updateSchedule]);

  // Handle task edit
  const handleEditTask = useCallback((task, dayIndex, taskIndex) => {
    setEditingTask({
      ...task,
      dayIndex,
      taskIndex,
      date: currentSchedule.data[dayIndex].date
    });
    setShowTaskEditor(true);
  }, [currentSchedule]);

  // Handle task delete
  const handleDeleteTask = useCallback(async (taskId, dayIndex, taskIndex) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // Remove task from schedule
        const updatedSchedule = [...currentSchedule.data];
        updatedSchedule[dayIndex].tasks.splice(taskIndex, 1);
        
        // If day has no tasks, remove it
        if (updatedSchedule[dayIndex].tasks.length === 0) {
          updatedSchedule.splice(dayIndex, 1);
        }
        
        updateSchedule(updatedSchedule);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  }, [currentSchedule, updateSchedule]);

  // Handle add new task
  const handleAddTask = useCallback((date) => {
    setSelectedDate(new Date(date));
    setEditingTask(null);
    setShowTaskEditor(true);
  }, []);

  // Handle export schedule
  const handleExport = useCallback((format) => {
    const exported = scheduleService.exportSchedule(currentSchedule.id, format);
    
    if (exported) {
      // Create download link
      const blob = new Blob([exported], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Schedule exported as ${format.toUpperCase()}`);
    }
  }, [currentSchedule]);

  // Navigation handlers
  const navigateToPrevious = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (dateRange) {
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'quarter':
        newDate.setMonth(newDate.getMonth() - 3);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, dateRange]);

  const navigateToNext = useCallback(() => {
    const newDate = new Date(currentDate);
    switch (dateRange) {
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'quarter':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
    }
    setCurrentDate(newDate);
  }, [currentDate, dateRange]);

  // View mode components
  const viewComponents = {
    calendar: (
      <ScheduleCalendarView
        schedule={filteredSchedule}
        currentDate={currentDate}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onAddTask={handleAddTask}
        onTaskDrag={handleTaskDragStart}
        onTaskDrop={handleTaskDrop}
        viewMode={scheduleView}
      />
    ),
    list: (
      <ScheduleListView
        schedule={filteredSchedule}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onAddTask={handleAddTask}
        onTaskDrag={handleTaskDragStart}
        onTaskDrop={handleTaskDrop}
        viewMode={scheduleView}
      />
    ),
    gantt: (
      <ScheduleGanttView
        schedule={filteredSchedule}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onAddTask={handleAddTask}
        viewMode={scheduleView}
      />
    ),
    timeline: (
      <ScheduleTimelineView
        schedule={filteredSchedule}
        currentDate={currentDate}
        onTaskComplete={handleTaskComplete}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onAddTask={handleAddTask}
        viewMode={scheduleView}
      />
    )
  };

  if (!userConfig || !currentSchedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Schedule Found</h3>
          <p className="text-gray-400 mb-8">You need to set up your study plan first</p>
          <button
            onClick={() => navigate('/setup')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Create Study Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Study Schedule</h1>
                <p className="text-sm text-gray-400">
                  {userConfig.examName} • {scheduleStats?.daysCount} days
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Controls */}
              <div className="hidden md:flex items-center gap-2 bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('gantt')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'gantt' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <GanttChart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Timeline className="w-5 h-5" />
                </button>
              </div>
              
              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isFullscreen ? 
                  <Minimize2 className="w-5 h-5 text-gray-400" /> : 
                  <Maximize2 className="w-5 h-5 text-gray-400" />
                }
              </button>
              
              {/* Export Button */}
              <ScheduleExport onExport={handleExport} />
              
              {/* AI Optimization */}
              <button
                onClick={handleAIReschedule}
                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <BrainCircuit className="w-5 h-5" />
                <span className="hidden md:inline">AI Optimize</span>
              </button>
            </div>
          </div>
          
          {/* Secondary Navigation */}
          <div className="flex items-center justify-between py-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => setDateRange('week')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${dateRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setDateRange('month')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${dateRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setDateRange('quarter')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${dateRange === 'quarter' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Quarter
                </button>
                <button
                  onClick={() => setDateRange('all')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${dateRange === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  All
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={navigateToPrevious}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-sm text-white">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric',
                    ...(dateRange === 'week' && { day: 'numeric' })
                  })}
                </div>
                <button
                  onClick={navigateToNext}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAIEditor(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden md:inline">Reschedule</span>
              </button>
              
              <button
                onClick={() => handleAddTask(new Date())}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <ScheduleStats stats={scheduleStats} />
            
            {/* Filters */}
            <ScheduleFilters 
              filters={filters}
              onFilterChange={setFilters}
              schedule={currentSchedule?.data || []}
            />
            
            {/* View Settings */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="font-bold text-white mb-4">View Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">View Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'full', label: 'Full', icon: <Eye className="w-4 h-4" /> },
                      { id: 'compact', label: 'Compact', icon: <Eye className="w-4 h-4" /> },
                      { id: 'minimal', label: 'Minimal', icon: <EyeOff className="w-4 h-4" /> }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setScheduleView(mode.id)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                          scheduleView === mode.id
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-800 bg-gray-800/50 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {mode.icon}
                          <span className="text-xs">{mode.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Zoom Level</label>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg">
                      <ZoomOut className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full">
                      <div className="w-2/3 h-full bg-blue-500 rounded-full"></div>
                    </div>
                    <button className="p-2 hover:bg-gray-800 rounded-lg">
                      <ZoomIn className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Show Completed</span>
                  <button className="w-10 h-6 rounded-full bg-blue-500">
                    <div className="w-4 h-4 bg-white rounded-full transform translate-x-5"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Schedule Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
              {/* View Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {viewMode === 'calendar' && 'Calendar View'}
                      {viewMode === 'list' && 'List View'}
                      {viewMode === 'gantt' && 'Gantt Chart'}
                      {viewMode === 'timeline' && 'Timeline'}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {filteredSchedule.length} days • {filteredSchedule.flatMap(d => d.tasks).length} tasks
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Printer className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Share className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Schedule View */}
              <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                {viewComponents[viewMode]}
              </div>
              
              {/* View Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900/30">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>High Priority</span>
                    </div>
                  </div>
                  
                  <div>
                    Showing {filteredSchedule.length} of {currentSchedule.data?.length} days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Editor Modal */}
      {showAIEditor && (
        <ScheduleAIEditor
          schedule={currentSchedule.data}
          config={userConfig}
          onClose={() => setShowAIEditor(false)}
          onApply={(optimizedSchedule) => {
            updateSchedule(optimizedSchedule);
            setShowAIEditor(false);
          }}
        />
      )}

      {/* Task Editor Modal */}
      {showTaskEditor && (
        <TaskEditor
          task={editingTask}
          date={selectedDate}
          schedule={currentSchedule.data}
          onClose={() => {
            setShowTaskEditor(false);
            setEditingTask(null);
          }}
          onSave={(updatedTask) => {
            // Save task logic
            setShowTaskEditor(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">Move Task</h3>
            <p className="text-gray-400 mb-6">Drop the task on a date to reschedule it</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsDragging(false)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
