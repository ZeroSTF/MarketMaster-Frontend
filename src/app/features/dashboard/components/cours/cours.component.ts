import { LearningService } from './../../../../services/learning.service';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProgress } from '../../../../models/learning.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent {
  chapters = [
    { name: 'Chapter 1: Introduction', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 1' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 1' }
    ]},
    { name: 'Chapter 2: Advanced Concepts', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 2' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 2' }
    ]},
    { name: 'Chapter 3: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]},
    { name: 'Chapter 4: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]},
    { name: 'Chapter 5: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]}
  ];

  learningService = inject(LearningService);
  private router = inject(Router);

  filters = [
    { name: 'all', label: 'All Courses', icon: 'view_list' },
    { name: 'inProgress', label: 'In Progress', icon: 'pending' },
    { name: 'completed', label: 'Completed', icon: 'task_alt' },
  ];
  courses = this.learningService.courses;

  activeFilter = signal('all');
  filteredCourses = computed(() => {
      const currentFilter = this.activeFilter();
  
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
  
        
        return matchesFilter;
      });
    });
  
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

  

  

  selectedChapter = 0;
  selectedChapterContent = this.chapters[this.selectedChapter];

  selectChapter(index: number): void {
    this.selectedChapter = index;
    this.selectedChapterContent = this.chapters[index];
  }

}
