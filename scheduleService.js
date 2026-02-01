// src/services/scheduleService.js
import { format, parseISO, addDays, differenceInDays, isSameDay } from 'date-fns';

class ScheduleService {
  constructor() {
    this.storageKey = 'nexus_schedule_data';
  }

  // Generate empty schedule template
  generateEmptySchedule(startDate, endDate, config) {
    const schedule = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      schedule.push({
        date: currentDate.toISOString(),
        dateStr: format(currentDate, 'yyyy-MM-dd'),
        tasks: [],
        allComplete: false,
        phase: this.getPhaseForDate(currentDate, startDate, endDate)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return schedule;
  }

  getPhaseForDate(date, startDate, endDate) {
    const totalDays = differenceInDays(endDate, startDate);
    const dayNumber = differenceInDays(date, startDate);
    const percentage = (dayNumber / totalDays) * 100;
    
    if (percentage < 60) return 'Concept Building';
    if (percentage < 85) return 'Practice & Application';
    return 'Revision & Mock Tests';
  }

  // Add task to schedule
  addTask(schedule, task) {
    const taskDate = new Date(task.date);
    const dateStr = format(taskDate, 'yyyy-MM-dd');
    
    const dayIndex = schedule.findIndex(day => 
      format(parseISO(day.date), 'yyyy-MM-dd') === dateStr
    );
    
    if (dayIndex === -1) {
      // Create new day if it doesn't exist
      schedule.push({
        date: taskDate.toISOString(),
        dateStr: dateStr,
        tasks: [task],
        allComplete: false,
        phase: this.getPhaseForDate(taskDate, 
          parseISO(schedule[0].date), 
          parseISO(schedule[schedule.length - 1].date)
        )
      });
    } else {
      // Add task to existing day
      schedule[dayIndex].tasks.push(task);
    }
    
    return [...schedule];
  }

  // Update task in schedule
  updateTask(schedule, taskId, updates) {
    const updatedSchedule = schedule.map(day => ({
      ...day,
      tasks: day.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
    
    return updatedSchedule;
  }

  // Delete task from schedule
  deleteTask(schedule, taskId) {
    const updatedSchedule = schedule
      .map(day => ({
        ...day,
        tasks: day.tasks.filter(task => task.id !== taskId)
      }))
      .filter(day => day.tasks.length > 0); // Remove empty days
    
    return updatedSchedule;
  }

  // Move task to different date
  moveTask(schedule, taskId, newDate) {
    const taskToMove = this.findTask(schedule, taskId);
    if (!taskToMove) return schedule;
    
    // Remove from original date
    let updatedSchedule = schedule.map(day => ({
      ...day,
      tasks: day.tasks.filter(task => task.id !== taskId)
    })).filter(day => day.tasks.length > 0);
    
    // Add to new date
    taskToMove.date = newDate.toISOString();
    updatedSchedule = this.addTask(updatedSchedule, taskToMove);
    
    return updatedSchedule;
  }

  findTask(schedule, taskId) {
    for (const day of schedule) {
      const task = day.tasks.find(t => t.id === taskId);
      if (task) {
        return { ...task, originalDate: day.date };
      }
    }
    return null;
  }

  // Complete task
  completeTask(schedule, taskId, completionData = {}) {
    return this.updateTask(schedule, taskId, {
      completed: true,
      completedAt: new Date().toISOString(),
      completionNotes: completionData.notes,
      timeTaken: completionData.timeTaken,
      actualDuration: completionData.actualDuration
    });
  }

  // Get tasks for specific date
  getTasksForDate(schedule, date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const day = schedule.find(day => 
      format(parseISO(day.date), 'yyyy-MM-dd') === dateStr
    );
    
    return day ? day.tasks : [];
  }

  // Get upcoming tasks
  getUpcomingTasks(schedule, count = 5) {
    const today = new Date();
    const upcomingTasks = [];
    
    schedule.forEach(day => {
      const dayDate = parseISO(day.date);
      if (dayDate >= today && day.tasks.length > 0) {
        day.tasks.forEach(task => {
          if (!task.completed) {
            upcomingTasks.push({
              ...task,
              date: day.date,
              dateStr: format(dayDate, 'MMM d')
            });
          }
        });
      }
    });
    
    return upcomingTasks.slice(0, count);
  }

  // Get overdue tasks
  getOverdueTasks(schedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = [];
    
    schedule.forEach(day => {
      const dayDate = parseISO(day.date);
      if (dayDate < today) {
        day.tasks.forEach(task => {
          if (!task.completed) {
            overdueTasks.push({
              ...task,
              date: day.date,
              dateStr: format(dayDate, 'MMM d'),
              daysOverdue: differenceInDays(today, dayDate)
            });
          }
        });
      }
    });
    
    return overdueTasks;
  }

  // Calculate schedule statistics
  calculateScheduleStats(schedule) {
    const allTasks = schedule.flatMap(day => day.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    const totalDuration = allTasks.reduce((sum, task) => sum + (task.duration || 0), 0);
    const completedDuration = allTasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + (task.duration || 0), 0);
    
    const subjects = [...new Set(allTasks.map(task => task.subject))];
    const phases = [...new Set(schedule.map(day => day.phase))];
    
    const todayTasks = this.getTasksForDate(schedule, new Date());
    const todayCompleted = todayTasks.filter(task => task.completed).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      totalDuration,
      completedDuration,
      pendingDuration: totalDuration - completedDuration,
      subjectsCount: subjects.length,
      phasesCount: phases.length,
      daysCount: schedule.length,
      todayTasks: todayTasks.length,
      todayCompleted,
      todayCompletionRate: todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0
    };
  }

  // Export schedule in various formats
  exportSchedule(schedule, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(schedule, null, 2);
      
      case 'csv':
        return this.convertToCSV(schedule);
      
      case 'ical':
        return this.convertToICal(schedule);
      
      case 'pdf':
        // This would typically call a PDF generation service
        return this.generatePDF(schedule);
      
      default:
        return JSON.stringify(schedule, null, 2);
    }
  }

  convertToCSV(schedule) {
    const headers = ['Date', 'Phase', 'Subject', 'Task', 'Type', 'Priority', 'Duration', 'Status'];
    const rows = schedule.flatMap(day =>
      day.tasks.map(task => [
        format(parseISO(day.date), 'yyyy-MM-dd'),
        day.phase,
        task.subject,
        task.title,
        task.type,
        task.priority,
        task.duration || 0,
        task.completed ? 'Completed' : 'Pending'
      ])
    );
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  }

  convertToICal(schedule) {
    let ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nexus AI//Study Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ].join('\n');

    schedule.forEach(day => {
      day.tasks.forEach((task, index) => {
        const startDate = format(parseISO(day.date), 'yyyyMMdd');
        const uid = `${task.id}@nexus.ai`;
        
        ical += '\nBEGIN:VEVENT';
        ical += `\nUID:${uid}`;
        ical += `\nSUMMARY:${task.title}`;
        ical += `\nDESCRIPTION:${task.description || 'Study session'}`;
        ical += `\nLOCATION:${task.subject}`;
        ical += `\nDTSTART:${startDate}T090000Z`;
        ical += `\nDTEND:${startDate}T${(9 + Math.floor((task.duration || 60) / 60)).toString().padStart(2, '0')}${((task.duration || 60) % 60).toString().padStart(2, '0')}00Z`;
        ical += `\nPRIORITY:${this.getICalPriority(task.priority)}`;
        ical += `\nSTATUS:${task.completed ? 'CONFIRMED' : 'TENTATIVE'}`;
        ical += '\nEND:VEVENT';
      });
    });

    ical += '\nEND:VCALENDAR';
    return ical;
  }

  getICalPriority(priority) {
    const priorities = {
      'high': 1,
      'medium': 3,
      'low': 5
    };
    return priorities[priority] || 5;
  }

  generatePDF(schedule) {
    // Simplified PDF generation
    const pdfContent = {
      title: 'Study Schedule',
      generated: new Date().toISOString(),
      schedule: schedule.map(day => ({
        date: day.date,
        tasks: day.tasks.map(task => ({
          title: task.title,
          subject: task.subject,
          duration: task.duration
        }))
      }))
    };
    
    return JSON.stringify(pdfContent, null, 2);
  }

  // Import schedule from file
  async importSchedule(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const schedule = JSON.parse(content);
          resolve(schedule);
        } catch (error) {
          reject(new Error('Invalid schedule file format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  // Validate schedule
  validateSchedule(schedule) {
    const errors = [];
    
    if (!Array.isArray(schedule)) {
      errors.push('Schedule must be an array');
      return errors;
    }
    
    schedule.forEach((day, index) => {
      if (!day.date) {
        errors.push(`Day ${index + 1}: Missing date`);
      }
      
      if (!Array.isArray(day.tasks)) {
        errors.push(`Day ${index + 1}: Tasks must be an array`);
      } else {
        day.tasks.forEach((task, taskIndex) => {
          if (!task.title) {
            errors.push(`Day ${index + 1}, Task ${taskIndex + 1}: Missing title`);
          }
          
          if (!task.subject) {
            errors.push(`Day ${index + 1}, Task ${taskIndex + 1}: Missing subject`);
          }
          
          if (task.duration && (typeof task.duration !== 'number' || task.duration <= 0)) {
            errors.push(`Day ${index + 1}, Task ${taskIndex + 1}: Invalid duration`);
          }
        });
      }
    });
    
    return errors;
  }

  // Save to localStorage
  saveToLocalStorage(schedule, key = this.storageKey) {
    try {
      localStorage.setItem(key, JSON.stringify(schedule));
      return true;
    } catch (error) {
      console.error('Failed to save schedule:', error);
      return false;
    }
  }

  // Load from localStorage
  loadFromLocalStorage(key = this.storageKey) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load schedule:', error);
      return null;
    }
  }
}

export const scheduleService = new ScheduleService();
