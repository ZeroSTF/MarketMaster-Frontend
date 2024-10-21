import { Routes } from '@angular/router';
import { DashboardoverviewComponent } from './features/dashboard/pages/dashboardoverview/dashboardoverview.component';
import { DiscoverComponent } from './features/dashboard/pages/discover/discover.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { PortfolioComponent } from './features/dashboard/pages/portfolio/portfolio.component';
import { SettingsComponent } from './features/dashboard/pages/settings/settings.component';
import { TraderLayoutComponent } from './layout/trader-layout/trader-layout.component';
import { CoursesLayoutComponent } from './layout/courses-layout/courses-layout.component';
import { CoursesoverviewComponent } from './features/dashboard/pages/coursesoverview/coursesoverview.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/overview',
    pathMatch: 'full',
  },

  // AUTH ROUTES
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  // DASHBOARD ROUTES
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: DashboardoverviewComponent,
      },

      {
        path: 'discover',
        component: DiscoverComponent,
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },

  // TRADER ROUTES
  {
    path: 'trader',
    component: TraderLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },

  // LEARNING ROUTES
  {
    path: 'learning',
    component: CoursesLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: CoursesoverviewComponent,
      },
    ],
  },
];
