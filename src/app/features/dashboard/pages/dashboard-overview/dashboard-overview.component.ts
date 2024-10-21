import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewdetailsComponent } from '../../components/overviewdetails/overviewdetails.component';
import { NewsComponent } from '../../components/news/news.component';
import { TradesoverviewComponent } from '../../components/tradesoverview/tradesoverview.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { CoursComponent } from '../../components/cours/cours.component';
import { WatchlistComponent } from '../../components/watchlist/watchlist.component';



@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule,OverviewdetailsComponent,NewsComponent,TradesoverviewComponent,WatchlistComponent,ChartComponent,CoursComponent],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DashboardOverviewComponent {
  // Component logic goes here
}