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
  
  // export interface Course {
  //   id: string;
  //   title: string;
  //   description: string;
  //   thumbnailUrl: string;
  //   instructors: Instructor[];
  //   duration: number; // Duration in hours
  //   platform: 'Udemy' | 'YouTube';
  //   modules: Module[];
  //   category: string;
  //   level: 'Beginner' | 'Intermediate' | 'Advanced';
  //   rating: number; // 0 - 5 rating
  //   isEnrolled: boolean;
  //   progress: number; // 0 - 100 percentage
  //   releaseDate: Date;
  // }
  
  export interface Course {
    id: string;
    title: string;
    description: string;
    progress: number;
    duration: number;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
  }