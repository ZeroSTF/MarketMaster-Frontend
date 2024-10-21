import { CoursesSidebarComponent } from './../../features/dashboard/components/courses-sidebar/courses-sidebar.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses-layout',
  standalone: true,
  imports: [RouterModule, CoursesSidebarComponent],
  templateUrl: './courses-layout.component.html',
  styleUrl: './courses-layout.component.css'
})
export class CoursesLayoutComponent {

}
