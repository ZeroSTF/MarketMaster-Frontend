import { Component, inject } from '@angular/core';
import { LearningService } from '../../../../services/learning.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learning-test',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './learning-test.component.html',
  styleUrl: './learning-test.component.css'
})
export class LearningTestComponent {
  currentQuestion: string = '';
  questions = ['What is a stock?', 'Explain market trends.'];
  capturedAnswer: string = ''; 
  isRecording: boolean = false;

  private learningService =inject(LearningService);

  startTest() {
    this.askQuestion(1);
  }

  askQuestion(index: number) {
    this.currentQuestion = this.questions[index];
    this.learningService.speak(this.currentQuestion);
  }

  startRecording() {
    this.isRecording = true;
    this.listenForAnswer();
  }

  stopRecording() {
    this.isRecording = false;
    this.learningService.stopListening();
  }

  listenForAnswer() {
    this.learningService.startListening((answer) => {
      console.log('Captured Answer:', answer);
      this.capturedAnswer = answer;
      this.stopRecording();
    });
  }
}

