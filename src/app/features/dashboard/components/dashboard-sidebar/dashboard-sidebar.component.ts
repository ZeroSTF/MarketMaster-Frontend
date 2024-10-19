import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  selectedButton: string = 'overview';
  isMobile = false;

  sidebarButtons = [
    { name: 'overview', label: 'Overview', icon: 'home', link: '/dashboard/overview', badge: '' },
    { name: 'explore', label: 'Explore', icon: 'explore', link: '/dashboard/discover' },
    { name: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet', link: '/dashboard/portfolio' },
    { name: 'settings', label: 'Settings', icon: 'settings', link: '/dashboard/settings' },
    { name: 'community', label: 'Community', icon: 'group', link: '#' },
    { name: 'help', label: 'Help & Support', icon: 'help', link: '#' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  toggleSidebar(): void {
    this.toggle.emit();
  }

  clickSideButton(button: string): void {
    this.selectedButton = button;
  }
}
