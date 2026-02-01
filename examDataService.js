// src/services/examDataService.js
import { EXAM_DATABASE } from '../data/examDatabase';

class ExamDataService {
  constructor() {
    this.examDatabase = EXAM_DATABASE;
  }

  // Get all exams
  getAllExams() {
    return Object.values(this.examDatabase);
  }

  // Get exam by ID
  getExamById(examId) {
    return this.examDatabase[examId];
  }

  // Search exams
  searchExams(query, category = null) {
    const exams = this.getAllExams();
    
    return exams.filter(exam => {
      const matchesQuery = exam.label.toLowerCase().includes(query.toLowerCase()) ||
                          exam.examCode.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || exam.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  // Get recommended exams
  getRecommendedExams(userPreferences) {
    const exams = this.getAllExams();
    
    return exams
      .filter(exam => {
        // Filter based on user preferences
        if (userPreferences.category && exam.category !== userPreferences.category) {
          return false;
        }
        
        if (userPreferences.duration) {
          const examDuration = parseInt(exam.duration);
          const userDuration = parseInt(userPreferences.duration);
          
          if (userDuration < examDuration * 0.5 || userDuration > examDuration * 1.5) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
  }

  // Get exam syllabus
  getExamSyllabus(examId) {
    const exam = this.getExamById(examId);
    if (!exam) return null;
    
    return {
      ...exam,
      subjects: exam.subjects.map(subject => ({
        ...subject,
        modules: this.generateModules(subject, exam.difficulty)
      }))
    };
  }

  generateModules(subject, difficulty) {
    const moduleCount = subject.totalModules;
    const modules = [];
    
    for (let i = 1; i <= moduleCount; i++) {
      modules.push({
        id: `${subject.name.toLowerCase().replace(/\s+/g, '-')}-module-${i}`,
        name: `${subject.name} - Module ${i}`,
        estimatedHours: this.calculateModuleHours(subject, difficulty, i),
        topics: this.generateTopics(subject, i),
        resources: this.generateResources(subject, i)
      });
    }
    
    return modules;
  }

  calculateModuleHours(subject, difficulty, moduleNumber) {
    const baseHours = subject.recommendedTime / subject.totalModules;
    const difficultyMultiplier = {
      'easy': 0.8,
      'medium': 1.0,
      'hard': 1.2,
      'extreme': 1.5
    }[difficulty] || 1.0;
    
    return Math.ceil(baseHours * difficultyMultiplier);
  }

  generateTopics(subject, moduleNumber) {
    if (subject.topics && subject.topics.length > 0) {
      const topicsPerModule = Math.ceil(subject.topics.length / subject.totalModules);
      const startIndex = (moduleNumber - 1) * topicsPerModule;
      return subject.topics.slice(startIndex, startIndex + topicsPerModule);
    }
    
    return [`${subject.name} Fundamentals`, `Advanced ${subject.name} Concepts`];
  }

  generateResources(subject, moduleNumber) {
    const resources = [];
    
    // Add reference books
    if (subject.referenceBooks && subject.referenceBooks.length > 0) {
      resources.push({
        type: 'book',
        title: subject.referenceBooks[0],
        url: '#'
      });
    }
    
    // Add video lectures
    resources.push({
      type: 'video',
      title: `${subject.name} - Module ${moduleNumber} Lecture`,
      url: '#',
      duration: '2:30:00'
    });
    
    // Add practice questions
    resources.push({
      type: 'questions',
      title: `Practice Questions - Module ${moduleNumber}`,
      url: '#',
      count: 50
    });
    
    return resources;
  }
}

export const examDataService = new ExamDataService();
