import { Component, computed, inject } from '@angular/core';
import { LearningService } from '../../../../services/learning.service';
import { Course, UserProgress } from '../../../../models/learning.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-learning-overview',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './learning-overview.component.html',
  styleUrl: './learning-overview.component.css'
})
export class LearningOverviewComponent {
  activeTab: string = 'certifications';
  private courseService = inject(LearningService);
  private authService = inject(AuthService);

  courses = this.courseService.courses;
  user = this.authService.currentUser();
  

  certifications = computed(() => 
    this.courses().filter((course: UserProgress) => 
      course.progress === 100 || course.completed === true
    )
  );

  completedCourses = computed(() => 
    this.courses().filter((course: UserProgress) => 
      course.progress === 100 && !course.completed
    )
  );

  inProgressCourses = computed(() =>
    this.courses().filter((course: UserProgress) => 
       course.progress > 0 && course.progress < 100
    )
  );

  comingCourses = computed(() =>
    this.courses().filter((course: UserProgress) => {
      const today = new Date();
      const startDate = new Date(course.startDate);
      return startDate > today;
    })
  );
  


 
  // Method to get courses based on active tab
  getActiveCourses() {
    console.log(this.user)

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