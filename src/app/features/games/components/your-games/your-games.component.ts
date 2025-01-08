import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';
import { GameDto, GameStatus } from '../../../../models/game.model';

@Component({
  selector: 'app-your-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-games.component.html',
  styleUrls: ['./your-games.component.css']
})
export class YourGamesComponent implements OnInit {
  selectedTab: string = 'ACTIVE';
  upcomingGames: GameDto[] = [];
  activeGames: GameDto[] = [];
  completedGames: GameDto[] = [];
  cancelledGames: GameDto[] = [];

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Fetch the username from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user?.username; // Extract the username from the user object

    if (!username) {
      console.error('Username not found in localStorage');
      return;
    }

    // Fetch user games using the username
    this.gameService.getUserGames(username).subscribe({
      next: (games) => {
        this.organizeGamesByStatus(games);
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => console.error('Error fetching user games', error),
    });
  }

  organizeGamesByStatus(games: GameDto[]): void {
    this.upcomingGames = games.filter(game => game.status === GameStatus.UPCOMING);
    this.activeGames = games.filter(game => game.status === GameStatus.ACTIVE);
    this.completedGames = games.filter(game => game.status === GameStatus.FINISHED);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}