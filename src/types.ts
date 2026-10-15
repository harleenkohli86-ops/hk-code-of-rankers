export type PageId =
  | 'home'
  | 'about-hk'
  | 'founder'
  | 'vision-mission'
  | 'why-choose'
  | 'programs'
  | 'cseet'
  | 'cs-executive'
  | 'cs-professional'
  | 'career-counselling'
  | 'test-series'
  | 'results'
  | 'testimonials'
  | 'resources'
  | 'blog'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'forum'
  | 'admin'
  | 'student-portal';

export interface Testimonial {
  id: string;
  name: string;
  rank?: string;
  course: string;
  score?: string;
  image: string;
  quote: string;
  rating: number;
  highlight: string;
}

export interface ResultRanker {
  id: string;
  name: string;
  air: string;
  exam: string;
  attempt: string;
  photo: string;
  story: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'Aspirant' | 'Mentor';
  authorAvatar: string;
  examStage?: string;
  category: 'Company Law' | 'Tax Laws' | 'Jurisprudence' | 'CSEET' | 'CS Professional' | 'Exam Strategy' | 'General';
  upvotes: number;
  hasUpvoted?: boolean;
  timestamp: string;
  repliesCount: number;
  replies: ForumReply[];
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  author: string;
  authorRole: 'Aspirant' | 'Mentor';
  authorAvatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isVerifiedAnswer?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: 'Study Tips' | 'Time Management' | 'Company Law' | 'Exam Strategy' | 'Updates';
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Notes' | 'Amendments' | 'Past Papers' | 'Study Planner' | 'ICSI Scanners';
  exam: 'CSEET' | 'CS Executive' | 'CS Professional' | 'All';
  fileSize: string;
  downloads: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'CSEET' | 'CS Executive' | 'CS Professional' | 'Test Series' | 'Mentorship';
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  badge?: string;
  type: 'course' | 'test-series' | 'combo' | 'mentorship';
  level: 'cseet' | 'g1' | 'g2' | 'both' | 'professional' | 'executive';
  modules?: CourseModule[];
  selectedProgram?: string;
  selectedSubjects?: string[];
  pricePerSubject?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessonsCount: number;
  resourcesCount: number;
  lessons: LessonItem[];
}

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'mock-test' | 'evaluation';
  resourceUrl?: string;
  isFreePreview?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  studentId?: string;
  fullName: string;
  email: string;
  phone: string;
  targetExam: string;
  program?: string;
  level?: string;
  group?: string;
  avatar?: string;
  purchasedProductIds: string[];
  createdAt: string;
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  registrationStatus?: 'pending_approval' | 'approved' | 'rejected';
  paymentStatus?: 'unpaid' | 'pending_approval' | 'approved' | 'rejected';
  mentorshipAccess?: boolean;
  studyIndexAccess?: boolean;
  assignedIndexId?: string;
  approvedAt?: string;
  role?: 'student' | 'admin';
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  userId: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'EMI';
  utrNumber?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'PENDING_APPROVAL';
  createdAt: string;
  approvedAt?: string;
  emailSentAt?: string;
  billingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export interface StudyScheduleItem {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  dueDate: string;
}

export type AspirantTask = StudyScheduleItem;

export interface MockTestResult {
  id: string;
  testName: string;
  date: string;
  score: number;
  totalMarks: number;
  rankInBatch: number;
  evaluatorFeedback: string;
}
