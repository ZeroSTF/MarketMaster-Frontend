import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MarketMaster-Frontend';

  isGamerRoute: boolean = false;
  isAuthRoute: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Listen for changes in the router's URL to check if the current route is '/gamer'
    this.router.events.subscribe(() => {
      this.isGamerRoute = this.router.url.includes('/gamer');
      this.isAuthRoute =
        this.router.url.includes('/login') ||
        this.router.url.includes('/signup');
    });
  }
}
