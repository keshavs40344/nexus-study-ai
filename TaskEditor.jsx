// src/components/Schedule/TaskEditor.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, BookOpen, Target, AlertCircle, Hash, Users } from 'lucide-react';
import { format } from 'date-fns';

const TaskEditor = ({ task, date, schedule, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    type: 'study',
    priority: 'medium',
    duration: 60,
    description: '',
    resources: [],
    estimatedPoints: 100,
    allowReschedule: true
  });

  const [newResource, setNewResource] = useState('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        subject: task.subject || '',
        type: task.type || 'study',
        priority: task.priority || 'medium',
        duration: task.duration || 60,
        description: task.description || '',
        resources: task.resources || [],
        estimatedPoints: task.estimatedPoints || 100,
        allowReschedule: task.allowReschedule !== false
      });
    } else {
      // Get unique subjects from schedule for suggestions
      const subjects = [...new Set(schedule.flatMap(day => 
        (day.tasks || []).map(t => t.subject)
      ).filter(Boolean))];
      
      if (subjects.length > 0) {
        setFormData(prev => ({
          ...prev,
          subject: subjects[0]
        }));
      }
    }
  }, [task, schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      id: task?.id || `task_${Date.now()}`,
      date: date,
      createdAt: new Date().toISOString(),
      completed: task?.completed || false
    };
    
    onSave(taskData);
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (index) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const taskTypes = [
    { id: 'study', label: 'Study', icon: <BookOpen className="w-4 h-4" />, color: 'blue' },
    { id: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" />, color: 'green' },
    { id: 'test', label: 'Test', icon: <AlertCircle className="w-4 h-4" />, color: 'red' },
    { id: 'revision', label: 'Revision', icon: <Clock className="w-4 h-4" />, color: 'purple' },
    { id: 'group', label: 'Group Study', icon: <Users className="w-4 h-4" />, color: 'yellow' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
    { id: 'high', label: 'High', color: 'bg-red-500/20 text-red-400' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-gray-400">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-white font-medium mb-3">Task Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What do you need to study?"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <label className="block text-white font-medium mb-3">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Duration: {formData.duration} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="240"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>15m</span>
                  <span>1h</span>
                  <span>2h</span>
                  <span>4h</span>
                </div>
              </div>
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-white font-medium mb-3">Task Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {taskTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.type === type.id
                        ? `border-${type.color}-500 bg-${type.color}-500/10`
                        : 'border-gray-800 bg-gray-800/50 hover:border-gray-700'
                    }`}
                  >
                    <div className={`mb-2 ${formData.type === type.id ? `text-${type.color}-400` : 'text-gray-400'}`}>
                      {type.icon}
                    </div>
                    <div className={`text-sm ${formData.type === type.id ? 'text-white' : 'text-gray-400'}`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-white font-medium mb-3">Priority</label>
              <div className="flex gap-3">
                {priorities.map((priority) => (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.id })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      formData.priority === priority.id
                        ? priority.color
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-3">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details, topics to cover, or specific goals..."
                rows="3"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Resources */}
            <div>
              <label className="block text-white font-medium mb-3">Resources</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  placeholder="Add resource (book, video, website...)"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                />
                <button
                  type="button"
                  onClick={addResource}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.resources.length > 0 && (
                <div className="space-y-2">
                  {formData.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <span className="text-gray-300">{resource}</span>
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="bg-gray-800/30 rounded-xl p-4">
              <h4 className="font-bold text-white mb-3">Advanced Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">XP Points</div>
                    <div className="text-sm text-gray-400">Reward for completing</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="10"
                      max="500"
                      step="10"
                      value={formData.estimatedPoints}
                      onChange={(e) => setFormData({ ...formData, estimatedPoints: parseInt(e.target.value) })}
                      className="w-24 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-center"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">Allow Rescheduling</div>
                    <div className="text-sm text-gray-400">AI can move this task if needed</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, allowReschedule: !formData.allowReschedule })}
                    className={`w-12 h-6 rounded-full transition-colors ${formData.allowReschedule ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${formData.allowReschedule ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditor;
