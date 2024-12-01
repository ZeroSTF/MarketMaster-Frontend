import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';  // FullCalendar Angular Module
import { CalendarOptions } from '@fullcalendar/core';  // FullCalendar options interface
import interactionPlugin from '@fullcalendar/interaction'; // Needed for drag & drop
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week and Day view
import listPlugin from '@fullcalendar/list'; // List view
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-learning-calendar',
  standalone: true,
  imports: [FullCalendarModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './learning-calendar.component.html',
  styleUrls: ['./learning-calendar.component.css']
})
export class LearningCalendarComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  searchQuery: string = '';
  totalCourses: number = 7;
  selectedFilter: string = 'All';
  
  sidebarButtons = [
    { name: 'calendar', label: 'Calender', icon: 'calendar_today', link: '/learning/calendar' },
    { name: 'board', label: 'Board', icon: 'dashboard', link: '/learning/board' },
    { name: 'overview', label: 'overview', icon: 'shopping_cart', link: '/learning/overview' },
    { name: 'learning', label: 'learning', icon: 'school', link: '/learning/courses' }
  ];
  selectedButton: string = 'calendar';

  clickSideButton(button: string): void {
    this.selectedButton = button;
  }
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
    // You can send the updated event to a backend service here
  }
}
