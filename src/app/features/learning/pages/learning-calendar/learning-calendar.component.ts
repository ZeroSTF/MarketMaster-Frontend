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
export class LearningCalendarComponent implements OnInit {
  private learningService = inject(LearningService);
  searchQuery = signal('');
  activeFilter = signal('all');
  isDragging = signal(false);

  filters = [
    { name: 'all', label: 'All Courses', icon: 'view_list' },
    { name: 'inProgress', label: 'In Progress', icon: 'pending' },
    { name: 'coming', label: 'Upcoming', icon: 'event' },
    { name: 'completed', label: 'Completed', icon: 'task_alt' }
  ];

  calendarOptions!: CalendarOptions;
  courses = this.learningService.courses;
  public readonly calendarEvents = computed(() => 
    this.courses().map(course => this.courseToEvent(course))
  );

  private courseToEvent(course: Course): EventInput {
    const endDate = new Date(course.startDate);
    endDate.setMinutes(endDate.getMinutes() + course.duration);

    const extendedProps: CourseEventProps = {
      description: course.description,
      progress: course.progress,
      level: course.level,
      duration: course.duration,
      category: course.category,
      courseId: course.id
    };

    return {
      id: course.id,
      title: course.title,
      start: course.startDate,
      end: endDate,
      backgroundColor: this.getEventColor(course.progress),
      borderColor: this.getEventColor(course.progress),
      textColor: 'white',
      extendedProps
    };
  }
  ngOnInit() {
    this.initializeCalendar();
  }

  private initializeCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      editable: true,
      droppable: true,
      height: '100%',
      allDaySlot: false,
      slotMinTime: '07:00:00',
      slotMaxTime: '21:00:00',
      events: this.calendarEvents(), // Use computed events
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      drop: this.handleExternalDrop.bind(this),
      eventContent: this.renderEventContent.bind(this),
      eventDidMount: (info) => {
        // Add tooltip or additional event mounting logic
        // info.el.setAttribute('data-course-id', info.event.extendedProps.courseId);
      },
      dropAccept: '.course-item',
      eventOverlap: false,
      eventConstraint: 'businessHours',
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '17:00',
      }
    };
  }
  

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
  handleEventClick(info: any) {
    // TODO: Implement modal or side panel for event details
    const event = info.event;
    console.log('Event clicked:', {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      ...event.extendedProps
    });
  }
  renderEventContent(info: any) {
    const progress = info.event.extendedProps.progress;
    const progressClass = progress === 100 ? 'bg-green-500' : 
                         progress > 0 ? 'bg-blue-500' : 'bg-gray-500';

    return {
      html: `
        <div class="p-2">
          <div class="font-medium text-sm">${info.event.title}</div>
          <div class="flex items-center gap-2 text-xs mt-1">
            <span class="capitalize">${info.event.extendedProps.category}</span>
            <div class="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
              <div class="${progressClass}" style="width: ${progress}%"></div>
            </div>
            <span>${progress}%</span>
          </div>
        </div>
      `
    };
  }

  onDragStart(event: DragEvent, course: Course) {
    this.isDragging.set(true);
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', course.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd() {
    this.isDragging.set(false);
  }



  // Filter and Search Methods
  filteredCourses = computed(() => {
    const currentFilter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();
    
    return this.courses().filter(course => {
      // Apply status filter
      const matchesFilter = currentFilter === 'all' ||
        (currentFilter === 'inProgress' && course.progress > 0 && course.progress < 100) ||
        (currentFilter === 'coming' && course.progress === 0) ||
        (currentFilter === 'completed' && course.progress === 100);

      // Apply search query
      const matchesSearch = !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.level.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  getFilterCount(filterName: string): number {
    return this.courses().filter(course => {
      switch (filterName) {
        case 'inProgress':
          return course.progress > 0 && course.progress < 100;
        case 'coming':
          return course.progress === 0;
        case 'completed':
          return course.progress === 100;
        default:
          return true;
      }
    }).length;
  }

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  setActiveFilter(filterName: string) {
    this.activeFilter.set(filterName);
  }
}