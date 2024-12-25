import { Course } from './../models/learning.model';
import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';


export interface InterviewState {
  isActive: boolean;
  currentQuestionIndex: number;
  isListening: boolean;
  isSpeaking: boolean;
  lastAnswer: string;
  silenceStartTime: number | null;
  transcript: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly destroyRef = inject(DestroyRef);
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private silenceTimeout: number | null = null;
  private readonly SILENCE_THRESHOLD = 10000; // 10 seconds

  // State management
  private state = signal<InterviewState>({
    isActive: false,
    currentQuestionIndex: 0,
    isListening: false,
    isSpeaking: false,
    lastAnswer: '',
    silenceStartTime: null,
    transcript: ''
  });

  // Questions array
  private questions = [
    "Tell me about your background in software development.",
    "What's your experience with Angular and TypeScript?",
    "How do you approach problem-solving in complex applications?",
    "Can you describe a challenging project you worked on?",
    "Where do you see yourself in five years?"
  ];

  // Public computed values
  public readonly currentQuestion = computed(() => 
    this.questions[this.state().currentQuestionIndex]
  );
  
  public readonly interviewState = computed(() => this.state());

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
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
        } else {
          interimTranscript += transcript;
        }
      }

      this.updateState({
        lastAnswer: finalTranscript || interimTranscript,
        transcript: interimTranscript,
        silenceStartTime: Date.now()
      });
    };

    this.recognition.onend = () => {
      if (this.state().isListening) {
        this.recognition?.start();
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.updateState({ isListening: false });
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

    this.recognition.start();
    this.startSilenceDetection();
  }

  private startSilenceDetection(): void {
    const checkSilence = () => {
      const { silenceStartTime, isListening } = this.state();
      
      if (silenceStartTime && isListening) {
        const silenceDuration = Date.now() - silenceStartTime;
        
        if (silenceDuration >= this.SILENCE_THRESHOLD) {
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
    
    if (currentIndex < this.questions.length - 1) {
      this.updateState({
        currentQuestionIndex: currentIndex + 1,
        silenceStartTime: null,
        transcript: '',
        lastAnswer: ''
      });
      
      await this.speak(this.questions[currentIndex + 1]);
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
    }
  }

  public async startInterview(): Promise<void> {
    this.updateState({
      isActive: true,
      currentQuestionIndex: 0,
      lastAnswer: '',
      transcript: ''
    });

    await this.speak("Hello! I'm your AI interviewer. Let's begin with the first question.");
    await this.speak(this.questions[0]);
    this.startListening();
  }

  private async endInterview(): Promise<void> {
    this.stopListening();
    await this.speak("Thank you for completing the interview. We'll be in touch soon.");
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

  // Sample courses data
  private coursesData = signal<Course[]>([
    {
      id: '1',
      title: 'Angular Fundamentals',
      description: 'Learn the basics of Angular framework',
      progress: 100,
      duration: 120,
      category: 'frontend',
      level: 'beginner'
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      description: 'Master TypeScript features and patterns',
      progress: 60,
      duration: 180,
      category: 'programming',
      level: 'advanced'
    },
    {
      id: '3',
      title: 'Web Development Basics',
      description: 'Introduction to web development',
      progress: 0,
      duration: 90,
      category: 'frontend',
      level: 'beginner'
    }
  ]);

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
}