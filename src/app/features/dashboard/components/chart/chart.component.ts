import { Component, inject, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';  // Import Chart.js
import { PortfolioService } from '../../../../services/portfolio.service';
import { AuthService } from '../../../../auth/auth.service';

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
  username: string = 'zerostf'; 
  private authService=inject(AuthService);
  totalValues: { key: string, value: number }[] = []; 

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.fetchTotalValues();  // Initialize the chart on component load
    const currentUser=this.authService.currentUser();
    if(currentUser){
    this.username=currentUser.username;}
  }

  fetchTotalValues() {
    this.portfolioService.getTotalValues(this.username).subscribe(
      (data) => {
        console.log('API Data:', data);

        // Parse API response to ensure proper formatting
        this.totalValues = data.map(item => ({
          key: Object.keys(item)[0],  // Extract date
          value: parseFloat(Object.values(item)[0] as string)  // Extract and parse value
        }));

        console.log('Parsed Total Values:', this.totalValues);

        // Initialize the chart with all data
        const labels = this.totalValues.map(item => item.key);
        const values = this.totalValues.map(item => item.value);

        this.initializeChart(labels, values);
      },
      (error) => {
        console.error('Error fetching total values:', error);
      }
    );
  }

  initializeChart(labels: string[], values: number[]) {
    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    const canvasContext = ctx.getContext('2d');
    if (!canvasContext) {
      console.error('Canvas context not found');
      return;
    }

    // Destroy the existing chart instance, if any
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    // Initialize the chart
    this.performanceChart = new Chart(canvasContext, {
      type: 'line',
      data: {
        labels, // x-axis labels (dates)
        datasets: [
          {
            label: 'Portfolio Value',
            data: values, // y-axis data points
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4, // Smooth line
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Value',
            },
          },
        },
      },
    });
  }

  filterData(period: string) {
    this.selectedPeriod = period;

    // Current date
    const now = new Date();
    let comparisonDate = new Date();

    // Adjust comparison date based on the selected period
    switch (period) {
      case '5d':
        comparisonDate.setDate(now.getDate() - 5);
        break;
      case '10d':
        comparisonDate.setDate(now.getDate() - 10);
        break;
      case '1m':
        comparisonDate.setMonth(now.getMonth() - 1);
        break;
      case '6m':
        comparisonDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        comparisonDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        console.error('Invalid period:', period);
        return;
    }

    console.log('Comparison Date:', comparisonDate);

    // Filter data based on the comparison date
    const filteredData = this.totalValues.filter(item => {
      const itemDate = new Date(item.key);
      if (isNaN(itemDate.getTime())) {
        console.error('Invalid date format in totalValues:', item.key);
        return false;
      }
      return itemDate >= comparisonDate;
    });

    const filteredLabels = filteredData.map(item => item.key);
    const filteredValues = filteredData.map(item => item.value);

    console.log('Filtered Labels:', filteredLabels);
    console.log('Filtered Values:', filteredValues);

    // Update chart data
    if (this.performanceChart) {
      this.performanceChart.data.labels = filteredLabels;
      this.performanceChart.data.datasets[0].data = filteredValues;
      this.performanceChart.update();
    } else {
      console.error('Chart not initialized');
    }
  }
}
