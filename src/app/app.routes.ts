import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { DiscoverComponent } from './features/dashboard/components/discover/discover.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { noAuthGuard } from './auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/overview',
    pathMatch: 'full'
  },

  // AUTH ROUTES
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  
  // DASHBOARD ROUTES
  {
    path: 'dashboard',
    component: DashboardLayoutComponent, children: [

      
        {
          path: 'overview',
          component: OverviewComponent,
        },
      
        {
          path: 'discover',
          component: DiscoverComponent
        },
      
    ]
  },

];
