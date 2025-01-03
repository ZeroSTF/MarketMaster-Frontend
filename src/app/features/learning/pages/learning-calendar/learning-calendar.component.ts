import { Component, computed, effect, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventDropArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
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

  private transformCoursesToEvents(courses: UserProgress[]): CalendarEvent[] {
    return courses.map((course) => this.createEventFromCourse(course));
  }

  private createEventFromCourse(userProgress: UserProgress): CalendarEvent {
    const { course } = userProgress;
    const duration =
      userProgress.endDate && userProgress.startDate
        ? new Date(userProgress.endDate).getTime() -
          new Date(userProgress.startDate).getTime()
        : 0;

    return {
      id: course.title,
      title: course.title,
      start: userProgress.startDate
        ? new Date(userProgress.startDate)
        : undefined,
      end: userProgress.endDate ? new Date(userProgress.endDate) : undefined,
      backgroundColor: this.getEventColor(userProgress.progress),
      borderColor: this.getEventColor(userProgress.progress),
      textColor: 'white',
      extendedProps: {
        description: course.description,
        progress: userProgress.progress,
        level: course.level,
        duration,
        category: course.category,
        courseId: course.title,
      },
    };
  }

  handleEventDrop(info: EventDropArg): void {
    try {
      const { event } = info;
      const courseId = event.extendedProps['courseId'];
      const startDate = event.start;

      if (!courseId || !startDate) {
        throw new Error('Missing required event data');
      }

      const userProgress = this.courses().find(
        (up) => up.course.title === courseId
      );
      if (!userProgress) {
        throw new Error(`Course not found: ${courseId}`);
      }

      const duration =
        userProgress.endDate && userProgress.startDate
          ? new Date(userProgress.endDate).getTime() -
            new Date(userProgress.startDate).getTime()
          : 0;
      const endDate = new Date(startDate.getTime() + duration);

      this.learningService.updateCourse({
        ...userProgress,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        lastAccessed: this.shouldUpdateLastAccessed(userProgress.progress)
          ? startDate.toISOString()
          : userProgress.lastAccessed,
      });
    } catch (error) {
      console.error('Error handling event drop:', error);
      info.revert();
    }
  }

  handleExternalDrop(info: ExternalDropInfo): void {
    try {
      const courseId = info.draggedEl.getAttribute('data-course-id');
      if (!courseId || !info.date) {
        throw new Error('Invalid drop data');
      }

      const userProgress = this.courses().find(
        (up) => up.course.title === courseId
      );
      if (!userProgress) {
        throw new Error(`Course not found: ${courseId}`);
      }

      const dropDate = info.date.toISOString();
      const duration =
        userProgress.endDate && userProgress.startDate
          ? new Date(userProgress.endDate).getTime() -
            new Date(userProgress.startDate).getTime()
          : 7 * 24 * 60 * 60 * 1000; // Default 7 days

      const endDate = new Date(info.date.getTime() + duration);

      this.learningService.updateCourse({
        ...userProgress,
        startDate: dropDate,
        endDate: endDate.toISOString(),
        lastAccessed: this.shouldUpdateLastAccessed(userProgress.progress)
          ? dropDate
          : userProgress.lastAccessed,
      });
    } catch (error) {
      console.error('Error handling external drop:', error);
    }
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
  
        console.log('Progress updated successfully.');
      }
    } else {
      this.resumeCourse(course);  // Continue the course if not completed
    }
  }
  
  
  
  

  private shouldUpdateLastAccessed(progress: number): boolean {
    return progress > 0 && progress < 100;
  }

  renderEventContent = (info: any) => ({
    html: `
      <div class="p-2">
        <div class="font-medium text-sm">${info.event.title}</div>
        <div class="text-xs mt-1">Progress: ${info.event.extendedProps.progress}%</div>
      </div>
    `,
  });

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

  onDragStart(event: DragEvent, course: UserProgress) {
    console.log('course:', course);
    this.isDragging.set(true);
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', course.course.title);
      const element = event.target as HTMLElement;
      element.setAttribute('data-course-id', course.course.title);
      event.dataTransfer.effectAllowed = 'move';
      console.log('after course:', course);
      if (course.startDate == '') this.startCourse(course);
    }
  }

  onDragEnd() {
    this.isDragging.set(false);
  }

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

  isStartDateValid(course: any): boolean {
    return course.startDate && !isNaN(new Date(course.startDate).getTime());
  }

  // Resume course
  resumeCourse(course: UserProgress): void {
    console.log('Resuming course:', course.course.title);
    this.learningService.loadSections(course.course.title);
    this.router.navigate(['/learning/course']);
  }

  // Redo course
  redoCourse(course: any): void {
    console.log('Redoing course:', course);
    // Logic to redo the course, like resetting progress
    course.progress = '0.0%';
  }

  // Select start date (open date picker logic)
  selectStartDate(course: any): void {
    console.log('Selecting start date for course:', course);
    // Open a calendar/date picker here to set the start date
  }
}
