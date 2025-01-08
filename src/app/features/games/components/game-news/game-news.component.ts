import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GameService, NewsArticle } from '../../../../services/game.service';
import { NewsDialogComponent } from '../news-dialog/news-dialog.component';
import { selectSimulationTime } from '../../../../store/actions/game.selectors'; // Selector for simulation time
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-game-news',
  standalone: true,
  imports: [NewsDialogComponent, CommonModule],
  templateUrl: './game-news.component.html',
  styleUrls: ['./game-news.component.css'],
})
export class GameNewsComponent implements OnInit, OnDestroy {
  newsList$!: Observable<NewsArticle[]>; // Observable for the full news list
  filteredNews$!: Observable<NewsArticle[]>; // Observable for dynamically filtered and limited news
  currentSimulationTime: string | null = null; // Simulation time from the global store

  private subscription = new Subscription();

  constructor(
    private gameService: GameService,
    private dialog: MatDialog,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to the route parameters to get the gameId dynamically
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const gameId = params.get('gameId'); // Extract gameId from the route
          if (gameId) {
            this.newsList$ = this.gameService.getNewsByGame(+gameId); // Fetch news list for the extracted gameId
          }
          return this.store.select(selectSimulationTime); // Continue with simulation time
        })
      ).subscribe((simulationTime) => {
        this.currentSimulationTime = simulationTime;
        this.cdRef.detectChanges();
      })
    );

    // Combine simulation time and news list for dynamic filtering and limiting to 30 latest news
    this.filteredNews$ = combineLatest([
      this.newsList$,
      this.store.select(selectSimulationTime), // Reactively fetch simulation time
    ]).pipe(
      map(([newsList, simulationTime]) => {
        if (!simulationTime) return []; // If no simulation time, show no news

        // Filter news published before or at the simulation time
        const filteredNews = newsList.filter(
          (news: NewsArticle) =>
            new Date(news.publishedDate) <= new Date(simulationTime)
        );

        // Sort by publishedDate in descending order (latest first)
        const sortedNews = filteredNews.sort(
          (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        );

        // Limit to the latest 30 news items
        return sortedNews.slice(0, 30);
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