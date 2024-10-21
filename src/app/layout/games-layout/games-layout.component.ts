import { MatIconModule } from '@angular/material/icon';
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamerSidebarComponent } from '../../features/games/components/gamer-sidebar/gamer-sidebar.component';


@Component({
  selector: 'app-games-layout',
  standalone: true,
  imports: [RouterModule ,CommonModule, MatIconModule, GamerSidebarComponent],
  templateUrl: './games-layout.component.html',
  styleUrl: './games-layout.component.css'
})
export class GamesLayoutComponent {
  isMobile = false;
  hidden = false;

  @HostListener('window:resize', [])
  onResize() {
    this.checkMobileView();
  }

  ngOnInit() {
    this.checkMobileView();
  }

  checkMobileView() {
    this.isMobile = window.innerWidth <= 768;
  }
  }
