import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatListModule

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SideBarComponent {
  @Input() hidden = false; 
  @Output() toggle = new EventEmitter<void>(); 
  selectedButton: string = 'overview'; 

  sidebarButtons = [
    { name: 'overview', label: 'Overview', icon: 'home', link: '/overview', badge: '3 new updates' },
    { name: 'explore', label: 'Explore', icon: 'explore', link: '/discover' },
    { name: 'portfolio', label: 'Portfolio', icon: 'account_balance_wallet', link: '#' },
    { name: 'settings', label: 'Settings', icon: 'settings', link: '#' },
    { name: 'community', label: 'Community', icon: 'group', link: '#' },
    { name: 'help', label: 'Help & Support', icon: 'help', link: '#' },
  ];


  toggleSidebar(): void {
    this.toggle.emit();
  }


  clickSideButton(button: string): void {
    this.selectedButton = button;
  }

 
}
