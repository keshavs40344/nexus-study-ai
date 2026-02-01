// src/data/examDatabase.js
export const EXAM_DATABASE = {
  // Chartered Accountancy
  'ca_final': {
    id: 'ca_final',
    label: 'Chartered Accountancy (CA Final)',
    category: 'finance',
    examCode: 'CA-FINAL',
    logo: '📊',
    accent: 'amber',
    bg: 'bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950',
    text: 'text-amber-400',
    difficulty: 'extreme',
    duration: '3-5 years',
    frequency: 'May & November',
    officialSites: ['https://icai.org', 'https://resource.cdn.icai.org'],
    popularity: 95,
    liveFeed: [
      'ICAI: May 2024 Results Declared - 12.5% Pass Rate',
      'New Amendments in Companies Act 2013 Implemented',
      'GST Council Meeting: Rate Changes for 15 Items',
      'ICAI Practice Alert: Digital Reporting Standards'
    ],
    subjects: [
      { 
        name: 'Financial Reporting', 
        weight: 100, 
        type: 'Practical', 
        totalModules: 28,
        topics: ['Ind AS 115', 'Consolidation', 'Financial Instruments', 'Fair Value'],
        recommendedTime: 200,
        referenceBooks: ['Padhuka', 'DSCL']
      },
      // ... more subjects
    ],
    scheduleTemplate: {
      phase1: 'Concept Building (45 days)',
      phase2: 'Revision & Problem Solving (30 days)',
      phase3: 'Mock Tests & Final Review (15 days)'
    },
    aiPersona: "Focus on Case Laws, Section Numbers, and Practical Application"
  },

  // Company Secretary
  'cs_executive': {
    id: 'cs_executive',
    label: 'Company Secretary (CS Executive)',
    category: 'finance',
    examCode: 'CS-EXEC',
    logo: '⚖️',
    accent: 'emerald',
    bg: 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950',
    text: 'text-emerald-400',
    difficulty: 'hard',
    duration: '18-24 months',
    frequency: 'June & December',
    officialSites: ['https://icsi.edu'],
    popularity: 85,
    subjects: [
      { name: 'Corporate Law', weight: 100, type: 'Theory', totalModules: 25 },
      { name: 'Securities Law', weight: 100, type: 'Hybrid', totalModules: 20 },
      { name: 'Economic Laws', weight: 100, type: 'Theory', totalModules: 22 },
      { name: 'Tax Laws', weight: 100, type: 'Practical', totalModules: 18 },
      { name: 'Governance', weight: 100, type: 'Theory', totalModules: 15 }
    ]
  },

  // UPSC Civil Services
  'upsc_cse': {
    id: 'upsc_cse',
    label: 'UPSC Civil Services (IAS/IPS)',
    category: 'government',
    examCode: 'UPSC-CSE',
    logo: '🏛️',
    accent: 'rose',
    bg: 'bg-gradient-to-br from-rose-950 via-rose-900 to-rose-950',
    text: 'text-rose-400',
    difficulty: 'extreme',
    duration: '12-18 months',
    frequency: 'Yearly',
    officialSites: ['https://upsc.gov.in', 'https://www.pib.gov.in'],
    popularity: 98,
    liveFeed: [
      'UPSC: 2024 Prelims Date Announced - June 16',
      'The Hindu: Editorial on Climate Change',
      'PIB: New Govt Schemes Launched',
      'Yojana Magazine: January Edition Released'
    ],
    subjects: [
      { 
        name: 'General Studies I', 
        weight: 200, 
        type: 'Theory', 
        totalModules: 40,
        topics: ['History', 'Geography', 'Society'],
        recommendedTime: 300
      },
      // ... more subjects
    ]
  },

  // NEET UG
  'neet_ug': {
    id: 'neet_ug',
    label: 'NEET UG (Medical Entrance)',
    category: 'medical',
    examCode: 'NEET-UG',
    logo: '⚕️',
    accent: 'pink',
    bg: 'bg-gradient-to-br from-pink-950 via-pink-900 to-pink-950',
    text: 'text-pink-400',
    difficulty: 'extreme',
    duration: '12-24 months',
    frequency: 'Yearly',
    officialSites: ['https://nta.ac.in', 'https://neet.nta.nic.in'],
    popularity: 97,
    liveFeed: [
      'NTA: NEET 2024 Application Started',
      'NMC: New Guidelines for Medical Education',
      'AIIMS: Cutoff Released for 2023',
      'Medical Council: Syllabus Revised'
    ],
    subjects: [
      { 
        name: 'Physics', 
        weight: 180, 
        type: 'Conceptual', 
        totalModules: 30,
        topics: ['Mechanics', 'Optics', 'Electromagnetism', 'Modern Physics'],
        recommendedTime: 250
      },
      { 
        name: 'Chemistry', 
        weight: 180, 
        type: 'Mixed',
        totalModules: 28,
        topics: ['Organic', 'Inorganic', 'Physical', 'Biomolecules'],
        recommendedTime: 240
      },
      { 
        name: 'Biology', 
        weight: 360, 
        type: 'Memory',
        totalModules: 45,
        topics: ['Zoology', 'Botany', 'Human Physiology', 'Genetics'],
        recommendedTime: 400
      }
    ]
  },

  // JEE Main
  'jee_main': {
    id: 'jee_main',
    label: 'JEE Main (Engineering)',
    category: 'engineering',
    examCode: 'JEE-MAIN',
    logo: '⚡',
    accent: 'cyan',
    bg: 'bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-950',
    text: 'text-cyan-400',
    difficulty: 'extreme',
    duration: '24 months',
    frequency: 'Twice Yearly',
    officialSites: ['https://jeemain.nta.nic.in'],
    popularity: 96,
    subjects: [
      { 
        name: 'Physics', 
        weight: 100, 
        type: 'Conceptual',
        totalModules: 25,
        topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Modern'],
        recommendedTime: 300
      },
      { 
        name: 'Chemistry', 
        weight: 100, 
        type: 'Mixed',
        totalModules: 23,
        topics: ['Physical', 'Organic', 'Inorganic'],
        recommendedTime: 280
      },
      { 
        name: 'Mathematics', 
        weight: 100, 
        type: 'Problem',
        totalModules: 28,
        topics: ['Calculus', 'Algebra', 'Coordinate', 'Trigonometry'],
        recommendedTime: 320
      }
    ]
  },

  // SSC CGL
  'ssc_cgl': {
    id: 'ssc_cgl',
    label: 'SSC CGL (Combined Graduate Level)',
    category: 'government',
    examCode: 'SSC-CGL',
    logo: '📋',
    accent: 'blue',
    bg: 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950',
    text: 'text-blue-400',
    difficulty: 'hard',
    duration: '6-8 months',
    frequency: 'Yearly',
    officialSites: ['https://ssc.nic.in'],
    popularity: 90,
    subjects: [
      { name: 'General Intelligence', weight: 50, type: 'Logical', totalModules: 15 },
      { name: 'General Awareness', weight: 50, type: 'Theory', totalModules: 25 },
      { name: 'Quantitative Aptitude', weight: 50, type: 'Practical', totalModules: 20 },
      { name: 'English Comprehension', weight: 50, type: 'Language', totalModules: 18 }
    ]
  },

  // GATE
  'gate': {
    id: 'gate',
    label: 'GATE (Graduate Aptitude Test)',
    category: 'engineering',
    examCode: 'GATE',
    logo: '🎓',
    accent: 'teal',
    bg: 'bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950',
    text: 'text-teal-400',
    difficulty: 'extreme',
    duration: '12 months',
    frequency: 'Yearly',
    officialSites: ['https://gate.iitk.ac.in'],
    popularity: 92,
    subjects: [
      { name: 'Technical Subjects', weight: 100, type: 'Technical', totalModules: 35 },
      { name: 'Engineering Mathematics', weight: 15, type: 'Theory', totalModules: 12 },
      { name: 'General Aptitude', weight: 15, type: 'Logical', totalModules: 10 }
    ]
  },

  // CLAT
  'clat': {
    id: 'clat',
    label: 'CLAT (Law Entrance)',
    category: 'law',
    examCode: 'CLAT',
    logo: '⚖️',
    accent: 'yellow',
    bg: 'bg-gradient-to-br from-yellow-950 via-yellow-900 to-yellow-950',
    text: 'text-yellow-400',
    difficulty: 'hard',
    duration: '12 months',
    frequency: 'Yearly',
    officialSites: ['https://consortiumofnlus.ac.in'],
    popularity: 88,
    subjects: [
      { name: 'Legal Reasoning', weight: 150, type: 'Logical', totalModules: 20 },
      { name: 'Logical Reasoning', weight: 70, type: 'Logical', totalModules: 15 },
      { name: 'English Language', weight: 70, type: 'Language', totalModules: 18 },
      { name: 'Current Affairs', weight: 70, type: 'Dynamic', totalModules: 25 },
      { name: 'Quantitative Techniques', weight: 40, type: 'Practical', totalModules: 12 }
    ]
  },

  // NDA
  'nda': {
    id: 'nda',
    label: 'NDA (National Defence Academy)',
    category: 'defense',
    examCode: 'NDA',
    logo: '🎖️',
    accent: 'slate',
    bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
    text: 'text-slate-400',
    difficulty: 'hard',
    duration: '6-8 months',
    frequency: 'Twice Yearly',
    officialSites: ['https://upsc.gov.in'],
    popularity: 85,
    subjects: [
      { name: 'Mathematics', weight: 300, type: 'Practical', totalModules: 25 },
      { name: 'General Ability Test', weight: 600, type: 'Theory', totalModules: 40 }
    ]
  },

  // IBPS PO
  'ibps_po': {
    id: 'ibps_po',
    label: 'IBPS PO (Probationary Officer)',
    category: 'banking',
    examCode: 'IBPS-PO',
    logo: '🏦',
    accent: 'indigo',
    bg: 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950',
    text: 'text-indigo-400',
    difficulty: 'hard',
    duration: '6 months',
    frequency: 'Yearly',
    officialSites: ['https://ibps.in'],
    popularity: 89,
    subjects: [
      { name: 'Reasoning Ability', weight: 60, type: 'Logical', totalModules: 20 },
      { name: 'English Language', weight: 40, type: 'Language', totalModules: 18 },
      { name: 'Quantitative Aptitude', weight: 50, type: 'Practical', totalModules: 22 },
      { name: 'General Awareness', weight: 40, type: 'Theory', totalModules: 30 },
      { name: 'Computer Knowledge', weight: 20, type: 'Technical', totalModules: 12 }
    ]
  },

  // Add more exams...
  'cat': {
    id: 'cat',
    label: 'CAT (MBA Entrance)',
    category: 'management',
    examCode: 'CAT',
    logo: '📈',
    accent: 'purple',
    bg: 'bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950',
    text: 'text-purple-400',
    difficulty: 'extreme',
    duration: '12 months',
    frequency: 'Yearly',
    officialSites: ['https://iimcat.ac.in'],
    popularity: 94,
    subjects: [
      { name: 'Quantitative Ability', weight: 66, type: 'Practical', totalModules: 25 },
      { name: 'Verbal Ability', weight: 66, type: 'Language', totalModules: 22 },
      { name: 'Logical Reasoning', weight: 66, type: 'Logical', totalModules: 20 },
      { name: 'Data Interpretation', weight: 66, type: 'Practical', totalModules: 18 }
    ]
  },

  'cma_final': {
    id: 'cma_final',
    label: 'CMA (Cost & Management Accountant)',
    category: 'finance',
    examCode: 'CMA-FINAL',
    logo: '💰',
    accent: 'orange',
    bg: 'bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950',
    text: 'text-orange-400',
    difficulty: 'hard',
    duration: '18-24 months',
    frequency: 'June & December',
    officialSites: ['https://icmai.in'],
    popularity: 82,
    subjects: [
      { name: 'Strategic Cost Management', weight: 100, type: 'Practical', totalModules: 20 },
      { name: 'Strategic Performance Management', weight: 100, type: 'Practical', totalModules: 18 },
      { name: 'Direct Tax Laws', weight: 100, type: 'Hybrid', totalModules: 22 },
      { name: 'Indirect Tax Laws', weight: 100, type: 'Hybrid', totalModules: 20 }
    ]
  }
};

// Exam categories for filtering
export const EXAM_CATEGORIES = [
  { id: 'all', label: 'All Exams', icon: '📚', count: Object.keys(EXAM_DATABASE).length },
  { id: 'finance', label: 'Finance & Accounting', icon: '📊', count: 4 },
  { id: 'government', label: 'Government Services', icon: '🏛️', count: 3 },
  { id: 'medical', label: 'Medical Entrance', icon: '⚕️', count: 2 },
  { id: 'engineering', label: 'Engineering', icon: '⚡', count: 3 },
  { id: 'law', label: 'Law', icon: '⚖️', count: 2 },
  { id: 'defense', label: 'Defense Services', icon: '🎖️', count: 2 },
  { id: 'banking', label: 'Banking & Insurance', icon: '🏦', count: 3 },
  { id: 'management', label: 'Management', icon: '📈', count: 2 }
];
