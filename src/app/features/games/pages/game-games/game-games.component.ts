import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewdetailsComponent } from '../../components/overviewdetails/overviewdetails.component';
import { QuickMatchComponent } from '../../components/quick-match/quick-match.component';
import { CurrentGamesComponent } from '../../components/current-games/current-games.component';
import { LiveEventsComponent } from '../../components/live-events/live-events.component';
import { YourGamesComponent } from '../../components/your-games/your-games.component';
import { LiveGamesComponent } from '../../components/live-games/live-games.component';

@Component({
  selector: 'app-game-games',
  standalone: true,
  imports: [
    CommonModule,
    OverviewdetailsComponent,
    QuickMatchComponent,
    CurrentGamesComponent,
    LiveEventsComponent,
    YourGamesComponent,
    LiveGamesComponent
  ],
  templateUrl: './game-games.component.html',
  styleUrls: ['./game-games.component.css'],
})
export class GameGamesComponent {}
