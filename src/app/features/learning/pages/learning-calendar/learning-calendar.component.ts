import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventDropArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningService } from '../../../../services/learning.service';
import { Course } from '../../../../models/learning.model';

interface CourseEventProps {
  description: string;
  progress: number;
  level: string;
  duration: number;
  category: string;
  courseId: string;
}

@Component({
  selector: 'app-learning-calendar',
  standalone: true,
  imports: [FullCalendarModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-calendar.component.html',
  styleUrl: './learning-calendar.component.css'
})
export class LearningCalendarComponent  {
  private learningService = inject(LearningService);
  searchQuery = signal('');
  activeFilter = signal('all');
  isDragging = signal(false);

  filters = [
    { name: 'all', label: 'All Courses', icon: 'view_list' },
    { name: 'inProgress', label: 'In Progress', icon: 'pending' },
    { name: 'completed', label: 'Completed', icon: 'task_alt' }
  ];
  courses = this.learningService.courses;


  private baseCalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    editable: true,
    droppable: true,
    height: '100%',
  };

  calendarOptions = computed(() => {
    console.log('Courses data updated:', this.courses());
    
    return {
      ...this.baseCalendarOptions,
      events: this.courses().map(course => ({
        title: course.course.title,
        start: new Date(course.startDate),
        backgroundColor: this.getEventColor(course.progress),
        borderColor: this.getEventColor(course.progress),
        textColor: 'white',
        extendedProps: {
          courseId: course.course.description,
          progress: course.progress
        }
      })),
      eventDrop: this.handleEventDrop.bind(this),
      drop: this.handleExternalDrop.bind(this),
      eventContent: this.renderEventContent
    } satisfies CalendarOptions;
  });

  private getEventColor(progress: number): string {
    if (progress === 0) return '#6B7280';
    if (progress === 100) return '#059669';
    return '#3B82F6';
  }

  handleEventDrop(info: EventDropArg) {
    const courseId = info.event.extendedProps['courseId'];
    if (courseId && info.event.start) {
      this.learningService.updateCourseStartDate(courseId, info.event.start);
    }
  }

  handleExternalDrop(info: any) {
    const courseId = info.draggedEl.getAttribute('data-course-id');
    if (courseId && info.date) {
      this.learningService.updateCourseStartDate(courseId, info.date);
    }
  }

  renderEventContent = (info: any) => ({
    html: `
      <div class="p-2">
        <div class="font-medium text-sm">${info.event.title}</div>
        <div class="text-xs mt-1">Progress: ${info.event.extendedProps.progress}</div>
      </div>
    `
  });
  

  onDragStart(event: DragEvent, course: Course) {
    this.isDragging.set(true);
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', course.title);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd() {
    this.isDragging.set(false);
  }



  filteredCourses = computed(() => {
    const currentFilter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();
  
    return this.courses().filter(course => {
      const now = new Date().getTime();
      const courseStartDate = new Date(course.startDate).getTime(); 
  
      const matchesFilter =
        currentFilter === 'all' ||
        (currentFilter === 'inProgress' && course.progress >= 0 && course.progress < 100 && course.startDate !=='') ||
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


  // Start course
  startCourse(course: Course): void {
    console.log('Starting course:', course);
  
    if (!course.title) {
      console.error('Course title is required to start the course');
      return;
    }
  
    this.learningService.startCourse(course.title).subscribe({
      next: (userProgress) => {
        console.log('Course started successfully:', userProgress);
      },
      error: (error) => {
        console.error('Error starting course:', error);
        alert('Failed to start the course. Please try again.');
      },
    });
  }

  //helper date verif
  isStartDateValid(course: any): boolean {
    return course.startDate && !isNaN(new Date(course.startDate).getTime());
  }
  

  // Resume course
  resumeCourse(course: any): void {
    console.log('Resuming course:', course);
    // Logic to resume the course
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