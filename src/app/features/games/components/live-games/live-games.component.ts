import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';
import { GameDto, GameStatus } from '../../../../models/game.model';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-games.component.html',
  styleUrls: ['./live-games.component.css']
})
export class LiveGamesComponent implements OnInit {
  userGames: GameDto[] = [];
  openGames: GameDto[] = [];
  username: string = 'koussaykoukii'; // Replace with actual username if available dynamically

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef,private authService: AuthService,private router : Router) {}

  ngOnInit(): void {
    this.fetchUserGames();
    this.fetchAvailableGames();
  }

  /**
   * Fetches games the user has joined and filters them to include only open games.
   */
  fetchUserGames(): void {
    this.gameService.getUserGames(this.username).subscribe({
      next: (games) => {
        this.userGames = games.filter(game => game.status === GameStatus.ACTIVE);
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching user games', error),
    });
  }

  /**
   * Fetches all active games and filters out games the user has already joined.
   */
  fetchAvailableGames(): void {
    this.gameService.getCurrentGames().subscribe({
      next: (games) => {
        // Exclude games the user has already joined
        const joinedGameIds = new Set(this.userGames.map(game => game.id));
        this.openGames = games.filter(game => !joinedGameIds.has(game.id));
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching available games', error),
    });
  }

  openGame(game: GameDto): void {
    console.log(`Opening game: ${game.title}`);
    // Logic to open the game
  }

  viewPortfolio(game: GameDto): void {
    const user = this.authService.currentUser();
    console.log('Authenticated user:', user); // Debugging log
    if (user) {
      const userId = user.id;
      const gameId = game.id;
      this.router.navigate([`/portfolio/${userId}/${gameId}`]);
    } else {
      console.error('User not authenticated');
    }
  }
  

  joinGame(game: GameDto): void {
    console.log(`Joining game: ${game.title}`);
    // Logic to join the game
  }
}
