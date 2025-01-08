import { Routes } from '@angular/router';
import { DashboardOverviewComponent } from './features/dashboard/pages/dashboard-overview/dashboard-overview.component';
import { DashboardExploreComponent } from './features/dashboard/pages/dashboard-explore/dashboard-explore.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

import { GamesLayoutComponent } from './layout/games-layout/games-layout.component';
import { GameOverviewComponent } from './features/games/pages/game-overview/game-overview.component';
import { TraderLayoutComponent } from './layout/trader-layout/trader-layout.component';
import { GamePortfolioComponent } from './features/games/pages/game-portfolio/game-portfolio.component';
import { GameMainComponent } from './features/games/pages/game-main/game-main.component';
import { GameGamesComponent } from './features/games/pages/game-games/game-games.component';

import { DashboardPortfolioComponent } from './features/dashboard/pages/dashboard-portfolio/dashboard-portfolio.component';
import { DashboardSettingsComponent } from './features/dashboard/pages/dashboard-settings/dashboard-settings.component';
import { LearningLayoutComponent } from './layout/learning-layout/learning-layout.component';
import { LearningOverviewComponent } from './features/learning/pages/learning-overview/learning-overview.component';
import { LearningCalendarComponent } from './features/learning/pages/learning-calendar/learning-calendar.component';
import { LearningTestComponent } from './features/learning/components/learning-test/learning-test.component';
import { BuySellComponent } from './features/buy-sell/buy-sell.component';
import { PreviewOrderComponent } from './features/preview-order/preview-order.component';
import { LearningCourseComponent } from './features/learning/pages/learning-course/learning-course.component';
import { noAuthGuard } from './auth/guards/no-auth.guard';

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
    canActivate: [noAuthGuard],
  },
  {
    path: 'test',
    loadComponent: () =>
      import(
        './features/games/components/market-data/market-data.component'
      ).then((m) => m.MarketDataComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
    canActivate: [noAuthGuard],
  },
  {
    path: 'buysell',
    component: BuySellComponent,
  },
  {
    path: 'preview-order',
    component: PreviewOrderComponent,
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
  {
    path: 'gamer',
    component: GamesLayoutComponent,
    children: [
      {
        path: 'overview',
        component: GameOverviewComponent,
      },
      {
        path: 'portfolio/:userId/:gameId',
        component: GamePortfolioComponent,
      },
      {
        path: 'main/:gameId',
        component: GameMainComponent,
      },
      {
        path: 'games',
        component: GameGamesComponent,
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
      {
        path: 'test',
        component: LearningTestComponent,
      },
      {
        path: 'course',
        component: LearningCourseComponent,
      },
    ],
  },
];
