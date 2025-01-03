import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LearningService } from '../../../../services/learning.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

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

  currentSectionIndex = 0;
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
  sections = this.learningService.sections;
  courseTitle = this.learningService.courseTitle;

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

  

  async ngOnInit() {
    console.log('Component initializing' , this.courseTitle());
    
    
  }

  nextSection() {
    if (this.sections() && this.currentSectionIndex < this.sections().length - 1) {
      this.currentSectionIndex++;
      this.resetChat();
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

  async explainSelection() {
    if (!this.selectedText) return;

    this.isLoading = true;
    this.showTooltip = false;
    this.showExplanation = true;

    try {
      // Simulated response for now
      const simulatedResponse = `Here's an explanation about: "${this.selectedText}"
      
This is a placeholder response that will be replaced with actual API integration. The explanation would typically provide context and clarification about the selected text within the current section.`;

      this.chatMessages.push(
        { role: 'user', content: `Explain: "${this.selectedText}"` },
        { role: 'assistant', content: simulatedResponse }
      );

      // Scroll to bottom of chat
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
  sendMessage() {
    if (!this.newMessage.trim()) return;
    
    this.isLoading = true;
    
    // Add user message
    this.chatMessages.push({
      role: 'user',
      content: this.newMessage
    });

    // Clear input
    this.newMessage = '';

    // Simulate AI response - replace with actual API call later
    setTimeout(() => {
      this.chatMessages.push({
        role: 'assistant',
        content: 'This is a simulated response. Replace this with actual API integration.'
      });
      
      this.isLoading = false;
      
      // Scroll to bottom
      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = 
            this.chatContainer.nativeElement.scrollHeight;
        }
      });
    }, 1000);
  }  

  toggleExplanation() {
    this.showExplanation = !this.showExplanation;
  }
}