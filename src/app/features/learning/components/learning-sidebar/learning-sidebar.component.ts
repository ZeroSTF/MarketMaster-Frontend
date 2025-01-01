import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
  
  selectedButton: string = 'overview';
  isMobile = false;
  searchQuery: string = '';
  totalCourses: number = 7;
  selectedFilter: string = 'All';
  showSearch = true;

  

  sidebarButtons = [
    { name: 'calendar', label: 'Calender', icon: 'calendar_today', link: '/learning/calendar' },
    { name: 'board', label: 'Skill Test', icon: 'dashboard', link: '/learning/test' },
    { name: 'overview', label: 'overview', icon: 'shopping_cart', link: '/learning/overview' },
    { name: 'learning', label: 'learning', icon: 'school', link: '/learning/course' }
  ];

  constructor(private breakpointObserver: BreakpointObserver , private router: Router) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
    

  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check the current route
        this.showSearch = !event.url.includes('/calendar');
      }
    });
  }

  toggleSidebar(): void {
    this.toggle.emit();
  }

  clickSideButton(button: string): void {
    this.selectedButton = button;
  }
  isCalendarPath(): boolean {
    return this.router.url === '/calendar';
  }
}