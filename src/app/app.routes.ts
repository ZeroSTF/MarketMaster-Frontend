import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/dashboard/portfolio/portfolio.component';

export const routes: Routes = [
  {
    path: 'portfolio', // This will directly link to PortfolioComponent
    component: PortfolioComponent,
  },
];
