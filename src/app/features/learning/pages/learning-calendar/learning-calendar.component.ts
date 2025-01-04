import { Component, computed, effect, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventDropArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningService } from '../../../../services/learning.service';
import {
  UserProgress,
  ExternalDropInfo,
  CalendarEvent,
} from '../../../../models/learning.model';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-learning-calendar',
  standalone: true,
  imports: [FullCalendarModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-calendar.component.html',
  styleUrl: './learning-calendar.component.css',
})
export class LearningCalendarComponent {
  private learningService = inject(LearningService);
  private authService = inject(AuthService)
  private router = inject(Router);

  searchQuery = signal('');
  activeFilter = signal('all');
  isDragging = signal(false);
  calendarEvents = signal<CalendarEvent[]>([]);
  errorMessage = signal<string | null>(null);

  courses = this.learningService.courses;
  user = this.authService.currentUser

  filters = [
    { name: 'all', label: 'All Courses', icon: 'view_list' },
    { name: 'inProgress', label: 'In Progress', icon: 'pending' },
    { name: 'completed', label: 'Completed', icon: 'task_alt' },
  ];

  private baseCalendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    editable: true,
    droppable: true,
    height: '100%',
    eventDrop: this.handleEventDrop.bind(this),
    eventReceive: this.handleEventReceive.bind(this),
    eventClick: this.handleEventClick.bind(this),
    
  };

  // Calendar options computed signal
  calendarOptions = computed(() => ({
    ...this.baseCalendarOptions,
    events: this.transformCoursesToEvents(this.courses()),
    eventContent: this.renderEventContent,
  }));

  constructor() {
    effect(() => {
      const events = this.transformCoursesToEvents(this.courses());
      this.calendarEvents.set(events);
    });
  }


  async handleEventDrop(info: EventDropArg): Promise<void> {
    const { event } = info;
    const courseId = event.extendedProps['courseId'];
    const startDate = event.start;
  
    if (!courseId || !startDate) {
      info.revert();
      return;
    }
  
    try {
      const duration = event.end 
        ? event.end.getTime() - event.start.getTime()
        : 24 * 60 * 60 * 1000; // Default to 1 day if no end date
  
      const confirmed = await this.learningService.verifyAndUpdateCourseProgress(
        courseId,
        startDate,
        duration
      );
  
      if (!confirmed) {
        info.revert();
      }
    } catch (error) {
      console.error('Error handling event drop:', error);
      info.revert();
    }
  }

  private transformCoursesToEvents(courses: UserProgress[]): CalendarEvent[] {
    return courses.map(course => ({
      id: course.course.title,
      title: course.course.title,
      start: course.startDate ? new Date(course.startDate) : undefined,
      end: course.endDate ? new Date(course.endDate) : undefined,
      backgroundColor: this.getEventColor(course.progress),
      borderColor: this.getEventColor(course.progress),
      textColor: 'white',
      extendedProps: {
        description: course.course.description,
        progress: course.progress,
        level: course.course.level,
        duration: course.endDate && course.startDate
          ? new Date(course.endDate).getTime() - new Date(course.startDate).getTime()
          : 0,
        category: course.course.category,
        courseId: course.course.title,
      },
    }));
  }

  private getEventColor(progress: number): string {
    if (progress === 0) return '#6B7280';
    if (progress === 100) return '#059669';
    return '#3B82F6';
  }


  handleEventReceive(info: any): void {
    console.log('Event received:', info);
  }

  handleEventClick(info: any): void {
    const courseId = info.event.extendedProps.courseId;
    const course = this.courses().find((c) => c.course.title === courseId);
  
    if (!course) {
      console.warn('Course not found.');
      return;
    }
  
    const currentUser = this.user();
  
    if (!currentUser) {
      console.error('User is not logged in.');
      return;
    }
  
    if (course.progress === 100) {
      const confirmed = confirm('Course already completed. Do you want to redo it?');
      if (confirmed) {
        const updatedProgress: UserProgress = {
          ...course,
          progress: 0,
          startDate: new Date().toISOString(),
          score: 0,  
          completed: false 
        };
  
        this.learningService.updateCourse(updatedProgress);
  
        this.resumeCourse(course);
      }
    } else {
      this.resumeCourse(course);
    }
  }
  
  
  
  


  renderEventContent = (info: any) => ({
    html: `
      <div class="p-2">
        <div class="font-medium text-sm">${info.event.title}</div>
        <div class="text-xs mt-1">Progress: ${info.event.extendedProps.progress}%</div>
      </div>
    `,
  });

  

  filteredCourses = computed(() => {
    const currentFilter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();

    return this.courses().filter((course) => {
      const now = new Date().getTime();
      const courseStartDate = new Date(course.startDate).getTime();

      const matchesFilter =
        currentFilter === 'all' ||
        (currentFilter === 'inProgress' &&
          course.progress >= 0 &&
          course.progress < 100 &&
          course.startDate !== '') ||
        (currentFilter === 'coming' && courseStartDate > now) ||
        (currentFilter === 'completed' && course.progress === 100);

      const matchesSearch =
        !query ||
        (course.course.title?.toLowerCase()?.includes(query) ?? false) ||
        (course.course.description?.toLowerCase()?.includes(query) ?? false) ||
        (course.course.category?.toLowerCase()?.includes(query) ?? false) ||
        (course.course.level?.toLowerCase()?.includes(query) ?? false);

      return matchesFilter && matchesSearch;
    });
  });

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Search query updated:', value);

    this.searchQuery.set(value);
  }

  setActiveFilter(filterName: string) {
    this.activeFilter.set(filterName);
  }


  startCourse(course: UserProgress, startDate?: string): void {
    if (!course.course.title) {
      console.error('Course title is required to start the course');
      return;
    }

    console.log('Starting course:', {
      courseTitle: course.course.title,
      startDate,
    });

    this.learningService.startCourse(course.course.title).subscribe({
      next: (userProgress: UserProgress) => {
        console.log('Course started successfully:', userProgress);

        if (startDate) {
          console.log('Updating course dates:', { startDate });
          this.learningService.updateCourse({
            ...userProgress,
            startDate,
            lastAccessed: startDate,
          });
        }

        this.learningService.loadSections(course.course.title);
        this.router.navigate(['/course']);
      },
      error: (error) => {
        console.error('Error starting course:', {
          courseTitle: course.course.title,
          error,
        });
        alert('Failed to start the course. Please try again.');
      },
    });
  }

  // Resume course
  resumeCourse(course: UserProgress): void {
    this.learningService.loadSections(course.course.title);
    this.router.navigate(['/learning/course']);
  }

  // Redo course
  redoCourse(course: any): void {
    console.log('Redoing course:', course);
    course.progress = '0.0%';
  }

  
}
