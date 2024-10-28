import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { PlayerPerformanceDto } from '../../../../models/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overviewdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overviewdetails.component.html',
  styleUrls: ['./overviewdetails.component.css'],
})
export class OverviewdetailsComponent implements OnInit {
  playerPerformance: PlayerPerformanceDto | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const username = 'koussaykoukii'; // Replace with the actual username if available dynamically
    this.gameService.getPlayerPerformance(username).subscribe({
      next: (data) => (this.playerPerformance = data),
      error: (error) => console.error('Error fetching performance data', error),
    });
  }
}
