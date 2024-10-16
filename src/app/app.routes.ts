import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';

export const routes: Routes = [
  {
    path: 'overview', // This will directly link to PortfolioComponent
    component: OverviewComponent,
  },
];
