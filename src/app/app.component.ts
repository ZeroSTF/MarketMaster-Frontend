import { Component, HostBinding, effect, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardSidebarComponent } from './features/dashboard/components/dashboard-sidebar/dashboard-sidebar.component';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { DarkModeService } from './services/dark-mode.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardSidebarComponent, NavBarComponent, RouterModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MarketMaster-Frontend';
  
  @HostBinding('class.dark') darkClass = false;
  isGamerRoute: boolean = false;

  constructor(private darkModeService: DarkModeService, private router: Router, private activatedRoute: ActivatedRoute) {
    // Listen for changes in the router's URL to check if the current route is '/gamer'
    this.router.events.subscribe(() => {
      this.isGamerRoute = this.router.url.includes('/gamer');
    });

    effect(() => {
      this.darkClass = this.darkModeService.isDarkMode()();
    });
  }
}
