import { Component } from '@angular/core';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  expandedNews: { [key: number]: boolean } = {};

  // Toggle the full text of a news item
  toggleFullText(index: number) {
    this.expandedNews[index] = !this.expandedNews[index];
  }
}
