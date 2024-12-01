import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-learning-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-sidebar.component.html',
  styleUrl: './learning-sidebar.component.css'
})
export class LearningSidebarComponent {
  @Input() hidden = false;
  @Output() toggle = new EventEmitter<void>();
  
  selectedButton: string = 'calendar';
  isMobile = false;
  searchQuery: string = '';
  totalCourses: number = 7;
  selectedFilter: string = 'All';

  courses = [
    {
      timeLeft: '58 Min Left',
      title: 'Re-branding Discussion',
      description: 'Discussion on re-branding of demo Brand',
      date: '23 Mar 2024',
      time: '1:30 pm'
    },
    {
      timeLeft: '58 Min Left',
      title: 'Re-branding Discussion',
      description: 'Discussion on re-branding of demo Brand',
      date: '23 Mar 2024',
      time: '1:30 pm'
    },
    {
      timeLeft: '58 Min Left',
      title: 'Re-branding Discussion',
      description: 'Discussion on re-branding of demo Brand',
      date: '23 Mar 2024',
      time: '1:30 pm'
    },
    {
      timeLeft: '58 Min Left',
      title: 'Re-branding Discussion',
      description: 'Discussion on re-branding of demo Brand',
      date: '23 Mar 2024',
      time: '1:30 pm'
    }
  ];

  sidebarButtons = [
    { name: 'calendar', label: 'Calender', icon: 'calendar_today', link: '/learning/calendar' },
    { name: 'board', label: 'Board', icon: 'dashboard', link: '/learning/test' },
    { name: 'overview', label: 'overview', icon: 'shopping_cart', link: '/learning/overview' },
    { name: 'learning', label: 'learning', icon: 'school', link: '/learning/courses' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  toggleSidebar(): void {
    this.toggle.emit();
  }

  clickSideButton(button: string): void {
    this.selectedButton = button;
  }
}