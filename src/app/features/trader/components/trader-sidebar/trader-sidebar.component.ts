import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trader-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTooltipModule],
  templateUrl: './trader-sidebar.component.html',
  styleUrl: './trader-sidebar.component.css',
})
export class TraderSidebarComponent {
  @Output() changeTimeFrame = new EventEmitter<string>();
  @Output() changeChartType = new EventEmitter<string>();
  @Output() toggleIndicators = new EventEmitter<void>();
  @Output() placeBuyOrder = new EventEmitter<void>();
  @Output() placeSellOrder = new EventEmitter<void>();
  @Output() zoomChart = new EventEmitter<'in' | 'out'>();
  @Output() resetSimulation = new EventEmitter<void>();
}
