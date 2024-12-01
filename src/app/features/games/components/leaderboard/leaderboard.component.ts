import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Player {
  name: string;
  avatar: string;
  profit: number; // Profit in the current game
  trades: number; // Number of trades made
  rank: number; // Rank in the leaderboard
  isActive: boolean; // Player's activity status
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  
  styleUrls: ['./leaderboard.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LeaderboardComponent {
  players: Player[] = [
    {
      name: 'Alice',
      avatar: 'https://via.placeholder.com/50',
      profit: 5000,
      trades: 20,
      rank: 1,
      isActive: true,
    },
    {
      name: 'Bob',
      avatar: 'https://via.placeholder.com/50',
      profit: 4000,
      trades: 18,
      rank: 2,
      isActive: true,
    },
    {
      name: 'Charlie',
      avatar: 'https://via.placeholder.com/50',
      profit: 3000,
      trades: 15,
      rank: 3,
      isActive: false,
    },
    {
      name: 'David',
      avatar: 'https://via.placeholder.com/50',
      profit: 2000,
      trades: 12,
      rank: 4,
      isActive: true,
    },
    {
      name: 'Eve',
      avatar: 'https://via.placeholder.com/50',
      profit: 1000,
      trades: 10,
      rank: 5,
      isActive: false,
    },
  ];
}
