import { computed, DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';
import { Course, Module } from '../models/learning.model';
interface SpeechConfig {
  onend?: () => void;
}
declare const responsiveVoice: any;
declare const annyang: any;
// Type for speech callback
type SpeechCallback = (response: string) => void;

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly destroyRef = inject(DestroyRef);  // Make the signal public and readonly
  public readonly courses = signal<readonly Course[]>([]);
  
  // Computed signals for common filters
  public readonly completedCourses = computed(() => 
    this.courses().filter(course => course.progress === 100)
  );

  public readonly ongoingCourses = computed(() => 
    this.courses().filter(course => course.progress > 0 && course.progress < 100)
  );

  public readonly pendingTasks = computed(() => 
    this.courses().reduce(
      (sum, course) => sum + course.modules.filter((module: Module) => !module.isCompleted).length,
      0
    )
  );

  // Private properties with clear typing
  private readonly onSpeechEndCallback = signal<(() => void) | null>(null);

  constructor() {
    this.initializeCourses();
  }

  public async speak(text: string): Promise<void> {
    if (window.hasOwnProperty('responsiveVoice')) {
      (window as any).responsiveVoice.speak(text, null, {
        onend: () => {
          if (this.onSpeechEndCallback) {
            this.onSpeechEndCallback();
          }
        }
      });
    } else {
      console.error('ResponsiveVoice is not available.');
    }
  }

  public startListening(callback: SpeechCallback): void {
    try {
      if (!this.isAnnyangAvailable()) {
        throw new Error('Annyang is not available');
      }

      const commands = {
        '*answer': (answer: string) => {
          console.log('Recognized answer:', answer);
          callback(answer);
        }
      };

      annyang.addCommands(commands);
      annyang.start({ autoRestart: true, continuous: false });
    } catch (error) {
      console.error('Speech recognition failed:', error);
      throw error;
    }
  }

  public stopListening(): void {
    if (this.isAnnyangAvailable()) {
      annyang.abort();
    }
  }

  // Private helper methods
  private initializeCourses(): void {
    const mockCourses: readonly Course[] = [
      {
        id: '1',
        title: 'Technical Analysis 101',
        description: 'Learn the basics of chart patterns and indicators.',
        thumbnailUrl: 'assets/technical-analysis.jpg',
        instructors: [{ id: 'inst1', name: 'John Doe', avatarUrl: 'assets/john.jpg' }],
        duration: 12,
        platform: 'Udemy',
        modules: [
          {
            id: 'mod1',
            title: 'Intro to Charts',
            description: 'Get introduced to chart patterns.',
            lessons: [
              {
                id: 'lesson1',
                title: 'Candlestick Basics',
                duration: 30,
                videoUrl: 'https://www.youtube.com/watch?v=example',
                platform: 'YouTube',
                isCompleted: false,
              }
            ],
            isCompleted: false,
          }
        ],
        category: 'Trading',
        level: 'Beginner',
        rating: 4.5,
        isEnrolled: true,
        progress: 0,
        releaseDate: new Date('2023-10-01'),
      },
      {
        id: '1',
        title: 'Technical Analysis 101',
        description: 'Learn the basics of chart patterns and indicators.',
        thumbnailUrl: 'assets/technical-analysis.jpg',
        instructors: [{ id: 'inst1', name: 'John Doe', avatarUrl: 'assets/john.jpg' }],
        duration: 12,
        platform: 'Udemy',
        modules: [
          {
            id: 'mod1',
            title: 'Intro to Charts',
            description: 'Get introduced to chart patterns.',
            lessons: [
              {
                id: 'lesson1',
                title: 'Candlestick Basics',
                duration: 30,
                videoUrl: 'https://www.youtube.com/watch?v=example',
                platform: 'YouTube',
                isCompleted: false,
              }
            ],
            isCompleted: true,
          }
        ],
        category: 'Trading',
        level: 'Beginner',
        rating: 4.5,
        isEnrolled: true,
        progress: 0,
        releaseDate: new Date('2023-10-01'),
      }
    ];

    this.courses.set(mockCourses);
  }

  private isResponsiveVoiceAvailable(): boolean {
    return 'responsiveVoice' in window;
  }

  private isAnnyangAvailable(): boolean {
    return typeof annyang !== 'undefined';
  }
}