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
    try {
      this.faceState.update(state => ({ ...state, isLoading: true, error: null }));
      
      // Load models first
      await this.loadFaceApiModels();
      
      // Then initialize webcam
      await this.initializeWebcam();
      
      // Wait for video to be ready
      await this.waitForVideo();
      
      // Start detection
      this.startFaceDetection();
      
      // Capture reference after detection is running
      await this.captureReferenceImage();
      
      this.faceState.update(state => ({ ...state, isLoading: false }));
    } catch (error) {
      console.error('Initialization error:', error);
      this.faceState.update(state => ({
        ...state,
        isLoading: false,
        error: 'Failed to initialize face detection. Please ensure camera access is allowed.'
      }));
    }
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
    this.isDetecting = false;
    this.videoStream?.getTracks().forEach(track => track.stop());
  }

  submitEditedAnswer() {
    if (this.interviewState().transcript) {
      this.learningService.submitEditedAnswer(this.interviewState().transcript);
    }
  }

  async startInterview() {
    await this.learningService.startInterview();
  }
}