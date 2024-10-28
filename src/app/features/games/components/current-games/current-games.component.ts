import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../services/game.service';
import { GameDto, GameStatus,JoinGameDto,LeaderboardEntryDto } from '../../../../models/game.model';
@Component({
  selector: 'app-current-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-games.component.html',
  styleUrl: './current-games.component.css'
})
export class CurrentGamesComponent {
  currentGames: GameDto[] = [];
  leaderboard: LeaderboardEntryDto[] = [];
constructor(private gameService: GameService) {}


ngOnInit(): void {
  this.loadCurrentGames();
  this.loadGlobalLeaderboard();
}


  loadGlobalLeaderboard() {
this.gameService.getGlobalLeaderboard().subscribe({
  next: (leaderboard) => {
    this.leaderboard = leaderboard;
  },
  error: (error) => console.error('Error fetching global leaderboard', error),
})  }

  loadCurrentGames() {
this.gameService.getCurrentGames().subscribe({
  next: (games) => {
    this.currentGames = games;
  },
  error: (error) => console.error('Error fetching current games', error),
})  }

onJoinGame(gameId: number) {
  const username = 'koussaykoukii';
  const joinGameDto: JoinGameDto = { username };

  this.gameService.joinGame(gameId, joinGameDto).subscribe(
    response => {
      console.log('Joined game successfully:', response);
      this.loadCurrentGames();
    },
    error => {
      console.error('Error joining game:', error);
    }
  );
}

 

}
