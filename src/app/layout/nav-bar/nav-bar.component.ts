import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { ClickOutsideDirective } from '../../Utils/click-outside.directive';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ClickOutsideDirective,
  ],
  templateUrl: './nav-bar.component.html',
  styles: [``],
})
export class NavBarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  darkModeService = inject(DarkModeService);

  isOpen = false;
  isOpen2 = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleMenu2() {
    this.isOpen2 = !this.isOpen2;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.toggleMenu();
        this.toggleMenu2();
        console.log('Logged out successfully');
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }
}
