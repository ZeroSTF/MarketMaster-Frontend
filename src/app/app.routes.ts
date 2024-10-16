import { Routes } from '@angular/router';
import { OverviewComponent } from './features/dashboard/pages/overview/overview.component';
import { StockdetailsComponent } from './features/dashboard/components/stockdetails/stockdetails.component';

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
		path: "discover",
		loadComponent: () =>
			import("./features/dashboard/components/discover/discover.component").then((m) => m.DiscoverComponent)
	},
  {
    path: 'stock/:symbol',
    component: StockdetailsComponent
  },
];
