import { Component, ElementRef, OnInit, ViewChild, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import * as faceapi from '@vladmandic/face-api';
import { LearningService } from '../../../../services/learning.service';
import { FormsModule } from '@angular/forms';

interface FaceDetectionState {
  faceCount: number;
  isMatching: boolean;
  matchScore: number | null;
  detectionActive: boolean;
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgClass],
  templateUrl: './learning-test.component.html'
})
export class LearningTestComponent implements OnInit, OnDestroy {
  @ViewChild('userVideo', { static: true }) private userVideo!: ElementRef<HTMLVideoElement>;
  private videoStream: MediaStream | null = null;
  private isDetecting = false;
  private referenceDescriptor: Float32Array | null = null;
  private modelsLoaded = false;
  private isSpeaking = false;

  
  // Reactive state using signals
  faceState = signal<FaceDetectionState>({
    faceCount: 0,
    isMatching: false,
    matchScore: null,
    detectionActive: false,
    isLoading: true,
    error: null
  });
  
  private learningService = inject(LearningService);
  public courseTitle = this.learningService.courseTitle();
  readonly interviewState = computed(() => this.learningService.interviewState());
  readonly currentQuestion = computed(() => this.learningService.currentQuestion());

  async ngOnInit() {
    // Start avatar animations first
    this.initializeAvatar();
    
    try {
      this.faceState.update(state => ({ ...state, isLoading: true, error: null }));
      
      // Initialize face detection components in parallel
      await Promise.all([
        this.loadFaceApiModels(),
        this.initializeWebcam()
      ]);
      
      await this.waitForVideo();
      
      this.startFaceDetection();
      await this.captureReferenceImage();
      
      this.faceState.update(state => ({ ...state, isLoading: false }));
      
      // Initial greeting using the unified speaking system
      await this.handleSpeech("Hello, are you ready to start the interview");
      
    } catch (error) {
      console.error('Initialization error:', error);
      this.faceState.update(state => ({
        ...state,
        isLoading: false,
        error: 'Failed to initialize face detection. Please ensure camera access is allowed.'
      }));
    }
  }

  // Unified speech handling method
  private async handleSpeech(text: string): Promise<void> {
    if (!text || this.isSpeaking) return;

    try {
      this.isSpeaking = true;
      
      // Start mouth animation
      this.startMouthAnimation();
      
      // Use learning service to handle the speech
      await this.learningService.speak(text);
      
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      // Always cleanup, even if there's an error
      this.stopMouthAnimation();
      this.isSpeaking = false;
    }
  }

  private startMouthAnimation() {
    // Clear any existing animation
    this.stopMouthAnimation();
    
    let open = false;
    this.mouthAnimationInterval = setInterval(() => {
      // Use more natural mouth movements with varying degrees of opening
      const mouthHeight = open ? Math.random() * 20 + 190 : 180; // Random height when open
      this.mouthPath.set(`M 90 180 Q 150 ${mouthHeight} 210 180`);
      open = !open;
    }, 100); // Slightly faster animation for more natural movement
  }
  
  private initializeAvatar() {
    // Clear any existing intervals first
    clearInterval(this.blinkInterval);
    clearInterval(this.mouthAnimationInterval);
    
    // Start blinking animation
    this.startBlinking();
    
    // Reset mouth to neutral position
    this.mouthPath.set('M 90 180 Q 150 180 210 180');
    
    // Reset eyes to normal state
    this.eyesTransform.set('scale(1 1)');
  }
  
  private startBlinking() {
    // Random blink interval between 2 and 6 seconds
    const getRandomBlinkInterval = () => Math.random() * (6000 - 2000) + 2000;
    
    const blink = () => {
      this.eyesTransform.set('scale(1 0.1)');
      setTimeout(() => this.eyesTransform.set('scale(1 1)'), 150);
      
      // Set next blink with random interval
      this.blinkInterval = setTimeout(blink, getRandomBlinkInterval());
    };
    
    // Start first blink after a random interval
    this.blinkInterval = setTimeout(blink, getRandomBlinkInterval());
  }
  
  



  private async waitForVideo(): Promise<void> {
    const video = this.userVideo.nativeElement;
    if (video.readyState === 4) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      video.onloadeddata = () => resolve();
    });
  }

  private async loadFaceApiModels() {
    try {
      const modelPath = '/models'; // Updated path
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
      ]);
      
      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      this.faceState.update(state => ({
        ...state,
        isLoading: false,
        error: 'Failed to load face detection models. Please check your internet connection.'
      }));
      throw error;
    }
  }

  private async initializeWebcam() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      const video = this.userVideo.nativeElement;
      video.srcObject = this.videoStream;
      video.play();
      
      console.log('Webcam initialized successfully');
    } catch (err) {
      console.error('Error accessing webcam:', err);
      throw new Error('Failed to access webcam');
    }
  }

  private async captureReferenceImage() {
    if (!this.modelsLoaded) {
      throw new Error('Face detection models not loaded');
    }

    try {
      const video = this.userVideo.nativeElement;
      // Wait for video dimensions
      await new Promise<void>((resolve) => {
        if (video.videoWidth === 0) {
          video.addEventListener('loadedmetadata', () => resolve());
        } else {
          resolve();
        }
      });

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detection) {
        this.referenceDescriptor = detection.descriptor;
        console.log('Reference face captured successfully');
      } else {
        console.log('No face detected for reference image');
      }
    } catch (error) {
      console.error('Error capturing reference image:', error);
      throw new Error('Failed to capture reference image');
    }
  }

  private async startFaceDetection() {
    if (!this.modelsLoaded) {
      console.error('Cannot start detection: Models not loaded');
      return;
    }
  
    this.isDetecting = true;
    const video = this.userVideo.nativeElement;
  
    const detectFaces = async () => {
      // Fix the condition by properly grouping the logical operators
      if (!this.isDetecting || video.readyState !== 4) return;
  
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
          .withFaceLandmarks()
          .withFaceDescriptors();
  
        this.faceState.update(state => ({
          ...state,
          faceCount: detections.length,
          detectionActive: true,
          isLoading: false,
          error: null
        }));
  
        // Match with reference if available
        if (detections.length === 1 && this.referenceDescriptor) {
          const currentDescriptor = detections[0].descriptor;
          const distance = faceapi.euclideanDistance(this.referenceDescriptor, currentDescriptor);
          const matchScore = 1 - distance;
          
          this.faceState.update(state => ({
            ...state,
            isMatching: matchScore > 0.6,
            matchScore
          }));
        }
  
      } catch (error) {
        console.error('Error in face detection:', error);
        // Don't update error state here to avoid flickering
      }
  
      if (this.isDetecting) {
        requestAnimationFrame(detectFaces);
      }
    };
  
    detectFaces();
  }

  async retakeReference() {
    if (this.modelsLoaded) {
      await this.captureReferenceImage();
    }
  }

  ngOnDestroy() {
    clearInterval(this.blinkInterval);
    clearInterval(this.mouthAnimationInterval);
    this.isDetecting = false;
    this.videoStream?.getTracks().forEach(track => track.stop());
    window.speechSynthesis.cancel();
  }

  submitEditedAnswer() {
    if (this.interviewState().transcript) {
      this.learningService.submitEditedAnswer(this.interviewState().transcript);
    }
  }

  async startInterview() {
    await this.learningService.startInterview();
  }

  //avatar
  private mouthPath = signal('M 90 180 Q 150 180 210 180');
  private eyesTransform = signal('translate(0 0)');
  private mouthAnimationInterval: any;
  private blinkInterval: any;

  // Computed values for template
  mouthPathValue = computed(() => this.mouthPath());
  eyesTransformValue = computed(() => this.eyesTransform());

  
  
  // private startMouthAnimation() {
  //   // Clear any existing animation
  //   clearInterval(this.mouthAnimationInterval);
    
  //   let open = false;
  //   this.mouthAnimationInterval = setInterval(() => {
  //     this.mouthPath.set(open
  //       ? 'M 90 180 Q 150 180 210 180'  // closed
  //       : 'M 90 180 Q 150 210 210 180'  // open
  //     );
  //     open = !open;
  //   }, 150);
  // }
  
  private stopMouthAnimation() {
    clearInterval(this.mouthAnimationInterval);
    this.mouthPath.set('M 90 180 Q 150 180 210 180');
  }
  
  

  

  
}