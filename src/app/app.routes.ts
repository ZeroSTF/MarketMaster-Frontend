import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { DiscoverComponent } from './features/dashboard/pages/discover/discover.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { PortfolioComponent } from './features/dashboard/pages/portfolio/portfolio.component';
import { GamesLayoutComponent } from './layout/games-layout/games-layout.component';
import { GameOverviewComponent } from './features/games/pages/game-overview/game-overview.component';
import { SettingsComponent } from './features/dashboard/pages/settings/settings.component';
import { TraderLayoutComponent } from './layout/trader-layout/trader-layout.component';

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
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },

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
  },{
    path: 'gamer',
    component: GamesLayoutComponent,
    children: [
      {
        path: 'overview',
        component: GameOverviewComponent,
      },
    ],
  },
  
];
