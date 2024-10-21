import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-your-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './your-games.component.html',
  styleUrl: './your-games.component.css'
})
export class YourGamesComponent {
  selectedTab: string = 'upcoming';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
