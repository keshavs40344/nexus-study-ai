// src/services/scheduleService.js
import { NeuralScheduler } from '../utils/algorithms';

class ScheduleService {
  constructor() {
    this.userSchedules = new Map();
  }

  // Generate schedule
  generateSchedule(userConfig, examSyllabus) {
    const scheduler = new NeuralScheduler(userConfig, examSyllabus, userConfig.totalDays);
    const schedule = scheduler.generateSchedule();
    
    // Store schedule
    const scheduleId = this.generateScheduleId(userConfig);
    this.userSchedules.set(scheduleId, {
      schedule,
      config: userConfig,
      generatedAt: new Date(),
      lastUpdated: new Date()
    });
    
    return { scheduleId, schedule };
  }

  generateScheduleId(config) {
    return `schedule_${config.examId}_${config.userId}_${Date.now()}`;
  }

  // Get schedule
  getSchedule(scheduleId) {
    return this.userSchedules.get(scheduleId);
  }

  // Update schedule
  updateSchedule(scheduleId, updates) {
    const scheduleData = this.userSchedules.get(scheduleId);
    if (!scheduleData) return null;
    
    // Apply updates
    scheduleData.schedule = this.applyUpdates(scheduleData.schedule, updates);
    scheduleData.lastUpdated = new Date();
    
    return scheduleData.schedule;
  }

  applyUpdates(schedule, updates) {
    // Implementation for applying updates to schedule
    return schedule.map(day => {
      const dayUpdate = updates.find(u => u.date === day.date);
      if (dayUpdate) {
        return { ...day, ...dayUpdate };
      }
      return day;
    });
  }

  // Get today's tasks
  getTodayTasks(scheduleId) {
    const scheduleData = this.userSchedules.get(scheduleId);
    if (!scheduleData) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    return scheduleData.schedule
      .filter(day => day.date.toISOString().split('T')[0] === today)
      .flatMap(day => day.tasks || []);
  }

  // Mark task as complete
  markTaskComplete(scheduleId, taskId, completionData = {}) {
    const scheduleData = this.userSchedules.get(scheduleId);
    if (!scheduleData) return false;
    
    let taskUpdated = false;
    
    scheduleData.schedule = scheduleData.schedule.map(day => {
      if (day.tasks) {
        day.tasks = day.tasks.map(task => {
          if (task.id === taskId) {
            taskUpdated = true;
            return {
              ...task,
              completed: true,
              completedAt: new Date(),
              completionNotes: completionData.notes,
              timeTaken: completionData.timeTaken
            };
          }
          return task;
        });
      }
      return day;
    });
    
    return taskUpdated;
  }

  // Get schedule statistics
  getScheduleStats(scheduleId) {
    const scheduleData = this.userSchedules.get(scheduleId);
    if (!scheduleData) return null;
    
    const schedule = scheduleData.schedule;
    const totalTasks = schedule.flatMap(day => day.tasks || []).length;
    const completedTasks = schedule
      .flatMap(day => day.tasks || [])
      .filter(task => task.completed).length;
    
    const today = new Date().toISOString().split('T')[0];
    const upcomingTasks = schedule
      .filter(day => new Date(day.date) >= new Date(today))
      .flatMap(day => day.tasks || [])
      .filter(task => !task.completed);
    
    return {
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      upcomingTasks: upcomingTasks.length,
      daysRemaining: schedule.filter(day => new Date(day.date) >= new Date()).length,
      startDate: schedule[0]?.date,
      endDate: schedule[schedule.length - 1]?.date
    };
  }

  // Export schedule
  exportSchedule(scheduleId, format = 'json') {
    const scheduleData = this.userSchedules.get(scheduleId);
    if (!scheduleData) return null;
    
    switch (format) {
      case 'json':
        return JSON.stringify(scheduleData, null, 2);
      case 'csv':
        return this.convertToCSV(scheduleData.schedule);
      case 'pdf':
        // PDF generation logic
        return null;
      default:
        return JSON.stringify(scheduleData, null, 2);
    }
  }

  convertToCSV(schedule) {
    const headers = ['Date', 'Subject', 'Module', 'Type', 'Duration', 'Priority'];
    const rows = schedule.flatMap(day => 
      (day.tasks || []).map(task => [
        day.date.toISOString().split('T')[0],
        task.subject,
        task.module,
        task.type,
        task.duration,
        task.priority
      ])
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }
}

export const scheduleService = new ScheduleService();
