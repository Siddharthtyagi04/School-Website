/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Post {
  id: string;
  title: string;
  description: string;
  date: string;
  attachmentName?: string;
  attachmentUrl?: string;
  authorId: string;
  authorName: string;
}

export interface SyllabusItem {
  id: string;
  title: string;
  classLevel: string; // "Class 1" to "Class 12"
  subject: string;
  fileName: string;
  fileUrl: string;
  authorId: string;
  authorName: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  classLevel: string;
  subject: string;
  description: string;
  dueDate: string;
  fileName?: string;
  fileUrl?: string;
  authorId: string;
  authorName: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}

export interface StaticContent {
  history: string;
  mission: string;
  vision: string;
  managementDetails: string;
  address: string;
  phone: string;
  email: string;
  principalMessage: string;
  principalName: string;
}

// Default pre-seeded content for the school PKLJSVM
const DEFAULT_STATIC_CONTENT: StaticContent = {
  history: "Premwati Kunji Lal Jain Saraswati Vidhya Mandir (PKLJSVM) was established with a vision to provide value-based education rooted in Indian culture and academic excellence. Affiliated with Vidya Bharati Akhil Bharatiya Shiksha Sansthan, the school has been serving the community of Saini, Bilaspur, and Greater Noida for over two decades. Named in honor of late Smt. Premwati and Shri Kunji Lal Jain, the school fosters physical, mental, and spiritual development in students through holistic curriculum, Sanskriti, and modern science.",
  mission: "To provide a nurturing environment where students achieve academic greatness, learn respect for cultural heritage, build strong moral character, and develop a scientific temperament to become responsible global citizens serving society.",
  vision: "To be a premier educational institution where traditional values meet modern innovation, creating leaders of tomorrow who are intellectually capable, morally upright, and culturally rooted.",
  managementDetails: "PKLJSVM is managed by the Saraswati Shiksha Samiti, comprising veteran educationists, industrialists, and social leaders. Under the guidance of Vidya Bharati, the school management committee ensures state-of-the-art facilities, excellent teacher-to-student ratios, and continuous professional development for the staff, maintaining the highest standard of moral and academic instruction.",
  address: "Saini, Bilaspur, Greater Noida, G.B. Nagar, Uttar Pradesh - 203202, India",
  phone: "+91-9871542150, +91-8800543210",
  email: "info@pkljsvm.com, admissions@pkljsvm.com",
  principalMessage: "Welcome to Premwati Kunji Lal Jain Saraswati Vidhya Mandir. Our institution stands as a lighthouse of knowledge and values. We believe that education is not merely loading the mind with facts, but igniting a spark of character, discipline, and patriotism. Our team of dedicated teachers works tirelessly to ensure that every student's unique potential is recognized and nurtured, preparing them to excel in CBSE/UP Board examinations and in life's challenges.",
  principalName: "Shri Mahendra Singh (Principal)"
};

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Mr. Ramesh Sharma",
    email: "ramesh.sharma@pkljsvm.com",
    phone: "9876543210",
    subjects: ["Mathematics", "Physics"],
    classes: ["Class 9", "Class 10", "Class 11", "Class 12"]
  },
  {
    id: "t2",
    name: "Mrs. Sunita Verma",
    email: "sunita.verma@pkljsvm.com",
    phone: "9876543211",
    subjects: ["Science", "Chemistry", "Biology"],
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]
  },
  {
    id: "t3",
    name: "Shri Keshav Dutt",
    email: "keshav.dutt@pkljsvm.com",
    phone: "9876543212",
    subjects: ["Sanskrit", "Hindi", "Moral Science"],
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"]
  },
  {
    id: "t4",
    name: "Miss Anjali Gupta",
    email: "anjali.gupta@pkljsvm.com",
    phone: "9876543213",
    subjects: ["English", "Social Science"],
    classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"]
  }
];

const DEFAULT_POSTS: Post[] = [
  {
    id: "p1",
    title: "Admissions Open for Academic Session 2026-27",
    description: "Registration forms are now available for nursery to Class 11 at the school office and online portal. Please submit the completed registration form with necessary documents including birth certificate, last year report card, and Aadhar card before the end of this month. Entrance evaluation schedules will be shared via email.",
    date: "2026-06-30",
    attachmentName: "admissions_guidelines_2026.pdf",
    attachmentUrl: "#",
    authorId: "admin",
    authorName: "Admin (School Office)"
  },
  {
    id: "p2",
    title: "International Yoga Day Celebration at PKLJSVM",
    description: "Our school successfully celebrated International Yoga Day with active participation from all classes (Class 1 to 12). Under the guidance of our Yoga Acharya, students performed various asanas and pranayamas. The principal highlighted the importance of integrating yoga and meditation into daily routines for mental focus and physical fitness.",
    date: "2026-06-21",
    attachmentName: "yoga_day_circular.pdf",
    attachmentUrl: "#",
    authorId: "admin",
    authorName: "Admin (School Office)"
  },
  {
    id: "p3",
    title: "UP Board & CBSE Class 10/12 Toppers Felicitated",
    description: "We are proud to announce that students of Premwati Kunji Lal Jain Saraswati Vidhya Mandir have secured outstanding scores in this year's Senior Secondary board examinations. A felicitation ceremony was organized in the school assembly hall to award gold medals and scholarships to state and district merit holders. Congratulations to all students and dedicated teachers!",
    date: "2026-06-15",
    authorId: "t3",
    authorName: "Shri Keshav Dutt"
  },
  {
    id: "p4",
    title: "Summer Vacation Homework & Syllabus Revision",
    description: "As the summer vacation concludes, all students are advised to complete their assigned homework portfolios. Teachers will review the assignments in the first week of school reopenings. Weekly syllabus outlines and class tests will begin from mid-July.",
    date: "2026-06-10",
    attachmentName: "summer_vacation_rules.pdf",
    attachmentUrl: "#",
    authorId: "admin",
    authorName: "Admin (School Office)"
  }
];

const DEFAULT_SYLLABUS: SyllabusItem[] = [
  {
    id: "s1",
    title: "Class 10 Mathematics Board Exam Syllabus",
    classLevel: "Class 10",
    subject: "Mathematics",
    fileName: "class_10_maths_syllabus_2026.pdf",
    fileUrl: "#",
    authorId: "t1",
    authorName: "Mr. Ramesh Sharma"
  },
  {
    id: "s2",
    title: "Class 12 Physics Theory & Practical Syllabus",
    classLevel: "Class 12",
    subject: "Physics",
    fileName: "class_12_physics_syllabus_2026.pdf",
    fileUrl: "#",
    authorId: "t1",
    authorName: "Mr. Ramesh Sharma"
  },
  {
    id: "s3",
    title: "Class 9 General Science Curriculum (Physics/Chem/Bio)",
    classLevel: "Class 9",
    subject: "Science",
    fileName: "class_9_science_syllabus.pdf",
    fileUrl: "#",
    authorId: "t2",
    authorName: "Mrs. Sunita Verma"
  },
  {
    id: "s4",
    title: "Class 11 Chemistry Term-1 & Term-2 Blueprint",
    classLevel: "Class 11",
    subject: "Chemistry",
    fileName: "class_11_chemistry_syllabus.pdf",
    fileUrl: "#",
    authorId: "t2",
    authorName: "Mrs. Sunita Verma"
  },
  {
    id: "s5",
    title: "Class 8 Sanskrit Grammar & Literature Syllabus",
    classLevel: "Class 8",
    subject: "Sanskrit",
    fileName: "class_8_sanskrit_vedas_syllabus.pdf",
    fileUrl: "#",
    authorId: "t3",
    authorName: "Shri Keshav Dutt"
  },
  {
    id: "s6",
    title: "Class 12 Hindi Literature and Vyakaran Syllabus",
    classLevel: "Class 12",
    subject: "Hindi",
    fileName: "class_12_hindi_vyakaran.pdf",
    fileUrl: "#",
    authorId: "t3",
    authorName: "Shri Keshav Dutt"
  }
];

const DEFAULT_HOMEWORK: HomeworkItem[] = [
  {
    id: "h1",
    title: "Quadratic Equations Practice Set - Class 10",
    classLevel: "Class 10",
    subject: "Mathematics",
    description: "Solve Exercise 4.1 to 4.4 from NCERT Textbook. Write step-by-step proofs for the quadratic formula derivations on your homework registry. Submit before Monday morning.",
    dueDate: "2026-07-10",
    fileName: "maths_quadratic_assignment.pdf",
    fileUrl: "#",
    authorId: "t1",
    authorName: "Mr. Ramesh Sharma"
  },
  {
    id: "h2",
    title: "Ray Optics Numerical Worksheets - Class 12",
    classLevel: "Class 12",
    subject: "Physics",
    description: "Complete the numerical problems on Lens Maker's formula, total internal reflection, and prism dispersion from the PDF worksheet attached. Draw neat ray diagrams.",
    dueDate: "2026-07-12",
    fileName: "ray_optics_numerical_problems.pdf",
    fileUrl: "#",
    authorId: "t1",
    authorName: "Mr. Ramesh Sharma"
  },
  {
    id: "h3",
    title: "Atomic Structure & Chemical Bonding Assignment",
    classLevel: "Class 9",
    subject: "Science",
    description: "Define Rutherford's alpha particle scattering model and list its main limitations. Draw electron dot structures for Water (H2O), Carbon Dioxide (CO2), and Sodium Chloride (NaCl).",
    dueDate: "2026-07-09",
    authorId: "t2",
    authorName: "Mrs. Sunita Verma"
  },
  {
    id: "h4",
    title: "Sanskrit Shloka Recitation and Meaning Portfolio",
    classLevel: "Class 10",
    subject: "Sanskrit",
    description: "Memorize 5 Shlokas from Gita (Chapter 2) emphasizing Duty (Karma). Write the Sanskrit verses in clean Devanagari script along with their literal Hindi and English interpretations in your portfolio.",
    dueDate: "2026-07-15",
    fileName: "gita_shloka_templates.pdf",
    fileUrl: "#",
    authorId: "t3",
    authorName: "Shri Keshav Dutt"
  }
];

const DEFAULT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: "sub1",
    name: "Alok Dwivedi",
    email: "alok.dwivedi@gmail.com",
    phone: "9555123456",
    message: "Namaste, I want to ask about the school bus route options for Sector Chi, Greater Noida. My daughter is studying in Class 5. Please let me know the availability and monthly charges.",
    date: "2026-07-01",
    status: "new"
  },
  {
    id: "sub2",
    name: "Priyanka Singh",
    email: "priyanka.singh90@outlook.com",
    phone: "9123456789",
    message: "Greetings, when will the board exam admit cards be distributed for Class 12 improvement papers? Is there any pending fee clearing checklist required?",
    date: "2026-07-03",
    status: "read"
  }
];

// Helper functions to manage localStorage data
export class SchoolDB {
  static init() {
    if (!localStorage.getItem('pkljsvm_posts')) {
      localStorage.setItem('pkljsvm_posts', JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem('pkljsvm_syllabus')) {
      localStorage.setItem('pkljsvm_syllabus', JSON.stringify(DEFAULT_SYLLABUS));
    }
    if (!localStorage.getItem('pkljsvm_homework')) {
      localStorage.setItem('pkljsvm_homework', JSON.stringify(DEFAULT_HOMEWORK));
    }
    if (!localStorage.getItem('pkljsvm_teachers')) {
      localStorage.setItem('pkljsvm_teachers', JSON.stringify(DEFAULT_TEACHERS));
    }
    if (!localStorage.getItem('pkljsvm_submissions')) {
      localStorage.setItem('pkljsvm_submissions', JSON.stringify(DEFAULT_SUBMISSIONS));
    }
    if (!localStorage.getItem('pkljsvm_static_content')) {
      localStorage.setItem('pkljsvm_static_content', JSON.stringify(DEFAULT_STATIC_CONTENT));
    }
  }

  // Posts
  static getPosts(): Post[] {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_posts') || '[]');
  }
  static savePosts(posts: Post[]) {
    localStorage.setItem('pkljsvm_posts', JSON.stringify(posts));
  }

  // Syllabus
  static getSyllabus(): SyllabusItem[] {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_syllabus') || '[]');
  }
  static saveSyllabus(syllabus: SyllabusItem[]) {
    localStorage.setItem('pkljsvm_syllabus', JSON.stringify(syllabus));
  }

  // Homework
  static getHomework(): HomeworkItem[] {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_homework') || '[]');
  }
  static saveHomework(homework: HomeworkItem[]) {
    localStorage.setItem('pkljsvm_homework', JSON.stringify(homework));
  }

  // Teachers
  static getTeachers(): Teacher[] {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_teachers') || '[]');
  }
  static saveTeachers(teachers: Teacher[]) {
    localStorage.setItem('pkljsvm_teachers', JSON.stringify(teachers));
  }

  // Submissions
  static getSubmissions(): ContactSubmission[] {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_submissions') || '[]');
  }
  static saveSubmissions(subs: ContactSubmission[]) {
    localStorage.setItem('pkljsvm_submissions', JSON.stringify(subs));
  }

  // Static Content
  static getStaticContent(): StaticContent {
    this.init();
    return JSON.parse(localStorage.getItem('pkljsvm_static_content') || JSON.stringify(DEFAULT_STATIC_CONTENT));
  }
  static saveStaticContent(content: StaticContent) {
    localStorage.setItem('pkljsvm_static_content', JSON.stringify(content));
  }
}
