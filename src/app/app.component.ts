import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from './features/dashboard/components/dashboard-sidebar/dashboard-sidebar.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardSidebarComponent, NavBarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'MarketMaster-Frontend';
}
