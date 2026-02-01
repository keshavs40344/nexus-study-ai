// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../contexts/ExamStoreContext';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  Calendar, Clock, Target, TrendingUp, Award, Zap, BrainCircuit,
  BarChart2, BookOpen, Play, Bell, ChevronRight, CheckCircle,
  AlertTriangle, Star, Activity, Users, Target as TargetIcon,
  Clock as ClockIcon, Bookmark, Download, Share2, Settings,
  RotateCw, Coffee, Moon, Sun, BellRing, TrendingDown, PieChart,
  LineChart, CalendarDays, Timer, Flame, Rocket, Crown
} from 'lucide-react';

// Components
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import TaskCard from '../components/Dashboard/TaskCard';
import ResourceCard from '../components/Dashboard/ResourceCard';
import ProgressRing from '../components/Dashboard/ProgressRing';
import StatCard from '../components/Dashboard/StatCard';
import LiveUpdates from '../components/Dashboard/LiveUpdates';
import QuickActions from '../components/Dashboard/QuickActions';
import StudyStreak from '../components/Dashboard/StudyStreak';
import TimeAllocation from '../components/Dashboard/TimeAllocation';
import UpcomingSchedule from '../components/Dashboard/UpcomingSchedule';

// Services
import { aiSchedulerService } from '../services/aiSchedulerService';
import { examDataService } from '../services/examDataService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    userConfig, 
    currentSchedule, 
    performanceStats, 
    studyStreak, 
    getTodayTasks, 
    markTaskComplete,
    getExamDetails
  } = useExamStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [liveData, setLiveData] = useState([]);

  // Fetch exam details
  const { data: examDetails } = useQuery(
    ['examDetails', userConfig?.examId],
    () => getExamDetails(userConfig?.examId),
    { enabled: !!userConfig?.examId }
  );

  // Calculate progress
  const progress = useMemo(() => {
    if (!currentSchedule?.data) return 0;
    const totalTasks = currentSchedule.data.flatMap(day => day.tasks || []).length;
    const completed = currentSchedule.data.flatMap(day => 
      (day.tasks || []).filter(t => t.completed)
    ).length;
    return totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
  }, [currentSchedule]);

  // Calculate time stats
  const timeStats = useMemo(() => {
    if (!userConfig || !currentSchedule) return null;
    
    const today = new Date();
    const examDate = new Date(userConfig.examDate);
    const daysRemaining = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const daysPassed = userConfig.totalDays - daysRemaining;
    const completionRate = (daysPassed / userConfig.totalDays) * 100;
    
    return {
      daysRemaining,
      daysPassed,
      completionRate,
      hoursStudied: Math.floor(daysPassed * userConfig.hoursPerDay * 0.7), // Estimate
      hoursRemaining: Math.floor(daysRemaining * userConfig.hoursPerDay)
    };
  }, [userConfig, currentSchedule]);

  // Load today's tasks
  useEffect(() => {
    if (currentSchedule) {
      const tasks = getTodayTasks();
      setTodaysTasks(tasks);
      setCompletedTasks(tasks.filter(t => t.completed).length);
    }
  }, [currentSchedule, getTodayTasks]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (examDetails?.liveFeed) {
        const randomUpdate = examDetails.liveFeed[
          Math.floor(Math.random() * examDetails.liveFeed.length)
        ];
        setLiveData(prev => [
          {
            id: Date.now(),
            message: randomUpdate,
            type: 'update',
            timestamp: new Date()
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [examDetails]);

  // Handle task completion
  const handleTaskComplete = async (taskId, taskData) => {
    try {
      markTaskComplete(taskId, {
        notes: 'Completed via dashboard',
        timeTaken: taskData.estimatedTime || 60
      });
      
      // Update local state
      setTodaysTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
      setCompletedTasks(prev => prev + 1);
      
      toast.success('Task marked as complete!');
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  // Start focus mode
  const handleStartFocus = () => {
    setFocusMode(true);
    navigate('/focus');
  };

  // Quick navigation
  const handleQuickAction = (action) => {
    switch (action) {
      case 'mock-test':
        navigate('/tests');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'schedule':
        navigate('/schedule');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      default:
        break;
    }
  };

  if (!userConfig || !currentSchedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Study Plan Found</h3>
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

  // Dashboard tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">
                  {userConfig.examName} • {timeStats?.daysRemaining} days remaining
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-gray-400" /> : 
                  <Moon className="w-5 h-5 text-gray-400" />
                }
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  {liveData.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-800">
                      <h3 className="font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {liveData.map(update => (
                        <div key={update.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <BellRing className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{update.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {update.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">U</span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">Student</div>
                  <div className="text-xs text-gray-400">Level {Math.floor(studyStreak.days / 10) + 1}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-500'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Overall Progress"
                value={`${Math.round(progress)}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="blue"
                trend={{ value: '+12%', direction: 'up' }}
                subtitle={`${completedTasks} of ${todaysTasks.length} tasks today`}
              />
              
              <StatCard
                title="Study Streak"
                value={`${studyStreak.days} days`}
                icon={<Flame className="w-5 h-5" />}
                color="orange"
                trend={{ value: '🔥', direction: 'up' }}
                subtitle="Keep it up!"
              />
              
              <StatCard
                title="Days Remaining"
                value={timeStats?.daysRemaining || 0}
                icon={<CalendarDays className="w-5 h-5" />}
                color="green"
                trend={{ value: '-1 day', direction: 'down' }}
                subtitle="Exam approaching"
              />
              
              <StatCard
                title="Predicted Score"
                value={`${performanceStats?.predictedScore || 75}%`}
                icon={<Target className="w-5 h-5" />}
                color="purple"
                trend={{ value: '+4%', direction: 'up' }}
                subtitle="Based on current pace"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Today's Focus */}
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Today's Focus</h2>
                      <p className="text-gray-400">Complete your tasks to maintain streak</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {todaysTasks.length > 0 ? (
                    <div className="space-y-4">
                      {todaysTasks.map((task, index) => (
                        <TaskCard
                          key={task.id || index}
                          task={task}
                          onComplete={() => handleTaskComplete(task.id, task)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🎯</div>
                      <h3 className="text-lg font-bold text-white mb-2">No tasks for today</h3>
                      <p className="text-gray-400">Take a break or explore resources</p>
                    </div>
                  )}

                  {todaysTasks.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Progress: {completedTasks} of {todaysTasks.length} completed
                        </div>
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${(completedTasks / todaysTasks.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Analytics */}
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
                      <p className="text-gray-400">Your progress over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm text-gray-300">
                        Weekly
                      </button>
                      <button className="px-3 py-1 bg-blue-600 rounded-lg text-sm text-white">
                        Monthly
                      </button>
                    </div>
                  </div>
                  <PerformanceChart data={performanceStats} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Study Streak */}
                <StudyStreak streak={studyStreak.days} />

                {/* Quick Actions */}
                <QuickActions onAction={handleQuickAction} />

                {/* Time Allocation */}
                <TimeAllocation subjects={examDetails?.subjects || []} />

                {/* Live Updates */}
                <LiveUpdates updates={liveData.slice(0, 3)} />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upcoming Schedule */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Upcoming Schedule</h2>
                  <button 
                    onClick={() => navigate('/schedule')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    View All
                  </button>
                </div>
                <UpcomingSchedule schedule={currentSchedule.data?.slice(0, 3) || []} />
              </div>

              {/* Recommended Resources */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recommended Resources</h2>
                  <button 
                    onClick={() => navigate('/resources')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    See All
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Latest Syllabus Update', type: 'pdf', size: '2.4 MB' },
                    { title: 'Previous Year Papers', type: 'zip', size: '15 MB' },
                    { title: 'Video Lectures', type: 'video', duration: '2h 30m' }
                  ].map((resource, index) => (
                    <ResourceCard key={index} resource={resource} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">All Tasks</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSchedule.data?.slice(0, 9).map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-bold text-white">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        day.phase === 'Concept Building' ? 'bg-blue-500/20 text-blue-400' :
                        day.phase === 'Practice & Application' ? 'bg-purple-500/20 text-purple-400' :
                        day.phase === 'Revision' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {day.phase}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {day.tasks?.slice(0, 2).map((task, taskIndex) => (
                        <div key={taskIndex} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleTaskComplete(`${dayIndex}-${taskIndex}`, task)}
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
                              <div className="text-sm text-gray-400 mt-1">{task.description}</div>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{task.duration || 60} min</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {day.tasks?.length > 2 && (
                      <button className="w-full mt-3 text-center text-sm text-blue-400 hover:text-blue-300">
                        +{day.tasks.length - 2} more tasks
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Detailed Analytics</h2>
                  <div className="h-96">
                    <PerformanceChart data={performanceStats} detailed />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="font-bold text-white mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Accuracy', value: '78%', change: '+4%', color: 'green' },
                      { label: 'Speed', value: '65%', change: '+12%', color: 'blue' },
                      { label: 'Consistency', value: '82%', change: '+3%', color: 'purple' },
                      { label: 'Retention', value: '75%', change: '+8%', color: 'orange' }
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-400">{metric.label}</div>
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                        </div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          metric.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          metric.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {metric.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="font-bold text-white mb-4">AI Recommendations</h3>
                  <div className="space-y-3">
                    {[
                      'Increase focus on weak topics',
                      'Take more mock tests on weekends',
                      'Review notes before sleep',
                      'Join study group discussions'
                    ].map((rec, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-blue-500/20 rounded">
                          <BrainCircuit className="w-4 h-4 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Study Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Complete Study Material',
                    type: 'pdf',
                    size: '45 MB',
                    description: 'All chapters with examples',
                    rating: 4.8
                  },
                  {
                    title: 'Video Lecture Series',
                    type: 'video',
                    duration: '15h 30m',
                    description: 'Recorded classroom sessions',
                    rating: 4.9
                  },
                  {
                    title: 'Practice Question Bank',
                    type: 'questions',
                    count: '1000+',
                    description: 'Topic-wise practice questions',
                    rating: 4.7
                  },
                  {
                    title: 'Mock Test Series',
                    type: 'test',
                    count: '20 tests',
                    description: 'Full-length practice tests',
                    rating: 4.8
                  },
                  {
                    title: 'Revision Notes',
                    type: 'notes',
                    pages: '120',
                    description: 'Concise notes for quick revision',
                    rating: 4.6
                  },
                  {
                    title: 'Formula Sheet',
                    type: 'cheatsheet',
                    size: '5 MB',
                    description: 'All important formulas',
                    rating: 4.9
                  }
                ].map((resource, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        {resource.type === 'pdf' && <BookOpen className="w-5 h-5 text-blue-400" />}
                        {resource.type === 'video' && <Play className="w-5 h-5 text-red-400" />}
                        {resource.type === 'questions' && <Target className="w-5 h-5 text-green-400" />}
                        {resource.type === 'test' && <BarChart2 className="w-5 h-5 text-purple-400" />}
                        {resource.type === 'notes' && <Bookmark className="w-5 h-5 text-yellow-400" />}
                        {resource.type === 'cheatsheet' && <Zap className="w-5 h-5 text-orange-400" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {resource.size && `Size: ${resource.size}`}
                        {resource.duration && `Duration: ${resource.duration}`}
                        {resource.count && `Items: ${resource.count}`}
                        {resource.pages && `Pages: ${resource.pages}`}
                      </div>
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Study Community</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-white mb-4">Recent Discussions</h3>
                  <div className="space-y-4">
                    {[
                      { topic: 'How to solve complex integration?', replies: 24, time: '2 hours ago' },
                      { topic: 'Best books for CA Final?', replies: 45, time: '5 hours ago' },
                      { topic: 'Mock test strategies?', replies: 18, time: '1 day ago' },
                      { topic: 'Time management tips', replies: 32, time: '2 days ago' }
                    ].map((discussion, index) => (
                      <div key={index} className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <div className="font-medium text-white mb-2">{discussion.topic}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{discussion.replies} replies</span>
                          <span>•</span>
                          <span>{discussion.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Alex Johnson', score: '98%', streak: '56 days' },
                      { name: 'Priya Sharma', score: '96%', streak: '42 days' },
                      { name: 'Rahul Verma', score: '95%', streak: '38 days' },
                      { name: 'Sneha Patel', score: '94%', streak: '31 days' }
                    ].map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="font-bold text-white">
                              {performer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{performer.name}</div>
                            <div className="text-xs text-gray-400">{performer.streak} streak</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-400">{performer.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Focus Mode Button */}
      {!focusMode && (
        <button
          onClick={handleStartFocus}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all z-40"
        >
          <Zap className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
