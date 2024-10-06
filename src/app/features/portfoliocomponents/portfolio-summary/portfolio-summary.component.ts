import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-summary.component.html',
  styleUrl: './portfolio-summary.component.css'
})
export class PortfolioSummaryComponent {
  dailyChange = '+1.2%';
  marketSentiment = 'Neutral';
  riskLevel = 'Moderate';
  totalValue = '$10,000';
  cashBalance = '$2,000';
  netProfit = '+5%';
}

