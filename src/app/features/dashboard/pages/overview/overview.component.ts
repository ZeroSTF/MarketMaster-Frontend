import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewdetailsComponent } from '../../components/overviewdetails/overviewdetails.component';
import { NewsComponent } from '../../components/news/news.component';
import { TradesoverviewComponent } from '../../components/tradesoverview/tradesoverview.component';
import { WhitelistoverviewComponent } from '../../components/whitelistoverview/whitelistoverview.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { CoursComponent } from '../../components/cours/cours.component';



@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule,OverviewdetailsComponent,NewsComponent,TradesoverviewComponent,WhitelistoverviewComponent,ChartComponent,CoursComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  // Component logic goes here
}