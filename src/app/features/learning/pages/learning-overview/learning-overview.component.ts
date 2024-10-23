import { Component, computed, inject } from '@angular/core';
import { LearningService } from '../../../../services/learning.service';
import { Module } from '../../../../models/learning.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChartComponent } from '../../../dashboard/components/chart/chart.component';
import { CoursComponent } from '../../../dashboard/components/cours/cours.component';
import { NewsComponent } from '../../../dashboard/components/news/news.component';
import { OverviewdetailsComponent } from '../../../dashboard/components/overviewdetails/overviewdetails.component';
import { TradesoverviewComponent } from '../../../dashboard/components/tradesoverview/tradesoverview.component';
import { WatchlistComponent } from '../../../dashboard/components/watchlist/watchlist.component';
import { LearningTestComponent } from "../../components/learning-test/learning-test.component";

@Component({
  selector: 'app-learning-overview',
  standalone: true,
  imports: [ MatIconModule, OverviewdetailsComponent, CoursComponent, NewsComponent, WatchlistComponent, ChartComponent, TradesoverviewComponent, CommonModule],
  templateUrl: './learning-overview.component.html',
  styleUrl: './learning-overview.component.css'
})
export class LearningOverviewComponent {
  activeTab: string = 'completed';
  private courseService = inject(LearningService);
  courses = this.courseService.courses; 

  completedCoursesList = computed(() =>
    this.courses().filter((course) => course.progress === 100)
  );

  ongoingCoursesList = computed(() =>
    this.courses().filter((course) => course.progress > 0 && course.progress < 100)
  );

  pendingTasks = computed(() =>
    this.courses().reduce(
      (sum, course) =>
        sum + course.modules.filter((module: Module) => !module.isCompleted).length,
      0
    )
  );

 
}
