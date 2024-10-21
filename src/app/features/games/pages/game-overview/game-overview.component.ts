
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewdetailsComponent } from '../../components/overviewdetails/overviewdetails.component';
import { NewsComponent } from '../../../dashboard/components/news/news.component';
import { TradesoverviewComponent } from '../../../dashboard/components/tradesoverview/tradesoverview.component';
import { WhitelistoverviewComponent } from '../../../dashboard/components/whitelistoverview/whitelistoverview.component';
import { ChartComponent } from '../../../dashboard/components/chart/chart.component';
import { CoursComponent } from '../../../dashboard/components/cours/cours.component';
import { QuickMatchComponent } from '../../components/quick-match/quick-match.component';
import { CurrentGamesComponent } from '../../components/current-games/current-games.component';
import { LiveEventsComponent } from '../../components/live-events/live-events.component';
import { YourGamesComponent } from '../../components/your-games/your-games.component';
@Component({
  selector: 'app-game-overview',
  standalone: true,
  imports: [CommonModule,OverviewdetailsComponent,NewsComponent,TradesoverviewComponent,WhitelistoverviewComponent,ChartComponent,CoursComponent,QuickMatchComponent,CurrentGamesComponent,LiveEventsComponent,YourGamesComponent],
  templateUrl: './game-overview.component.html',
  styleUrl: './game-overview.component.css'
})
export class GameOverviewComponent {

}
