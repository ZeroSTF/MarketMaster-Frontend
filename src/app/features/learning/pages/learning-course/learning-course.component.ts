import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LearningService } from '../../../../services/learning.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-learning-course',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule ],
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
      const prompt = `Explain: "${this.selectedText}"`;
      const apiResponse = await this.learningService.sendMessageToApi(prompt);
      
      // Add user's selected text to chat
      this.chatMessages.push({
        role: "user",
        content: this.selectedText
      });
  
      // Handle the API response
      let explanation = 'No explanation available.';
      
      if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0) {
        // Handle array response
        const responseText = apiResponse[0].generated_text;
        if (responseText) {
          // Remove the original prompt and clean up the explanation
          explanation = responseText
            .replace(prompt, '')
            .trim()
            // Remove any leading/trailing quotation marks
            .replace(/^["']|["']$/g, '')
            // Remove any leading/trailing whitespace or newlines
            .trim();
            
          if (!explanation) {
            explanation = 'No explanation available.';
          }
        }
      } else if (apiResponse?.generated_text) {
        // Handle direct object response
        explanation = apiResponse.generated_text
          .replace(prompt, '')
          .trim()
          .replace(/^["']|["']$/g, '')
          .trim();
      }
  
      // Add AI response to chat
      this.chatMessages.push({
        role: "assistant",
        content: explanation
      });
  
      // Scroll to bottom
      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = 
            this.chatContainer.nativeElement.scrollHeight;
        }
      });
    } catch (error) {
      console.error("Failed to get explanation:", error);
      this.chatMessages.push({
        role: "assistant",
        content: "I apologize, but I encountered an error while generating the explanation. Please try again."
      });
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
    const userMessage = this.newMessage;
    this.newMessage = '';
  
    // Call the API to fetch the assistant's response
    this.learningService.sendMessageToApi(userMessage)
      .then((apiResponse) => {
        // Handle the API response
        let assistantMessage = 'No response from AI.';
        
        if (apiResponse && Array.isArray(apiResponse) && apiResponse.length > 0) {
          // Handle array response
          const responseText = apiResponse[0]?.generated_text;
          if (responseText) {
            assistantMessage = responseText;
          }
        } else if (apiResponse?.generated_text) {
          // Handle direct object response
          assistantMessage = apiResponse.generated_text;
        }
  
        // Add assistant response to chat
        this.chatMessages.push({
          role: 'assistant',
          content: assistantMessage
        });
  
        // Scroll to bottom
        setTimeout(() => {
          if (this.chatContainer) {
            this.chatContainer.nativeElement.scrollTop = 
              this.chatContainer.nativeElement.scrollHeight;
          }
        });
  
        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Failed to get AI response:", error);
        this.chatMessages.push({
          role: 'assistant',
          content: "I apologize, but I encountered an error while generating the response. Please try again."
        });
  
        this.isLoading = false;
      });
  }
    

  toggleExplanation() {
    this.showExplanation = !this.showExplanation;
  }
}