import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { LeaderboardEntryDto } from '../../../../models/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-leaderboard',
  templateUrl: './global-leaderboard.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./global-leaderboard.component.css']
})
export class GlobalLeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntryDto[] = [];

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadGlobalLeaderboard();
  }

  loadGlobalLeaderboard() {
    this.gameService.getGlobalLeaderboard().subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
        this.cdr.detectChanges(); // Trigger change detection for updates
      },
      error: (error) => console.error('Error fetching global leaderboard', error),
    });
  }
}
