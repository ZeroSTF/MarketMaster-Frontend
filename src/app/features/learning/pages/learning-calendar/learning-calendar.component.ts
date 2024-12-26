import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningService } from '../../../../services/learning.service';
import { Course } from '../../../../models/learning.model';

@Component({
  selector: 'app-learning-calendar',
  standalone: true,
  imports: [FullCalendarModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-calendar.component.html',
  styleUrls: ['./learning-calendar.component.css']
})
export class LearningCalendarComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  searchQuery = signal(''); 

  activeFilter = signal('all');

  filters = [
    { name: 'all', label: 'All', icon: 'view_list' },
    { name: 'inProgress', label: 'In Progress', icon: 'pending' },
    { name: 'coming', label: 'Waiting', icon: 'event' },
    { name: 'recommended', label: 'Recommended', icon: 'recommend' }
  ];

  private learningService = inject(LearningService);
  courses = computed(() => this.learningService.courses());

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: true,
      droppable: true,
      events: [
        { title: 'Introduction to Angular', start: '2024-10-22T08:00:00', end: '2024-10-22T09:30:00', description: 'Course 1' },
        { title: 'Advanced JavaScript', start: '2024-10-23T10:00:00', end: '2024-10-23T12:00:00', description: 'Course 2' },
        { title: 'Design Patterns in Java', start: '2024-10-24T12:00:00', end: '2024-10-24T14:00:00', description: 'Course 3' }
      ],
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDrop.bind(this)
    };
  }

  // Handle event click for details
  handleEventClick(info: any) {
    alert(`Course: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
  }

  // Handle drag-and-drop event modification
  handleEventDrop(info: any) {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null
    };

    console.log('Updated event:', updatedEvent);
  }


  inProgressCourses = computed(() => 
    this.courses().filter(course => 
      course.progress > 0 && course.progress < 100
    )
  );

  comingCourses = computed(() => 
    this.courses().filter(course => course.progress === 0)
  );
  setActiveFilter(filterName: string) {
    this.activeFilter.set(filterName);
  }

  filteredCourses = computed(() => {
    const currentFilter = this.activeFilter();
    const query = this.searchQuery().trim().toLowerCase();
  
    let filtered = this.courses();
  
    // Apply filters
    switch (currentFilter) {
      case 'inProgress':
        filtered = filtered.filter(course => course.progress > 0 && course.progress < 100);
        break;
      case 'coming':
        filtered = filtered.filter(course => course.progress === 0);
        break;
      case 'recommended':
      default:
        break;
    }
  
    // Apply search query
    if (query) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    }
  
    return filtered;
  });
  


  getFilterCount(filterName: string): number {
    return this.courses().filter(course => {
      switch (filterName) {
        case 'inProgress':
          return course.progress > 0 && course.progress < 100;
        case 'coming':
          return course.progress === 0;
        case 'recommended':
          return course.progress < 100;
        case 'all':
          return true;
        default:
          return false;
      }
    }).length;
  }
  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
  
  
  
}