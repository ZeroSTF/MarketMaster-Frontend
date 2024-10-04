import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js'; // Import Chart.js and registerables

// Register necessary components for Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  chart: any; // Main portfolio chart
  miniCharts: any[] = []; // Array to hold mini-chart instances for watchlist
  showTradeModal: boolean = false; // Control the trade modal visibility
  tradeAction: string = ''; // Action for buy or sell

  ngOnInit() {
    this.createMainChart(); // Initialize main portfolio chart
    this.createMiniCharts(); // Initialize mini-charts for watchlist
  }

  createMainChart() {
    const ctx = document.getElementById('portfolioChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // X-axis labels
        datasets: [
          {
            label: 'Portfolio Value',
            data: [10000, 10500, 11000, 10700, 11500, 12000, 13000], // Example data points
            fill: false,
            borderColor: '#007bff', // Line color
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createMiniCharts() {
    const stocks = ['GOOGL', 'AMZN']; // Array of stock identifiers for the watchlist
    stocks.forEach(stock => {
      const ctx = document.getElementById(`miniChart${stock}`) as HTMLCanvasElement;

      // Example mini-chart for each stock
      const miniChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [
            {
              data: [2800, 2825, 2795, 2840, 2800], // Replace with real data
              borderColor: stock === 'GOOGL' ? '#28a745' : '#dc3545',
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              display: false, // Hide Y-axis for a cleaner look
            },
            x: {
              display: false, // Hide X-axis for mini charts
            },
          },
        },
      });

      this.miniCharts.push(miniChart); // Store each mini-chart instance
    });
  }

  buyStock() {
    this.tradeAction = 'buy';
    this.showTradeModal = true; // Display trade modal with "Buy" action
  }

  sellStock() {
    this.tradeAction = 'sell';
    this.showTradeModal = true; // Display trade modal with "Sell" action
  }

  refreshData() {
    // Logic to refresh portfolio and watchlist data
  }

  closeModal() {
    this.showTradeModal = false; // Close trade modal
  }

  toggleDetails(event: any) {
    const row = event.target.closest('tr').nextElementSibling;
    if (row && row.classList.contains('details-row')) {
      row.classList.toggle('open'); // Toggle the visibility of the expanded row
    }
  }

  filterTransactions(timeframe: string) {
    // Logic to filter transactions by timeframe (1w, 1m, 3m)
  }
  openTradeModal(action: string) {
    this.tradeAction = action; // Set the trade action (buy/sell)
    this.showTradeModal = true; // Display the trade modal
  }
}
