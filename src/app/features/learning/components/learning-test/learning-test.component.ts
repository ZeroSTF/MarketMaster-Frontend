import { Component, ElementRef, OnInit, ViewChild, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService } from '../../../../services/learning.service';
import * as THREE from 'three';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-test.component.html'
})
export class LearningTestComponent implements OnInit, OnDestroy {
  @ViewChild('userVideo', { static: true }) private userVideo!: ElementRef<HTMLVideoElement>;

  private learningService = inject(LearningService);
  private videoStream: MediaStream | null = null;

  readonly interviewState = computed(() => this.learningService.interviewState());
  readonly currentQuestion = computed(() => this.learningService.currentQuestion());

  

  async ngOnInit() {
    await this.initializeWebcam();
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
  async startInterview() {
    await this.learningService.startInterview();
  }
  ngOnDestroy() {
    this.learningService.stopListening();
    
    }
  submitEditedAnswer() {
    if (this.interviewState().transcript) {
      this.learningService.submitEditedAnswer(this.interviewState().transcript);
    }
  }
  
}