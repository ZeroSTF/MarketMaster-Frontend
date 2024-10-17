import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/dashboard/portfolio/portfolio.component';
import { noAuthGuard } from './auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'portfolio', // This will directly link to PortfolioComponent
    component: PortfolioComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
];
