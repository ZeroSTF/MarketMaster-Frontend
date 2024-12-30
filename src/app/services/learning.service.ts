import { environment } from './../../environments/environment';
import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { Course, InterviewState, UserProgress } from './../models/learning.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private readonly destroyRef = inject(DestroyRef);
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private silenceTimeout: number | null = null;
  private readonly SILENCE_THRESHOLD = 3000;
  private readonly MINIMUM_SPEAK_DURATION = 3000;
  private micTestTimeout: any = null;
  private readonly apiUrl = environment.apiUrl;


  constructor(private http: HttpClient , private authService: AuthService) {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.initializeSpeechRecognition();
    }
    this.fetchCourses();    
  }

//courses
  private readonly _courses = signal<UserProgress[]>([]);
  public readonly courses = computed(() => this._courses());


  private fetchCourses(): void {
    const user = this.authService.currentUser();
    if (!user) {
      console.error('Username is required to fetch courses.');
      return;
    }
  
    this.http.get<Course[]>(`${this.apiUrl}/courses`).subscribe({
      next: (allCourses) => {
        this.http.get<UserProgress[]>(`${this.apiUrl}/courses/${user.username}/progress`).subscribe({
          next: (userProgress) => {
            const enrichedCourses: UserProgress[] = allCourses.map(course => {
              const existingProgress = userProgress.find(p => p.course.title === course.title);
              return existingProgress || {
                course: course,
                User: user,
                completed: false,
                progress: 0,
                score: null,
                lastAccessed: "",
                startDate: "",
                endDate: null
              };
            });
            this._courses.set(enrichedCourses);
          },
          error: (error) => {
            console.error('Error fetching user progress:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
  public startCourse(courseTitle: string): Observable<UserProgress> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to start a course');
    }
    const params = new HttpParams().set('username', user.username);
    console.log('Starting course');
    return this.http.post<UserProgress>(
      `${this.apiUrl}/courses/${courseTitle}/progress`,
      null, 
      { params }
    );
  }
  



  
  public updateCourseStartDate(courseId: string, newDate: Date): Observable<UserProgress> {
    return this.http.put<UserProgress>(`${this.apiUrl}/${courseId}`, { startDate: newDate });
  }

  public updateCourseProgress(courseId: string, userId: string, progress: String): Observable<UserProgress> {
    const progressDTO = { progress };
    return this.http.put<UserProgress>(`${this.apiUrl}/${courseId}/progress/${userId}`, progressDTO);
  }

  public getAllUserProgress(userId: string): Observable<UserProgress[]> {
    return this.http.get<UserProgress[]>(`${this.apiUrl}/${userId}/progress`);
  }

  public getCourse(courseTitle: string): UserProgress | undefined {
    return this._courses().find((course) => course.course.title === courseTitle);
  }

   

  //test logic
   private state = signal<InterviewState>({
    isActive: false,
    currentQuestionIndex: 0,
    isListening: false,
    isSpeaking: false,
    lastAnswer: '',
    silenceStartTime: null,
    transcript: '',
    microphoneStatus: 'untested',
  });

  private questions = [
    'Tell me about your background in software development.',
    "What's your experience with Angular and TypeScript?",
    'How do you approach problem-solving in complex applications?',
    'Can you describe a challenging project you worked on?',
    'Where do you see yourself in five years?',
  ];

  public readonly currentQuestion = computed(
    () => this.questions[this.state().currentQuestionIndex]
  );

  public readonly interviewState = computed(() => this.state());


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
        transcript: finalTranscript || interimTranscript,
        silenceStartTime: null, // Prevent auto-progression when editing
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
    const preferredVoice = voices.find(
      (voice) => voice.lang === 'en-US' && voice.name.includes('Female')
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
    silenceStartTime: Date.now(),
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

      // Give more time to edit before auto-progression
      if (
        silenceDuration >= this.SILENCE_THRESHOLD + 5000 &&
        lastAnswer.trim()
      ) {
        this.moveToNextQuestion();
      } else {
        if (this.silenceTimeout) {
          window.clearTimeout(this.silenceTimeout);
        }
        this.silenceTimeout = window.setTimeout(checkSilence, 2000); // Increased check interval
      }
    }
  };

  if (this.silenceTimeout) {
    window.clearTimeout(this.silenceTimeout);
  }
  this.silenceTimeout = window.setTimeout(checkSilence, 2000);
}



private async checkMicrophoneAvailability(): Promise<boolean> {
  try {
    // First check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.updateState({
        microphoneStatus: 'error',
        microphoneError: "Your browser doesn't support microphone access",
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
    stream.getTracks().forEach((track) => track.stop());
    audioContext.close();

    this.updateState({
      microphoneStatus: 'working',
      microphoneError: undefined,
    });

    return true;
  } catch (error: any) {
    console.error('Microphone access error:', error);
    this.updateState({
      microphoneStatus: 'error',
      microphoneError: this.getDetailedErrorMessage(error),
    });
    return false;
  }
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

private async endInterview(): Promise<void> {
  this.stopListening();
  await this.speak('Thank you, goodbye.');
  this.updateState({
    isActive: false,
    currentQuestionIndex: 0,
    transcript: '',
    lastAnswer: '',
  });
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
  private updateState(newState: Partial<InterviewState>): void {
    this.state.update((state) => ({
      ...state,
      ...newState,
    }));
  }
  public async testMicrophone(): Promise<boolean> {
    const micAvailable = await this.checkMicrophoneAvailability();
    if (!micAvailable) {
      return false;
    }

    return new Promise((resolve) => {
      if (!('webkitSpeechRecognition' in window)) {
        this.updateState({
          microphoneStatus: 'error',
          microphoneError: 'Speech recognition not supported in this browser',
        });
        resolve(false);
        return;
      }

      let hasDetectedSound = false;
      const testRecognition = new (window as any).webkitSpeechRecognition();

      testRecognition.continuous = false;
      testRecognition.interimResults = true;

      testRecognition.onstart = () => {
        console.log('Mic test started - please speak something...');
        this.micTestTimeout = setTimeout(() => {
          testRecognition.stop();
          if (!hasDetectedSound) {
            this.updateState({
              microphoneStatus: 'error',
              microphoneError:
                'No speech detected. Please check your microphone.',
            });
            resolve(false);
          }
        }, 7000);
      };

      testRecognition.onresult = (event: any) => {
        hasDetectedSound = true;
        console.log(
          'Speech detected during test:',
          event.results[0][0].transcript
        );
        this.updateState({
          microphoneStatus: 'working',
          microphoneError: undefined,
        });
        clearTimeout(this.micTestTimeout);
        testRecognition.stop();
        resolve(true);
      };

      testRecognition.onerror = (event: any) => {
        console.error('Mic test error:', event.error);
        this.updateState({
          microphoneStatus: 'error',
          microphoneError: this.getDetailedErrorMessage(event.error),
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
          microphoneError: 'Failed to start speech recognition',
        });
        resolve(false);
      }
    });
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
  submitEditedAnswer(answer: string) {
    this.updateState({
      lastAnswer: answer,
      transcript: '',
      isListening: false,
    });
    this.moveToNextQuestion();
  }

  public async moveToNextQuestion(): Promise<void> {
    const currentIndex = this.state().currentQuestionIndex;

    if (currentIndex < this.questions.length - 1) {
      this.stopListening();

      this.updateState({
        currentQuestionIndex: currentIndex + 1,
        silenceStartTime: null,
        transcript: '',
      });

      await this.speak(this.questions[currentIndex + 1]);
      this.startListening();
    } else {
      await this.endInterview();
    }
  }

  //video

  private readonly D_ID_API_KEY = 'your_api_key';
  private readonly D_ID_API_URL = 'https://api.d-id.com';

  private async createTalkingVideo(text: string): Promise<string> {
    const response = await fetch(`${this.D_ID_API_URL}/talks`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.D_ID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
        },
        source_url: 'YOUR_PRESENTER_IMAGE_URL',
        driver_url: 'bank://presenter/driver',
        config: {
          stitch: true,
        },
      }),
    });

    const { id } = await response.json();
    return this.waitForVideo(id);
  }

  private async waitForVideo(talkId: string): Promise<string> {
    while (true) {
      const response = await fetch(`${this.D_ID_API_URL}/talks/${talkId}`, {
        headers: { Authorization: `Basic ${this.D_ID_API_KEY}` },
      });

      const result = await response.json();
      if (result.status === 'done') {
        return result.result_url;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
