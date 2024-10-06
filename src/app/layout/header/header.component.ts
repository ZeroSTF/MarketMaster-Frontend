import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  menuOpen = false;     // Controls avatar dropdown menu
  navMenuOpen = false;  // Controls mobile navigation menu

  toggleMenu() {
    this.menuOpen = !this.menuOpen;  // Toggles the avatar dropdown
  }

  toggleNavMenu() {
    this.navMenuOpen = !this.navMenuOpen;  // Toggles the mobile navigation menu
  }

  logout() {
    console.log('User logged out');
  }
}
