// src/services/dashboardService.js
class DashboardService {
  constructor() {
    this.cache = new Map();
  }

  // Get dashboard summary
  async getDashboardSummary(userConfig, schedule) {
    const cacheKey = `dashboard_summary_${userConfig?.userId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const summary = await this.calculateSummary(userConfig, schedule);
    this.cache.set(cacheKey, summary);
    
    // Clear cache after 5 minutes
    setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);
    
    return summary;
  }

  async calculateSummary(userConfig, schedule) {
    const today = new Date();
    const examDate = new Date(userConfig.examDate);
    
    // Calculate time metrics
    const totalDays = userConfig.totalDays;
    const daysRemaining = Math.max(0, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));
    const daysCompleted = totalDays - daysRemaining;
    const completionRate = totalDays > 0 ? (daysCompleted / totalDays) * 100 : 0;
    
    // Calculate task metrics
    const allTasks = schedule?.flatMap(day => day.tasks || []) || [];
    const completedTasks = allTasks.filter(task => task.completed).length;
    const totalTasks = allTasks.length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate study hours
    const totalStudyHours = daysCompleted * userConfig.hoursPerDay;
    const estimatedRemainingHours = daysRemaining * userConfig.hoursPerDay;
    
    // Calculate daily consistency
    const last7Days = this.getLast7DaysCompletion(schedule);
    const dailyConsistency = (last7Days.filter(day => day.completed).length / 7) * 100;
    
    // Calculate performance metrics
    const performanceScore = this.calculatePerformanceScore(schedule, userConfig);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      completionRate, 
      taskCompletionRate, 
      dailyConsistency,
      daysRemaining
    );
    
    // Calculate efficiency score
    const efficiencyScore = this.calculateEfficiencyScore(
      taskCompletionRate,
      dailyConsistency,
      performanceScore
    );
    
    return {
      timeMetrics: {
        daysRemaining,
        daysCompleted,
        completionRate,
        totalStudyHours,
        estimatedRemainingHours,
        dailyAverageHours: daysCompleted > 0 ? totalStudyHours / daysCompleted : 0
      },
      taskMetrics: {
        totalTasks,
        completedTasks,
        taskCompletionRate,
        pendingTasks: totalTasks - completedTasks
      },
      performanceMetrics: {
        score: performanceScore,
        consistency: dailyConsistency,
        efficiency: efficiencyScore,
        last7Days
      },
      recommendations,
      predictions: this.generatePredictions(
        completionRate,
        performanceScore,
        efficiencyScore,
        daysRemaining
      )
    };
  }

  getLast7DaysCompletion(schedule) {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySchedule = schedule?.find(day => 
        new Date(day.date).toISOString().split('T')[0] === dateStr
      );
      
      if (daySchedule) {
        const totalTasks = daySchedule.tasks?.length || 0;
        const completedTasks = daySchedule.tasks?.filter(t => t.completed).length || 0;
        
        last7Days.push({
          date: dateStr,
          completed: completedTasks > 0 || totalTasks === 0,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          tasksCompleted: completedTasks
        });
      } else {
        last7Days.push({
          date: dateStr,
          completed: false,
          completionRate: 0,
          tasksCompleted: 0
        });
      }
    }
    
    return last7Days;
  }

  calculatePerformanceScore(schedule) {
    // Calculate performance based on task completion, timeliness, and difficulty
    let totalScore = 0;
    let maxScore = 0;
    
    schedule?.forEach(day => {
      day.tasks?.forEach(task => {
        const taskWeight = this.getTaskWeight(task);
        maxScore += taskWeight;
        
        if (task.completed) {
          let taskScore = taskWeight;
          
          // Bonus for early completion
          if (task.completedEarly) {
            taskScore *= 1.2;
          }
          
          // Penalty for late completion
          if (task.completedLate) {
            taskScore *= 0.8;
          }
          
          totalScore += taskScore;
        }
      });
    });
    
    return maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  }

  getTaskWeight(task) {
    // Assign weight based on priority and type
    const priorityWeights = {
      'very-high': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
    
    const typeWeights = {
      'test': 1.5,
      'practice': 1.2,
      'study': 1,
      'revision': 0.8
    };
    
    return (priorityWeights[task.priority] || 1) * (typeWeights[task.type] || 1);
  }

  calculateEfficiencyScore(taskCompletionRate, consistency, performanceScore) {
    // Weighted average of different metrics
    const weights = {
      taskCompletion: 0.4,
      consistency: 0.3,
      performance: 0.3
    };
    
    return (
      (taskCompletionRate * weights.taskCompletion) +
      (consistency * weights.consistency) +
      (performanceScore * weights.performance)
    ) / Object.values(weights).reduce((a, b) => a + b, 0);
  }

  generateRecommendations(completionRate, taskCompletionRate, consistency, daysRemaining) {
    const recommendations = [];
    
    if (completionRate < 50 && daysRemaining < 30) {
      recommendations.push({
        type: 'urgent',
        title: 'Accelerate Study Pace',
        message: 'You\'re falling behind schedule. Consider increasing daily study hours.',
        priority: 'high'
      });
    }
    
    if (taskCompletionRate < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Improve Task Completion',
        message: 'Focus on completing scheduled tasks to stay on track.',
        priority: 'medium'
      });
    }
    
    if (consistency < 70) {
      recommendations.push({
        type: 'suggestion',
        title: 'Build Consistency',
        message: 'Try to study every day, even if for shorter periods.',
        priority: 'medium'
      });
    }
    
    if (daysRemaining < 7) {
      recommendations.push({
        type: 'tip',
        title: 'Final Revision',
        message: 'Focus on revision and mock tests in the final week.',
        priority: 'high'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Great Progress!',
        message: 'You\'re on track. Keep up the good work!',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  generatePredictions(completionRate, performanceScore, efficiencyScore, daysRemaining) {
    // Predict final score based on current performance
    const baseScore = performanceScore;
    const timeFactor = Math.min(1, completionRate / 100);
    const efficiencyFactor = efficiencyScore / 100;
    
    // Calculate predicted score with diminishing returns
    let predictedScore = baseScore * (0.7 + (timeFactor * 0.3)) * (0.8 + (efficiencyFactor * 0.2));
    
    // Adjust for remaining time
    const timeAdjustment = daysRemaining > 0 ? (daysRemaining / 30) * 0.1 : 0;
    predictedScore *= (1 + timeAdjustment);
    
    // Cap predictions
    predictedScore = Math.min(98, Math.max(40, predictedScore));
    
    // Calculate confidence
    let confidence = 75;
    if (completionRate > 80) confidence += 10;
    if (performanceScore > 80) confidence += 10;
    if (efficiencyScore > 80) confidence += 5;
    confidence = Math.min(95, confidence);
    
    return {
      predictedScore: Math.round(predictedScore),
      confidence: Math.round(confidence),
      requiredDailyHours: this.calculateRequiredHours(completionRate, daysRemaining),
      studySuggestions: this.generateStudySuggestions(predictedScore, performanceScore)
    };
  }

  calculateRequiredHours(completionRate, daysRemaining) {
    if (completionRate >= 100) return 0;
    
    const remainingProgress = 100 - completionRate;
    const requiredDailyProgress = remainingProgress / Math.max(1, daysRemaining);
    
    // Convert progress percentage to study hours
    // Assuming 1% progress = 0.5 hours of effective study
    return Math.ceil(requiredDailyProgress * 0.5);
  }

  generateStudySuggestions(predictedScore, currentScore) {
    const suggestions = [];
    
    if (predictedScore < 70) {
      suggestions.push('Focus on weak areas identified in analytics');
      suggestions.push('Increase mock test frequency');
      suggestions.push('Join study groups for difficult topics');
    } else if (predictedScore < 85) {
      suggestions.push('Maintain current pace with regular revision');
      suggestions.push('Take full-length mock tests weekly');
      suggestions.push('Review error logs from practice sessions');
    } else {
      suggestions.push('Focus on speed and accuracy improvement');
      suggestions.push('Help peers in study groups');
      suggestions.push('Mentor junior students to reinforce concepts');
    }
    
    return suggestions;
  }

  // Get real-time study insights
  async getStudyInsights(userId, startDate, endDate) {
    // This would typically fetch from backend
    return {
      peakStudyHours: this.calculatePeakHours(),
      mostProductiveDays: this.calculateProductiveDays(),
      averageSessionLength: 45, // minutes
      breakEfficiency: 78, // percentage
      focusScore: 82 // out of 100
    };
  }

  calculatePeakHours() {
    // Simulate peak study hours
    return [
      { hour: '6-8 AM', percentage: 25 },
      { hour: '8-10 AM', percentage: 35 },
      { hour: '2-4 PM', percentage: 40 },
      { hour: '8-10 PM', percentage: 30 }
    ];
  }

  calculateProductiveDays() {
    // Simulate productive days
    return [
      { day: 'Monday', productivity: 85 },
      { day: 'Tuesday', productivity: 78 },
      { day: 'Wednesday', productivity: 92 },
      { day: 'Thursday', productivity: 88 },
      { day: 'Friday', productivity: 75 },
      { day: 'Saturday', productivity: 65 },
      { day: 'Sunday', productivity: 70 }
    ];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export const dashboardService = new DashboardService();
