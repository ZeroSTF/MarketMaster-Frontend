import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview-container">
      <div class="top-row">
        <div class="balance-box">
          <!-- Balance content -->
        </div>
        <div class="income-box">
          <!-- Income content -->
        </div>
        <div class="news-box">
          <!-- News content -->
        </div>
        <div class="trading-account-box">
          <!-- Trading Account content -->
        </div>
      </div>
      
      <div class="middle-row">
        <div class="global-performance-box">
          <!-- Global Performance content -->
        </div>
      </div>
      
      <div class="bottom-row">
        <div class="courses-box">
          <!-- Courses content -->
        </div>
        <div class="watchlist-box">
          <!-- Watchlist content -->
        </div>
        <div class="best-winners-box">
          <!-- Best Winners content -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }
    .top-row, .middle-row, .bottom-row {
      display: flex;
      gap: 20px;
    }
    .top-row > div, .bottom-row > div {
      flex: 1;
      min-height: 200px;
      background-color: #f0f0f0;
      border-radius: 8px;
      padding: 16px;
    }
    .global-performance-box {
      flex: 1;
      min-height: 300px;
      background-color: #f0f0f0;
      border-radius: 8px;
      padding: 16px;
    }
  `]
})
export class OverviewComponent {
  // Component logic goes here
}