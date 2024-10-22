import { Component } from '@angular/core';
import { OverviewdetailsComponent } from '../../../dashboard/components/overviewdetails/overviewdetails.component';
import { CoursComponent } from '../../../dashboard/components/cours/cours.component';
import { NewsComponent } from '../../../dashboard/components/news/news.component';
import { WatchlistComponent } from '../../../dashboard/components/watchlist/watchlist.component';
import { ChartComponent } from '../../../dashboard/components/chart/chart.component';
import { TradesoverviewComponent } from '../../../dashboard/components/tradesoverview/tradesoverview.component';

@Component({
  selector: 'app-learning-overview',
  standalone: true,
  imports: [OverviewdetailsComponent,CoursComponent, NewsComponent,WatchlistComponent,ChartComponent,TradesoverviewComponent],
  templateUrl: './learning-overview.component.html',
  styleUrl: './learning-overview.component.css'
})
export class LearningOverviewComponent {

}
