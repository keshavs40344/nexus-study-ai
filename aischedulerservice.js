// src/services/aiSchedulerService.js
import { NeuralScheduler } from '../utils/algorithms';
import { examDataService } from './examDataService';

class AISchedulerService {
  constructor() {
    this.scheduler = new NeuralScheduler();
  }

  async generateStudyPlan(userConfig) {
    try {
      // Get exam syllabus
      const examSyllabus = examDataService.getExamSyllabus(userConfig.examId);
      if (!examSyllabus) {
        throw new Error('Exam not found');
      }

      // Calculate total study hours
      const totalStudyHours = this.calculateTotalStudyHours(userConfig);
      
      // Generate optimal schedule
      const schedule = this.generateOptimalSchedule(examSyllabus, userConfig, totalStudyHours);
      
      // Add AI recommendations
      const recommendations = this.generateAIRecommendations(examSyllabus, userConfig);
      
      // Calculate predicted performance
      const performancePrediction = this.predictPerformance(userConfig, schedule);
      
      return {
        schedule,
        recommendations,
        performancePrediction,
        metadata: {
          generatedAt: new Date().toISOString(),
          totalDays: userConfig.totalDays,
          totalHours: totalStudyHours,
          subjectsCount: examSyllabus.subjects.length,
          modulesCount: examSyllabus.subjects.reduce((sum, sub) => sum + sub.totalModules, 0)
        }
      };
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    }
  }

  calculateTotalStudyHours(userConfig) {
    const { totalDays, hoursPerDay, includeWeekends } = userConfig;
    const effectiveDays = includeWeekends ? totalDays : Math.floor(totalDays / 7) * 5;
    return effectiveDays * hoursPerDay;
  }

  generateOptimalSchedule(examSyllabus, userConfig, totalStudyHours) {
    const schedule = [];
    const subjects = examSyllabus.subjects;
    
    // Calculate weight-based allocation
    const totalWeight = subjects.reduce((sum, sub) => sum + sub.weight, 0);
    
    // Phase 1: Concept Building (60%)
    const conceptHours = totalStudyHours * 0.6;
    const conceptSchedule = this.generateConceptPhase(subjects, conceptHours, userConfig);
    schedule.push(...conceptSchedule);
    
    // Phase 2: Practice & Application (25%)
    const practiceHours = totalStudyHours * 0.25;
    const practiceSchedule = this.generatePracticePhase(subjects, practiceHours, userConfig);
    schedule.push(...practiceSchedule);
    
    // Phase 3: Revision & Mock Tests (15%)
    const revisionHours = totalStudyHours * 0.15;
    const revisionSchedule = this.generateRevisionPhase(examSyllabus, revisionHours, userConfig);
    schedule.push(...revisionSchedule);
    
    // Optimize schedule
    return this.optimizeSchedule(schedule, userConfig);
  }

  generateConceptPhase(subjects, totalHours, userConfig) {
    const schedule = [];
    const hoursPerSubject = {};
    
    // Allocate hours based on weight
    subjects.forEach(subject => {
      const subjectHours = (subject.weight / 100) * totalHours;
      hoursPerSubject[subject.name] = subjectHours;
      
      // Generate daily tasks for this subject
      const daysForSubject = Math.ceil(subjectHours / userConfig.hoursPerDay);
      const modulesPerDay = Math.ceil(subject.totalModules / daysForSubject);
      
      for (let day = 0; day < daysForSubject; day++) {
        const date = new Date(userConfig.startDate);
        date.setDate(date.getDate() + schedule.length);
        
        schedule.push({
          date: date.toISOString().split('T')[0],
          phase: 'Concept Building',
          subject: subject.name,
          type: 'study',
          tasks: [
            {
              title: `${subject.name} - Module ${day + 1}`,
              description: `Learn new concepts and theories`,
              duration: Math.min(userConfig.hoursPerDay * 0.6, 3),
              priority: 'high',
              resources: subject.referenceBooks || [],
              topics: subject.topics?.slice(day * modulesPerDay, (day + 1) * modulesPerDay) || []
            }
          ],
          isComplete: false
        });
      }
    });
    
    return schedule;
  }

  generatePracticePhase(subjects, totalHours, userConfig) {
    const schedule = [];
    const startDate = new Date(userConfig.startDate);
    startDate.setDate(startDate.getDate() + Math.floor(userConfig.totalDays * 0.6));
    
    // Generate practice sessions
    const practiceDays = Math.ceil(totalHours / userConfig.hoursPerDay);
    
    for (let day = 0; day < practiceDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      const subjectIndex = day % subjects.length;
      const subject = subjects[subjectIndex];
      
      schedule.push({
        date: date.toISOString().split('T')[0],
        phase: 'Practice & Application',
        subject: subject.name,
        type: 'practice',
        tasks: [
          {
            title: `${subject.name} Practice Session`,
            description: 'Solve problems and case studies',
            duration: userConfig.hoursPerDay * 0.8,
            priority: 'medium',
            exerciseTypes: ['MCQs', 'Case Studies', 'Problem Solving'],
            targetQuestions: 50
          }
        ],
        isComplete: false
      });
    }
    
    return schedule;
  }

  generateRevisionPhase(examSyllabus, totalHours, userConfig) {
    const schedule = [];
    const startDate = new Date(userConfig.startDate);
    startDate.setDate(startDate.getDate() + Math.floor(userConfig.totalDays * 0.85));
    
    // Generate revision sessions
    const revisionDays = Math.ceil(totalHours / userConfig.hoursPerDay);
    
    for (let day = 0; day < revisionDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      if (day % 3 === 0) {
        // Mock test every 3 days
        schedule.push({
          date: date.toISOString().split('T')[0],
          phase: 'Mock Tests',
          subject: 'Full Syllabus',
          type: 'test',
          tasks: [
            {
              title: `Full Length Mock Test ${Math.floor(day / 3) + 1}`,
              description: 'Simulate actual exam conditions',
              duration: 3, // 3 hours
              priority: 'very-high',
              sections: examSyllabus.subjects.map(s => s.name),
              totalQuestions: 100
            }
          ],
          isComplete: false
        });
      } else {
        // Revision session
        const subjectIndex = day % examSyllabus.subjects.length;
        const subject = examSyllabus.subjects[subjectIndex];
        
        schedule.push({
          date: date.toISOString().split('T')[0],
          phase: 'Revision',
          subject: subject.name,
          type: 'revision',
          tasks: [
            {
              title: `${subject.name} Revision`,
              description: 'Review key concepts and formulas',
              duration: userConfig.hoursPerDay * 0.7,
              priority: 'high',
              focusAreas: subject.topics?.slice(0, 3) || [],
              revisionType: 'Spaced Repetition'
            }
          ],
          isComplete: false
        });
      }
    }
    
    return schedule;
  }

  optimizeSchedule(schedule, userConfig) {
    // Sort by date
    schedule.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Balance daily load
    const dailyLoad = {};
    schedule.forEach(day => {
      if (!dailyLoad[day.date]) {
        dailyLoad[day.date] = { tasks: [], totalHours: 0 };
      }
      dailyLoad[day.date].tasks.push(...day.tasks);
      dailyLoad[day.date].totalHours += day.tasks.reduce((sum, task) => sum + task.duration, 0);
    });
    
    // Redistribute if overloaded
    Object.entries(dailyLoad).forEach(([date, load]) => {
      if (load.totalHours > userConfig.hoursPerDay * 1.2) {
        this.redistributeOverload(date, load, schedule, userConfig);
      }
    });
    
    return schedule;
  }

  redistributeOverload(date, load, schedule, userConfig) {
    const overloadHours = load.totalHours - userConfig.hoursPerDay;
    const tasksToMove = [];
    
    // Find lower priority tasks to move
    load.tasks.forEach(task => {
      if (task.priority === 'low' || task.priority === 'medium') {
        tasksToMove.push(task);
      }
    });
    
    // Move tasks to next available day
    tasksToMove.slice(0, Math.ceil(overloadHours / 2)).forEach(task => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const nextDayIndex = schedule.findIndex(d => d.date === nextDate.toISOString().split('T')[0]);
      if (nextDayIndex !== -1) {
        schedule[nextDayIndex].tasks.push(task);
      } else {
        // Create new day if doesn't exist
        schedule.push({
          date: nextDate.toISOString().split('T')[0],
          phase: 'Buffer',
          subject: 'Additional',
          type: 'catchup',
          tasks: [task],
          isComplete: false
        });
      }
      
      // Remove from original day
      const dayIndex = schedule.findIndex(d => d.date === date);
      if (dayIndex !== -1) {
        schedule[dayIndex].tasks = schedule[dayIndex].tasks.filter(t => t !== task);
      }
    });
  }

  generateAIRecommendations(examSyllabus, userConfig) {
    const recommendations = [];
    
    // Time management recommendations
    if (userConfig.hoursPerDay < 4) {
      recommendations.push({
        type: 'warning',
        title: 'Low Study Hours',
        message: `Consider increasing study hours from ${userConfig.hoursPerDay} to at least 4 hours per day for better results.`,
        priority: 'medium'
      });
    }
    
    if (userConfig.hoursPerDay > 8) {
      recommendations.push({
        type: 'warning',
        title: 'High Study Hours',
        message: `${userConfig.hoursPerDay} hours per day is intensive. Make sure to include breaks and rest days to avoid burnout.`,
        priority: 'high'
      });
    }
    
    // Subject-specific recommendations
    const heavySubjects = examSyllabus.subjects.filter(s => s.weight >= 150);
    heavySubjects.forEach(subject => {
      recommendations.push({
        type: 'suggestion',
        title: `Focus on ${subject.name}`,
        message: `${subject.name} has high weightage (${subject.weight} marks). Allocate extra time and practice.`,
        priority: 'high'
      });
    });
    
    // Revision recommendations
    recommendations.push({
      type: 'tip',
      title: 'Spaced Repetition',
      message: 'The schedule includes spaced revision cycles for better retention. Review concepts at increasing intervals.',
      priority: 'low'
    });
    
    return recommendations;
  }

  predictPerformance(userConfig, schedule) {
    let baseScore = 60;
    
    // Adjust based on study hours
    baseScore += (userConfig.hoursPerDay - 4) * 2.5;
    
    // Adjust based on total days
    const daysPerWeek = userConfig.includeWeekends ? 7 : 5;
    const effectiveDays = Math.floor(userConfig.totalDays / 7) * daysPerWeek;
    baseScore += (effectiveDays - 30) * 0.1;
    
    // Adjust based on difficulty
    const difficultyMultiplier = {
      easy: 0.9,
      medium: 1,
      hard: 1.1,
      extreme: 1.2
    }[userConfig.difficulty] || 1;
    
    // Adjust based on target score
    const targetMultiplier = userConfig.targetScore / 85;
    
    let predictedScore = baseScore * difficultyMultiplier * targetMultiplier;
    
    // Cap between 40-95
    predictedScore = Math.max(40, Math.min(95, predictedScore));
    
    // Calculate confidence
    let confidence = 75;
    if (userConfig.totalDays >= 90) confidence += 10;
    if (userConfig.hoursPerDay >= 6) confidence += 10;
    if (userConfig.difficulty === 'hard' || userConfig.difficulty === 'extreme') confidence -= 5;
    
    return {
      predictedScore: Math.round(predictedScore),
      confidence: Math.min(95, confidence),
      improvementAreas: this.identifyImprovementAreas(userConfig, schedule),
      weeklyTarget: Math.round(predictedScore / (userConfig.totalDays / 7))
    };
  }

  identifyImprovementAreas(userConfig, schedule) {
    const areas = [];
    
    if (userConfig.hoursPerDay < 4) {
      areas.push('Increase daily study hours');
    }
    
    if (!userConfig.includeWeekends) {
      areas.push('Consider studying on weekends for faster progress');
    }
    
    if (userConfig.difficulty === 'easy') {
      areas.push('Challenge yourself with more difficult practice problems');
    }
    
    return areas;
  }

  // Export schedule in different formats
  exportSchedule(schedule, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(schedule, null, 2);
      case 'csv':
        return this.convertToCSV(schedule);
      case 'ical':
        return this.convertToICal(schedule);
      default:
        return JSON.stringify(schedule, null, 2);
    }
  }

  convertToCSV(schedule) {
    const headers = ['Date', 'Phase', 'Subject', 'Type', 'Task', 'Duration', 'Priority'];
    const rows = schedule.flatMap(day =>
      day.tasks.map(task => [
        day.date,
        day.phase,
        day.subject,
        day.type,
        task.title,
        task.duration,
        task.priority
      ])
    );
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  convertToICal(schedule) {
    // Basic iCal format implementation
    let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Nexus AI//Study Planner//EN\n';
    
    schedule.forEach(day => {
      day.tasks.forEach(task => {
        const startDate = day.date.replace(/-/g, '');
        ical += 'BEGIN:VEVENT\n';
        ical += `SUMMARY:${task.title}\n`;
        ical += `DESCRIPTION:${task.description || 'Study Session'}\n`;
        ical += `DTSTART:${startDate}T090000Z\n`;
        ical += `DTEND:${startDate}T${(9 + task.duration).toString().padStart(2, '0')}0000Z\n`;
        ical += `PRIORITY:${this.getICalPriority(task.priority)}\n`;
        ical += 'END:VEVENT\n';
      });
    });
    
    ical += 'END:VCALENDAR';
    return ical;
  }

  getICalPriority(priority) {
    const priorities = {
      'very-high': 1,
      'high': 3,
      'medium': 5,
      'low': 7
    };
    return priorities[priority] || 5;
  }
}

export const aiSchedulerService = new AISchedulerService();
