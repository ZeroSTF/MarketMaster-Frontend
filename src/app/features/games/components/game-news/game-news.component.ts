import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameService, NewsArticle } from '../../../../services/game.service';
import { NewsDialogComponent } from '../news-dialog/news-dialog.component';
import { selectSimulationTime } from '../../../../store/actions/game.selectors'; // Selector for simulation time
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-news',
  standalone: true,
  imports: [NewsDialogComponent, CommonModule],
  templateUrl: './game-news.component.html',
  styleUrls: ['./game-news.component.css'],
})
export class GameNewsComponent implements OnInit, OnDestroy {
  newsList$: Observable<NewsArticle[]>; // Observable for the full news list
  filteredNews$: Observable<NewsArticle[]> | undefined; // Observable for dynamically filtered and limited news
  currentSimulationTime: string | null = null; // Simulation time from the global store

  private subscription = new Subscription();

  constructor(
    private gameService: GameService,
    private dialog: MatDialog,
    private store: Store,
    private cdRef: ChangeDetectorRef
  ) {
    this.newsList$ = this.gameService.getNewsByGame(9); // Fetch news list for gameId 7
  }

  ngOnInit(): void {
    // Subscribe to simulation time from the store
    this.subscription.add(
      this.store.select(selectSimulationTime).subscribe((simulationTime) => {
        this.currentSimulationTime = simulationTime;
        this.cdRef.detectChanges();
      })
    );

    // Combine simulation time and news list for dynamic filtering and limiting to 20 latest news
    this.filteredNews$ = combineLatest([
      this.newsList$,
      this.store.select(selectSimulationTime), // Reactively fetch simulation time
    ]).pipe(
      map(([newsList, simulationTime]) => {
        if (!simulationTime) return []; // If no simulation time, show no news
        return newsList
          .filter(
            (news: NewsArticle) =>
              new Date(news.publishedDate) <= new Date(simulationTime) // Show news up to simulation time
          )
          .slice(0, 30); // Limit to the 20 latest news items
      })
    );
  }

  openNewsDetails(news: NewsArticle): void {
    this.dialog.open(NewsDialogComponent, {
      width: '500px',
      data: news,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
