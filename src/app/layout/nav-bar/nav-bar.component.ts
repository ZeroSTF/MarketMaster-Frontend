import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';
import { ClickOutsideDirective } from '../../Utils/click-outside.directive';
import { StockService } from '../../services/stock.service';


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
    MatMenuTrigger,
    ClickOutsideDirective,
    
  ],
  templateUrl: './nav-bar.component.html',
  styles: [`
    
  `]
})
export class NavBarComponent implements OnInit {
  isOpen = false;

  ngOnInit(): void { }

  

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
