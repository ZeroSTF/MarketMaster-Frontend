import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LearningService } from '../../../../services/learning.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { UserProgress } from '../../../../models/learning.model';
import { AuthService } from '../../../../auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-learning-course',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-course.component.html',
  styleUrl: './learning-course.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class LearningCourseComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  currentSectionIndex = 1;
  selectedText = '';
  showExplanation = false;
  isLoading = false;
  chatMessages: { role: 'user' | 'assistant'; content: string }[] = [];
  tooltipPosition = { x: 0, y: 0 };
  showTooltip = false;
  error: string | null = null;

  newMessage = '';
  private router = inject(Router);
  private learningService = inject(LearningService);
  private authService = inject(AuthService);
  private httpClient = inject(HttpClient)

  sections = this.learningService.sections;
  courseTitle = this.learningService.courseTitle;
  courses = this.learningService.courses;

  @HostListener('document:selectionchange', ['$event'])
  onSelectionChange() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.tooltipPosition = {
        x: rect.left + (rect.width / 2),
        y: rect.bottom + 10
      };

      this.selectedText = selection.toString().trim();
      this.showTooltip = true;
    } else {
      this.showTooltip = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Hide tooltip if clicking outside
    if (!event.target || !(event.target as Element).closest('.tooltip-container')) {
      this.showTooltip = false;
    }
  }

  

  

  nextSection() {
    console.log('Starting nextSection()', {
      currentIndex: this.currentSectionIndex,
      totalSections: this.sections()?.length
    });
  
    if (this.sections() && this.currentSectionIndex < this.sections().length - 1) {
     
      // Get course progress
      this.learningService.getCourseProgress(this.courseTitle()).subscribe({
        next: (progressList) => {
          const userProgress = progressList.length > 0 ? progressList[0] : null;
  
          if (userProgress) {
            // Determine the section corresponding to progress percentage
            const progressSection = Math.floor(userProgress.progress / 10);
  
            if (this.currentSectionIndex > progressSection) {
              console.log('Updating progress for new section', {
                currentIndex: this.currentSectionIndex,
                progressSection: progressSection,
                oldProgress: userProgress.progress,
                newProgress: (this.currentSectionIndex) * 10
              });
  
              const updatedProgress: Partial<UserProgress> = {
                course: userProgress.course,
                user: userProgress.user,
                progress: (this.currentSectionIndex) * 10,
                lastAccessed: new Date().toISOString()
              };
  
              this.learningService.updateCourse(updatedProgress);
            } else {
              console.log('No progress update needed - section already completed');
            }
          } 
  
          this.currentSectionIndex++;
          this.resetChat();
        },
        error: (error) => console.error('Error getting course progress:', error)
      });
    }
  }
  

  previousSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.resetChat();
    }
  }
  takeExam() {
    this.router.navigate(['/learning/test']);
  }

  private resetChat() {
    this.showExplanation = false;
    this.chatMessages = [];
  }

  async ngOnInit() {}

  async explainSelection() {
    if (!this.selectedText) return;

    this.isLoading = true;
    this.showTooltip = false;
    this.showExplanation = true;

    try {
      // Send the selected text to Hugging Face model
      const response = await this.sendMessageToApi(this.selectedText);

      // Add user and assistant messages
      this.chatMessages.push(
        { role: 'user', content: `Explain: "${this.selectedText}"` },
        { role: 'assistant', content: response }
      );

      // Scroll to the bottom of the chat container
      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop =
            this.chatContainer.nativeElement.scrollHeight;
        }
      });
    } catch (error) {
      console.error('Failed to get explanation:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async sendMessageToApi(message: string): Promise<string> {
    const url = 'https://api-inference.huggingface.co/models/gpt2';
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer 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', // Replace with your Hugging Face API token
      'Content-Type': 'application/json',
    });
  
    const body = {
      inputs: message, // Directly passing the message here
    };
  
    try {
      const response: any = await this.httpClient.post(url, body, { headers }).toPromise();
      console.log('Response from API:', response); // Debugging
  
      if (response && response[0]?.generated_text) {
        return response[0].generated_text; // Assuming response contains a generated text
      } else {
        throw new Error('No valid response from API');
      }
    } catch (error) {
      console.error('Error sending message to API:', error);
      return 'Error processing your request';
    }
  }
  
  
  
  
  

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.isLoading = true;

    // Add user message to chat
    this.chatMessages.push({
      role: 'user',
      content: this.newMessage
    });

    // Clear input
    this.newMessage = '';

    // Send the message to the API and get the response
    this.sendMessageToApi(this.newMessage).then(response => {
      // Add assistant's response to chat
      this.chatMessages.push({
        role: 'assistant',
        content: response
      });

      this.isLoading = false;

      // Scroll to the bottom of the chat container
      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop =
            this.chatContainer.nativeElement.scrollHeight;
        }
      });
    });
  } 

  toggleExplanation() {
    this.showExplanation = !this.showExplanation;
  }
}