import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';  // Import Chart.js

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  performanceChart: any;  // Reference for the chart
  selectedPeriod: string = '1m';  // Default period is 1 month

  ngOnInit(): void {
    this.initializeChart();  // Initialize the chart on component load
  }

  // Function to initialize the Chart.js chart
  initializeChart() {
    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
    this.performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getLabelsForPeriod(this.selectedPeriod),
        datasets: [{
          label: 'Portfolio Performance',
          data: this.getDataForPeriod(this.selectedPeriod),
          backgroundColor: 'rgba(30, 136, 229, 0.2)',  // Color #1E88E5 with transparency for fill
          borderColor: '#1E88E5',  // Border color #1E88E5
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
              color: '#666'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Performance (%)',
              color: '#666'
            }
          }
        }
      }
    });
  }

  // Function to get labels based on the selected period
  getLabelsForPeriod(period: string): string[] {
    switch (period) {
      case '5d': return ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
      case '10d': return ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];
      case '1m': return this.getDaysInMonth();
      case '6m': return this.getMonths(6);
      case '1y': return this.getMonths(12);
      default: return [];
    }
  }

  // Function to get data based on the selected period
  getDataForPeriod(period: string): number[] {
    switch (period) {
      case '5d': return [2, 4, 6, 5, 8];  // Example data for 5 days
      case '10d': return [2, 4, 6, 5, 8, 7, 3, 6, 4, 9];  // Example data for 10 days
      case '1m': return Array(30).fill(0).map(() => Math.floor(Math.random() * 10) + 1);  // Random data for 30 days
      case '6m': return Array(6).fill(0).map(() => Math.floor(Math.random() * 10) + 1);  // Random data for 6 months
      case '1y': return Array(12).fill(0).map(() => Math.floor(Math.random() * 10) + 1);  // Random data for 12 months
      default: return [];
    }
  }

  // Helper functions
  getDaysInMonth(): string[] {
    return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  }

  getMonths(months: number): string[] {
    return Array.from({ length: months }, (_, i) => `Month ${i + 1}`);
  }

  // Function to handle the filter selection and update the chart
  filterData(period: string) {
    this.selectedPeriod = period;
    this.performanceChart.data.labels = this.getLabelsForPeriod(period);
    this.performanceChart.data.datasets[0].data = this.getDataForPeriod(period);
    this.performanceChart.update();  // Update the chart with new data
  }
}
