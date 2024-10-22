import { Injectable, signal } from '@angular/core';
import { Course } from '../models/learning.model';
declare const responsiveVoice: any; // For TTS
declare const annyang: any; // For STT

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  courses = signal<Course[]>([]);

  constructor() {
    this.loadMockCourses(); 
  }

  // Speak the question using ResponsiveVoice TTS
  speak(text: string) {
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

  private onSpeechEndCallback: Function | null = null;

  onSpeechEnd(callback: Function) {
    this.onSpeechEndCallback = callback;
  }

  // Start listening for the user's response using Annyang STT
  startListening(callback: (response: string) => void) {
    if (annyang) {
      const commands = {
        '*answer': (answer: string) => {
          console.log('Recognized answer:', answer);
          callback(answer); // Pass the captured answer to the provided callback
        }
      };
      annyang.addCommands(commands); 
      annyang.start({ autoRestart: true, continuous: false }); // Ensure continuous listening
      console.log('Listening for answer...');
    } else {
      console.error('Annyang is not available.');
    }
  }

  stopListening() {
    if (annyang) {
      annyang.abort();
      console.log('Stopped listening');
    } else {
      console.error('Annyang is not available.');
    }
  }

  private loadMockCourses(): void {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Technical Analysis 101',
        description: 'Learn the basics of chart patterns and indicators.',
        thumbnailUrl: 'assets/technical-analysis.jpg',
        instructors: [{ id: 'inst1', name: 'John Doe', avatarUrl: 'assets/john.jpg' }],
        duration: 12, // in hours
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
                duration: 30, // in minutes
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
      }
    ];

    this.courses.set(mockCourses);
  }
}
