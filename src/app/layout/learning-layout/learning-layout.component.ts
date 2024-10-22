import { LearningSidebarComponent } from '../../features/learning/components/learning-sidebar/learning-sidebar.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-learning-layout',
  standalone: true,
  imports: [RouterModule, LearningSidebarComponent],
  templateUrl: './learning-layout.component.html',
  styleUrl: './learning-layout.component.css'
})
export class LearningLayoutComponent {

}
