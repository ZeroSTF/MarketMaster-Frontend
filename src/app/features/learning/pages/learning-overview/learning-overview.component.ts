import { Component, computed, inject } from '@angular/core';
import { LearningService } from '../../../../services/learning.service';
import { Course, Module } from '../../../../models/learning.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-learning-overview',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './learning-overview.component.html',
  styleUrl: './learning-overview.component.css'
})
export class LearningOverviewComponent {
  activeTab: string = 'certifications'; // Changed default tab
  private courseService = inject(LearningService);
  courses = this.courseService.courses;

  // Computed properties for each category
  certifications = computed(() => 
    this.courses().filter((course: Course) => 
      course.progress === 100 && course.hasCertification === true
    )
  );

  completedCourses = computed(() => 
    this.courses().filter((course: Course) => 
      course.progress === 100 && !course.hasCertification
    )
  );

  inProgressCourses = computed(() => 
    this.courses().filter((course: Course) => 
      course.progress > 0 && course.progress < 100
    )
  );

  comingCourses = computed(() => 
    this.courses().filter((course: Course) => 
      course.progress === 0
    )
  );


  // Helper computed properties
  averageProgress = computed(() => {
    const totalProgress = this.courses().reduce(
      (sum: number, course: Course) => sum + course.progress, 
      0
    );
    return this.courses().length > 0 
      ? Math.round(totalProgress / this.courses().length) 
      : 0;
  });

  // Method to get courses based on active tab
  getActiveCourses() {
    switch (this.activeTab) {
      case 'certifications':
        return this.certifications();
      case 'completed':
        return this.completedCourses();
      case 'ongoing':
        return this.inProgressCourses();
      case 'coming':
        return this.comingCourses();
      default:
        return [];
    }
  }
}