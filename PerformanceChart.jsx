// src/components/Dashboard/PerformanceChart.jsx
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const PerformanceChart = ({ data, detailed = false }) => {
  // Sample data for charts
  const lineData = [
    { day: 'Mon', score: 65, accuracy: 70 },
    { day: 'Tue', score: 72, accuracy: 75 },
    { day: 'Wed', score: 68, accuracy: 72 },
    { day: 'Thu', score: 75, accuracy: 78 },
    { day: 'Fri', score: 80, accuracy: 82 },
    { day: 'Sat', score: 78, accuracy: 80 },
    { day: 'Sun', score: 82, accuracy: 85 }
  ];

  const subjectData = [
    { subject: 'Mathematics', score: 85, weight: 30 },
    { subject: 'Physics', score: 72, weight: 25 },
    { subject: 'Chemistry', score: 78, weight: 25 },
    { subject: 'Biology', score: 90, weight: 20 }
  ];

  const radarData = [
    { skill: 'Speed', value: 75, fullMark: 100 },
    { skill: 'Accuracy', value: 82, fullMark: 100 },
    { skill: 'Retention', value: 68, fullMark: 100 },
    { skill: 'Consistency', value: 88, fullMark: 100 },
    { skill: 'Problem Solving', value: 72, fullMark: 100 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (detailed) {
    return (
      <div className="space-y-8">
        {/* Line Chart */}
        <div>
          <h4 className="font-medium text-white mb-4">Weekly Performance Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#4B5563',
                    color: '#FFFFFF'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                  name="Score (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subject Performance */}
          <div>
            <h4 className="font-medium text-white mb-4">Subject Performance</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="subject" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#4B5563',
                      color: '#FFFFFF'
                    }}
                  />
                  <Bar dataKey="score" fill="#8B5CF6" name="Score (%)" />
                  <Bar dataKey="weight" fill="#3B82F6" name="Weightage (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar */}
          <div>
            <h4 className="font-medium text-white mb-4">Skill Analysis</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#4B5563',
                      color: '#FFFFFF'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={lineData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              borderColor: '#4B5563',
              color: '#FFFFFF'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#3B82F6" 
            fillOpacity={1}
            fill="url(#colorScore)"
            name="Score (%)"
          />
          <Area 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#10B981" 
            fillOpacity={1}
            fill="url(#colorAccuracy)"
            name="Accuracy (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
