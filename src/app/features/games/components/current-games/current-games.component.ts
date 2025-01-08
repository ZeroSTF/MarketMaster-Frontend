import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';
import {
  GameDto,
  LeaderboardEntryDto,
} from '../../../../models/game.model';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-games.component.html',
  styleUrls: ['./current-games.component.css'],
})
export class CurrentGamesComponent implements OnInit {
  currentGames: GameDto[] = [];
  leaderboard: LeaderboardEntryDto[] = [];
  private authService = inject(AuthService);

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) {}

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
      error: (error) =>
        console.error('Error fetching global leaderboard', error),
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
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.username) {
      const username = currentUser.username;
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
    } else {
      console.error('Current user is not available');
    }
  }
}
