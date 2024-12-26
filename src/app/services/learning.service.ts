import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { Course } from './../models/learning.model';

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

  
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly destroyRef = inject(DestroyRef);
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private silenceTimeout: number | null = null;
  private readonly SILENCE_THRESHOLD = 3000; // Reduced to 3 seconds for better responsiveness
  private readonly MINIMUM_SPEAK_DURATION = 3000;
  private micTestTimeout: any = null;


  // State management
  private state = signal<InterviewState>({
    isActive: false,
    currentQuestionIndex: 0,
    isListening: false,
    isSpeaking: false,
    lastAnswer: '',
    silenceStartTime: null,
    transcript: '',
    microphoneStatus: 'untested'
  });

  private questions = [
    "Tell me about your background in software development.",
    "What's your experience with Angular and TypeScript?",
    "How do you approach problem-solving in complex applications?",
    "Can you describe a challenging project you worked on?",
    "Where do you see yourself in five years?"
  ];

  public readonly currentQuestion = computed(() => 
    this.questions[this.state().currentQuestionIndex]
  );
  
  public readonly interviewState = computed(() => this.state());

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      // Remove automatic mic check from constructor
      this.initializeSpeechRecognition();
    }
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognitionConfig();
      this.setupRecognitionHandlers();
    }
  }

  private setupRecognitionConfig(): void {
    if (!this.recognition) return;
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          console.log('Final transcript:', finalTranscript); // Log final transcript
        } else {
          interimTranscript += transcript;
        }
      }

      // Only update if we have actual content
      if (finalTranscript || interimTranscript) {
        this.updateState({
          lastAnswer: finalTranscript || interimTranscript,
          transcript: interimTranscript,
          silenceStartTime: Date.now()
        });
      }
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      // Only restart if we're still supposed to be listening
      if (this.state().isListening && this.state().isActive) {
        console.log('Restarting speech recognition');
        this.recognition?.start();
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // If no speech is detected, don't immediately stop - give more time
        this.updateState({ silenceStartTime: Date.now() });
      } else {
        this.updateState({ isListening: false });
      }
    };
  }

  public async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.configureUtterance(utterance);

      utterance.onend = () => {
        this.updateState({ isSpeaking: false });
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        this.updateState({ isSpeaking: false });
        reject(error);
      };

      this.updateState({ isSpeaking: true });
      this.synthesis.speak(utterance);
    });
  }

  private configureUtterance(utterance: SpeechSynthesisUtterance): void {
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (this.synthesis) {
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && voice.name.includes('Female')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
  }

  public startListening(): void {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.updateState({ 
      isListening: true,
      silenceStartTime: Date.now()
    });

    try {
      this.recognition.start();
      this.startSilenceDetection();
      console.log('Started listening');
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  }

  private startSilenceDetection(): void {
    const checkSilence = () => {
      const { silenceStartTime, isListening, lastAnswer } = this.state();
      
      if (silenceStartTime && isListening) {
        const silenceDuration = Date.now() - silenceStartTime;
        
        // Only move to next question if we have an answer and silence threshold is met
        if (silenceDuration >= this.SILENCE_THRESHOLD && lastAnswer.trim()) {
          console.log('Moving to next question. Last answer:', lastAnswer);
          this.moveToNextQuestion();
        } else {
          if (this.silenceTimeout) {
            window.clearTimeout(this.silenceTimeout);
          }
          this.silenceTimeout = window.setTimeout(checkSilence, 1000);
        }
      }
    };

    if (this.silenceTimeout) {
      window.clearTimeout(this.silenceTimeout);
    }
    this.silenceTimeout = window.setTimeout(checkSilence, 1000);
  }

  private async moveToNextQuestion(): Promise<void> {
    const currentIndex = this.state().currentQuestionIndex;
    const lastAnswer = this.state().lastAnswer;
    
    console.log(`Completed question ${currentIndex + 1}. Answer:`, lastAnswer);
    
    if (currentIndex < this.questions.length - 1) {
      // Temporarily stop listening while speaking the next question
      this.stopListening();
      
      this.updateState({
        currentQuestionIndex: currentIndex + 1,
        silenceStartTime: null,
        transcript: '',
        lastAnswer: ''
      });
      
      await this.speak(this.questions[currentIndex + 1]);
      
      // Resume listening after speaking
      this.startListening();
    } else {
      await this.endInterview();
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.updateState({ isListening: false });
      if (this.silenceTimeout) {
        window.clearTimeout(this.silenceTimeout);
        this.silenceTimeout = null;
      }
      console.log('Stopped listening');
    }
  }
  

  private async checkMicrophoneAvailability(): Promise<boolean> {
    try {
      // First check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.updateState({ 
          microphoneStatus: 'error',
          microphoneError: 'Your browser doesn\'t support microphone access'
        });
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Test the audio stream
      const audioContext = new AudioContext();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      mediaStreamSource.connect(analyzer);

      // Stop all tracks after testing
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
      
      this.updateState({ 
        microphoneStatus: 'working',
        microphoneError: undefined 
      });
      
      return true;
    } catch (error: any) {
      console.error('Microphone access error:', error);
      this.updateState({ 
        microphoneStatus: 'error',
        microphoneError: this.getDetailedErrorMessage(error)
      });
      return false;
    }
  }

  public async testMicrophone(): Promise<boolean> {
    // First check basic microphone availability
    const micAvailable = await this.checkMicrophoneAvailability();
    if (!micAvailable) {
      return false;
    }

    return new Promise((resolve) => {
      if (!('webkitSpeechRecognition' in window)) {
        this.updateState({ 
          microphoneStatus: 'error',
          microphoneError: 'Speech recognition not supported in this browser'
        });
        resolve(false);
        return;
      }

      let hasDetectedSound = false;
      const testRecognition = new (window as any).webkitSpeechRecognition();
      
      testRecognition.continuous = false; // Changed to false for testing
      testRecognition.interimResults = true;

      testRecognition.onstart = () => {
        console.log('Mic test started - please speak something...');
        // Increased timeout for more reliable testing
        this.micTestTimeout = setTimeout(() => {
          testRecognition.stop();
          if (!hasDetectedSound) {
            this.updateState({ 
              microphoneStatus: 'error',
              microphoneError: 'No speech detected. Please check your microphone.'
            });
            resolve(false);
          }
        }, 7000); // Increased to 7 seconds
      };

      testRecognition.onresult = (event: any) => {
        hasDetectedSound = true;
        console.log('Speech detected during test:', event.results[0][0].transcript);
        this.updateState({ 
          microphoneStatus: 'working',
          microphoneError: undefined
        });
        clearTimeout(this.micTestTimeout);
        testRecognition.stop();
        resolve(true);
      };

      testRecognition.onerror = (event: any) => {
        console.error('Mic test error:', event.error);
        this.updateState({ 
          microphoneStatus: 'error',
          microphoneError: this.getDetailedErrorMessage(event.error)
        });
        clearTimeout(this.micTestTimeout);
        resolve(false);
      };

      try {
        testRecognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        this.updateState({ 
          microphoneStatus: 'error',
          microphoneError: 'Failed to start speech recognition'
        });
        resolve(false);
      }
    });
  }

  private getDetailedErrorMessage(error: string): string {
    switch (error) {
      case 'no-speech':
        return 'No speech was detected. Please check if your microphone is working and try speaking again.';
      case 'audio-capture':
        return 'No microphone was found. Please ensure a microphone is connected and permitted.';
      case 'not-allowed':
        return 'Microphone access was denied. Please allow microphone access in your browser settings.';
      case 'network':
        return 'Network error occurred. Please check your internet connection.';
      default:
        return `Microphone error: ${error}`;
    }
  }

  public async startInterview(): Promise<void> {
    // Clear any previous state
    this.updateState({
      isActive: false,
      currentQuestionIndex: 0,
      lastAnswer: '',
      transcript: '',
      microphoneError: undefined
    });

    try {
      const micWorking = await this.testMicrophone();
      
      if (!micWorking) {
        console.error('Cannot start interview: Microphone not working');
        return;
      }

      this.updateState({
        isActive: true,
        currentQuestionIndex: 0
      });

      // Small delay before starting to ensure everything is initialized
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.speak("Hello, first question.");
      await this.speak(this.questions[0]);
      this.startListening();
    } catch (error) {
      console.error('Error starting interview:', error);
      this.updateState({ 
        microphoneStatus: 'error',
        microphoneError: 'Failed to start interview. Please try again.'
      });
    }
  }

  private async endInterview(): Promise<void> {
    this.stopListening();
    await this.speak("Thank you, goodbye.");
    this.updateState({
      isActive: false,
      currentQuestionIndex: 0,
      transcript: '',
      lastAnswer: ''
    });
  }

  private updateState(newState: Partial<InterviewState>): void {
    this.state.update(state => ({
      ...state,
      ...newState
    }));
  }
  

  // Public signals and computed values
  public readonly courses = computed(() => this.coursesData());

  // Course management methods
  public updateCourseProgress(courseId: string, progress: number): void {
    this.coursesData.update(courses => 
      courses.map(course => 
        course.id === courseId 
          ? { ...course, progress } 
          : course
      )
    );
  }

  public addCourse(course: Course): void {
    this.coursesData.update(courses => [...courses, course]);
  }

  public removeCourse(courseId: string): void {
    this.coursesData.update(courses => 
      courses.filter(course => course.id !== courseId)
    );
  }

  private coursesData = signal<Course[]>([
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 100,
      duration: 120,
      category: 'frontend',
      level: 'beginner',
      hasCertification: true,
      imageUrl: 'path/to/angular-image.jpg',
      startDate: new Date('2024-01-01')
    },
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 100,
      duration: 120,
      category: 'frontend',
      level: 'beginner',
      hasCertification: true,
      imageUrl: 'path/to/angular-image.jpg',
      startDate: new Date('2024-01-01')
    },
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 100,
      duration: 120,
      category: 'frontend',
      level: 'beginner',
      hasCertification: true,
      imageUrl: 'path/to/angular-image.jpg',
      startDate: new Date('2024-01-01')
    },
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 100,
      duration: 120,
      category: 'frontend',
      level: 'beginner',
      hasCertification: true,
      imageUrl: 'path/to/angular-image.jpg',
      startDate: new Date('2024-01-01')
    },
    {
      id: '4',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 10,
      duration: 120,
      category: 'frontend',
      level: 'beginner',
      hasCertification: true,
      imageUrl: 'path/to/angular-image.jpg',
      startDate: new Date('2024-01-01')
    },
    {
      id: '5',
      title: 'Advanced TypeScript',
      description: 'Master TypeScript features and patterns',
      progress: 60,
      duration: 180,
      category: 'programming',
      level: 'advanced',
      hasCertification: false,
      imageUrl: 'path/to/typescript-image.jpg',
      startDate: new Date('2024-02-01')
    },
    {
      id: '3',
      title: 'Web Development Basics',
      description: 'Introduction to web development',
      progress: 0,
      duration: 90,
      category: 'frontend',
      level: 'beginner',
      hasCertification: false,
      imageUrl: 'path/to/webdev-image.jpg',
      startDate: new Date('2024-03-01')
    }
  ]);
}
