// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, ChevronRight, Sparkles, Shield, Zap, Users, 
  BarChart2, Target, Cpu, Globe, Award, BookOpen, Clock,
  TrendingUp, Lock, MessageSquare, Cloud, Database
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Scheduling",
      description: "Intelligent algorithms that create optimal study plans based on exam patterns and your learning style"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Real-Time Updates",
      description: "Live exam notifications, syllabus changes, and important dates from official sources"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Performance Analytics",
      description: "Detailed insights into your progress with predictive score analysis"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Adaptive Learning",
      description: "Schedule automatically adjusts based on your performance and pace"
    },
    {
      icon: <Database className="w-8 h-8 text-amber-500" />,
      title: "Resource Library",
      description: "Curated study materials, previous papers, and expert-recommended resources"
    },
    {
      icon: <Zap className="w-8 h-8 text-cyan-500" />,
      title: "Focus Mode",
      description: "Distraction-free study environment with Pomodoro timer and ambient sounds"
    }
  ];

  const exams = [
    { name: "CA Final", category: "Finance", students: "50K+", color: "amber" },
    { name: "NEET UG", category: "Medical", students: "200K+", color: "pink" },
    { name: "JEE Main", category: "Engineering", students: "150K+", color: "cyan" },
    { name: "UPSC CSE", category: "Government", students: "100K+", color: "rose" },
    { name: "SSC CGL", category: "Government", students: "80K+", color: "blue" },
    { name: "GATE", category: "Engineering", students: "60K+", color: "teal" },
    { name: "CLAT", category: "Law", students: "40K+", color: "yellow" },
    { name: "IBPS PO", category: "Banking", students: "70K+", color: "indigo" }
  ];

  const handleGetStarted = () => {
    navigate('/setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Nexus AI
                </span>
                <div className="text-xs text-gray-500">Intelligent Study Platform</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#exams" className="text-gray-300 hover:text-white transition-colors">Exams</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Success Stories</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-300">AI-Powered Exam Preparation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block text-white mb-2">Master Your Exam</span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                With AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              Nexus AI creates personalized study schedules for 50+ exams using advanced algorithms. 
              Get real-time updates, performance analytics, and adaptive learning paths.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your exam (CA, NEET, UPSC, JEE, GATE...)"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Free Study Plan
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-2xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">Exams Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">AI Assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Nexus AI?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced features that make exam preparation efficient, effective, and enjoyable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors group">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section id="exams" className="py-24 bg-gradient-to-b from-gray-900/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Supported Exams</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive coverage across all major competitive exams in India
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {exams.map((exam, index) => (
              <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-bold text-white text-lg">{exam.name}</div>
                    <div className="text-sm text-gray-500">{exam.category}</div>
                  </div>
                  <div className={`px-3 py-1 bg-${exam.color}-500/20 text-${exam.color}-400 rounded-full text-sm`}>
                    {exam.students}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>AI Schedule</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
            >
              View All 50+ Exams
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Study Journey?
              </h2>
              
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join thousands of successful students who have aced their exams with Nexus AI
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
                </button>
                
                <button className="px-8 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-2xl font-medium hover:bg-gray-800 transition-colors">
                  Watch Tutorial
                </button>
              </div>
              
              <div className="mt-10 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Works on all devices
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Join 100K+ students
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Nexus AI</span>
                <div className="text-sm text-gray-500">Intelligent Study Platform</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2024 Nexus AI. All rights reserved. Made with ❤️ for students worldwide.</p>
            <p className="mt-2">This is an open-source project. Contribute on GitHub!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
