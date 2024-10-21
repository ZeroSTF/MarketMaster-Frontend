import { Routes } from '@angular/router';
import { DashboardOverviewComponent } from './features/dashboard/pages/dashboard-overview/dashboard-overview.component';
import { DashboardExploreComponent } from './features/dashboard/pages/dashboard-explore/dashboard-explore.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { DashboardPortfolioComponent } from './features/dashboard/pages/dashboard-portfolio/dashboard-portfolio.component';
import { DashboardSettingsComponent } from './features/dashboard/pages/dashboard-settings/dashboard-settings.component';
import { TraderLayoutComponent } from './layout/trader-layout/trader-layout.component';
import { LearningLayoutComponent } from './layout/learning-layout/learning-layout.component';
import { LearningOverviewComponent } from './features/learning/pages/learning-overview/learning-overview.component';
import { LearningCalendarComponent } from './features/learning/pages/learning-calendar/learning-calendar.component';

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
        component: DashboardOverviewComponent,
      },

      {
        path: 'discover',
        component: DashboardExploreComponent,
      },
      {
        path: 'portfolio',
        component: DashboardPortfolioComponent,
      },
      {
        path: 'settings',
        component: DashboardSettingsComponent,
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
    component: LearningLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: LearningOverviewComponent,
      },
      {
        path: 'calendar',
        component: LearningCalendarComponent,
      },
    ],
  },
];
