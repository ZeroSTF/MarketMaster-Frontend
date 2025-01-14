import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  username: string = ''; // Add a property to store the username

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Fetch the username from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user?.username; // Extract the username from the user object

    if (!this.username) {
      console.error('Username not found in localStorage');
      return;
    }

    // Fetch player performance using the username
    this.gameService.getPlayerPerformance(this.username).subscribe({
      next: (data) => {
        this.playerPerformance = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching performance data', error),
    });
  }
}