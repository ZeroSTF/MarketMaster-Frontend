import { Component, ElementRef, OnInit, ViewChild, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService } from '../../../../services/learning.service';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface Course {
hasCertification: any;
startDate: string|number|Date;
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
}

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-test.component.html'
})
export class LearningTestComponent implements OnInit, OnDestroy {
  @ViewChild('avatarCanvas', { static: true }) private avatarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userVideo', { static: true }) private userVideo!: ElementRef<HTMLVideoElement>;

  private interviewService = inject(LearningService);
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private avatar: THREE.Group | null = null;
  private animationMixer: THREE.AnimationMixer | null = null;
  private videoStream: MediaStream | null = null;

  // Reactive state
  readonly interviewState = computed(() => this.interviewService.interviewState());
  readonly currentQuestion = computed(() => this.interviewService.currentQuestion());

  constructor() {
    effect(() => {
      const { isSpeaking } = this.interviewState();
      if (this.avatar && this.animationMixer) {
        // Toggle speaking animation based on state
      }
    });
  }

  async ngOnInit() {
    await this.initializeWebcam();
    await this.initializeAvatar();
  }

  private async initializeWebcam() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      this.userVideo.nativeElement.srcObject = this.videoStream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  }

  private async initializeAvatar() {
    // Basic Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.avatarCanvas.nativeElement.clientWidth / this.avatarCanvas.nativeElement.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.avatarCanvas.nativeElement,
      alpha: true
    });
    
    this.renderer.setSize(
      this.avatarCanvas.nativeElement.clientWidth,
      this.avatarCanvas.nativeElement.clientHeight
    );

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1);
    this.scene.add(directionalLight);

    // Position camera
    this.camera.position.z = 5;

    try {
      // Dynamically import GLTFLoader
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      
      const gltf = await loader.loadAsync('/assets/avatar.glb');
      this.avatar = gltf.scene;
      
      if (this.avatar) {
        this.scene.add(this.avatar);
        
        if (gltf.animations.length > 0) {
          this.animationMixer = new THREE.AnimationMixer(this.avatar);
          // Set up animations here if needed
        }
      }
    } catch (error) {
      console.error('Error loading avatar model:', error);
    }

    this.animate();
  }

  private animate() {
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (this.animationMixer) {
        this.animationMixer.update(0.016); // Assume 60fps
      }
      
      this.renderer.render(this.scene, this.camera);
    };
    
    animate();
  }

  async startInterview() {
    await this.interviewService.startInterview();
  }

  ngOnDestroy() {
    this.interviewService.stopListening();
    
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    
    // Clean up Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      this.scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    }
  }
}