import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gamer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,MatTooltipModule,MatListModule,MatIconModule],
  templateUrl: './gamer-sidebar.component.html',
  styleUrl: './gamer-sidebar.component.css'
})
export class GamerSidebarComponent {
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
