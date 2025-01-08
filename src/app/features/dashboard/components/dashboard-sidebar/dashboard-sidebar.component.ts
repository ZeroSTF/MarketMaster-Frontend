import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../../auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule, MatListModule],
})
export class DashboardSidebarComponent {
  @Input() hidden = false;
  @Output() toggle = new EventEmitter<void>();
  selectedButton = signal('overview');
  isMobile = false;
  authService = inject(AuthService);

  sidebarButtons = [
    {
      name: 'overview',
      label: 'Overview',
      icon: 'home',
      link: '/dashboard/overview',
    },
    {
      name: 'explore',
      label: 'Explore',
      icon: 'explore',
      link: '/dashboard/discover',
    },
    {
      name: 'portfolio',
      label: 'Portfolio',
      icon: 'account_balance_wallet',
      link: '/dashboard/portfolio',
    },
    {
      name: 'settings',
      label: 'Settings',
      icon: 'settings',
      link: '/dashboard/settings',
    },
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const segment = currentUrl.split('/').pop();

        const matchingButton = this.sidebarButtons.find(
          (btn) =>
            btn.link.endsWith(segment!) ||
            (segment === 'overview' && btn.name === 'overview')
        );

        if (matchingButton) {
          this.selectedButton.set(matchingButton.name);
        }
      });
  }

  toggleSidebar(): void {
    this.toggle.emit();
  }

  clickSideButton(button: string): void {
    this.selectedButton.set(button);
  }
}
