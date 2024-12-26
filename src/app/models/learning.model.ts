// models/course.model.ts

export interface Instructor {
    id: string;
    name: string;
    avatarUrl: string;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    duration: number; // Duration in minutes
    videoUrl: string;
    platform: 'Udemy' | 'YouTube';
    isCompleted: boolean;
  }
  
  export interface Module {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    isCompleted: boolean;
  }
  

  
  export interface Course {
    id: string;
    title: string;
    description: string;
    progress: number;
    duration: number;
    category: string;
    level: string;
    hasCertification?: boolean;
    startDate?: Date;
    imageUrl?: string;
  }