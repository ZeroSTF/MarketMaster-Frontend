import { User } from './user.model';


  
  export interface Course {
    title: string;
    description: string;
    category: string;
    level: string;
    hasCertification?: boolean;
    startDate: Date;
    endDate?: Date;
    imageUrl?: string;
    color?: string;
    status: 'not-started' | 'in-progress' | 'completed';
  }
  export interface UserProgress {
    course: Course;
    User: User;
    completed: boolean;
    score: number | null;
    progress: number;
    lastAccessed: string;
    startDate: string;
    endDate: string | null;
  }
  

  export interface InterviewState {
    isActive: boolean;
    currentQuestionIndex: number;
    isListening: boolean;
    isSpeaking: boolean;
    lastAnswer: string;
    silenceStartTime: number | null;
    transcript: string;
    microphoneStatus: 'untested' | 'working' | 'error';
    microphoneError?: string;
    currentVideoUrl?: string; // Add this
  
  
    
  }

  //calendar
  export interface CourseEventProps {
    description: string;
    progress: number;
    level: string;
    duration: number;
    category: string;
    courseId: string;
  }