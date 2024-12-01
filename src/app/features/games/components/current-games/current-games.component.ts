import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';
import { GameDto, GameStatus, JoinGameDto, LeaderboardEntryDto } from '../../../../models/game.model';

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-games.component.html',
  styleUrls: ['./current-games.component.css']
})
export class CurrentGamesComponent implements OnInit {
  currentGames: GameDto[] = [];
  leaderboard: LeaderboardEntryDto[] = [];

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCurrentGames();
    this.loadGlobalLeaderboard();
  }

  loadGlobalLeaderboard() {
    this.gameService.getGlobalLeaderboard().subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching global leaderboard', error),
    });
  }

  loadCurrentGames() {
    this.gameService.getCurrentGames().subscribe({
      next: (games) => {
        this.currentGames = games;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching current games', error),
    });
  }

  onJoinGame(gameId: number) {
    const username = 'koussaykoukii';

    this.gameService.joinGame(gameId, username).subscribe(
      (response) => {
        console.log('Joined game successfully:', response);
        this.loadCurrentGames();
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error joining game:', error);
      }
    );
  }
}
