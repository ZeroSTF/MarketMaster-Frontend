import { EventInput } from '@fullcalendar/core/index.js';
import { User } from './user.model';


  
  export interface Course {
    title: string;
    description: string;
    category: string;
    level: string;
    color?: string;
    status: 'not-started' | 'in-progress' | 'completed';
  }
  export interface UserProgress {
    progressId?: number;
    course: Course;
    user: User;
    completed: boolean;
    score: number | null;
    progress: number;
    lastAccessed: string;
    startDate: string;
    endDate: string | null;
    isExpanded?: boolean;

  }
  
  export interface Section {
    section: number;
    sectionContent: string;
    sectionTitle: string;
  }
  export interface CourseJson {
    courseTitle: string;
    sections: Section[];
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
  export interface ExternalDropInfo {
    draggedEl: HTMLElement;
    date: Date;
  }
  export interface CalendarEvent extends EventInput {
    extendedProps: CourseEventProps;
  }

  //video
  export interface FraudState {
    isMultipleUsers: boolean;
    isFaceVerified: boolean;
    error?: string;
  }

  export interface OpenAIResponse {
    choices: { message: { content: string } }[];
  }
  