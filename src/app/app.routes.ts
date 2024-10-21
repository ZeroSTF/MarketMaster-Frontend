import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { DiscoverComponent } from './features/dashboard/pages/discover/discover.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { PortfolioComponent } from './features/dashboard/pages/portfolio/portfolio.component';
import { GamesLayoutComponent } from './layout/games-layout/games-layout.component';
import { GameOverviewComponent } from './features/games/pages/game-overview/game-overview.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/overview',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },

      {
        path: 'discover',
        component: DiscoverComponent,
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
      },
    ],
  },
  {
    path: 'game',
    component: GamesLayoutComponent,
    children: [
      {
        path: 'overview',
        component: GameOverviewComponent,
      },

      {
        path: 'discover',
        component: DiscoverComponent,
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
      },
    ],
  },
];
