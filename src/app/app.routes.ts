import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { DiscoverComponent } from './features/dashboard/components/discover/discover.component';
import { StockdetailsComponent } from './features/dashboard/components/stockdetails/stockdetails.component';
import { noAuthGuard } from './auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview', // This will directly link to PortfolioComponent
    component: OverviewComponent,
  },
  {
    path: 'discover',
    component: DiscoverComponent
  },
  {
    path: 'stock/:symbol',
    component: StockdetailsComponent
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
