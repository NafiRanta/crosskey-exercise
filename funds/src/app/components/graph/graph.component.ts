import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { GraphService } from 'src/app/services/graph.service';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables  } from 'chart.js';
import { FundService } from 'src/app/services/fund.service';
import annotationPlugin  from 'chartjs-plugin-annotation';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
    standalone: true,
    imports: [CommonModule, NgFor, MaterialModule, NgChartsModule]
})
export class GraphComponent implements OnInit{
    @Input() selectedFund: Fund
    graphFunds: Fund[];
    performanceData: any = {};
    estimationDate: string;
    performanceChart: Chart;
    performanceCharts: Chart[] = [];

    constructor(
        private graphService: GraphService, private fundService: FundService) {
            Chart.register(...registerables);
            Chart.register(annotationPlugin);
        }

    ngOnInit() {
        this.graphFunds = this.graphService.getFundsWithGraph();
        this.estimationDate = this.fundService.formatDate(this.selectedFund.estimationDate);
        
        this.performanceData['change1m'] = this.calculatePerformanceData('change1m');
        this.performanceData['change3m'] = this.calculatePerformanceData('change3m');
        this.performanceData['change1y'] = this.calculatePerformanceData('change1y');
        this.performanceData['change3y'] = this.calculatePerformanceData('change3y');
        
         // Create a new performance chart for the selected fund
        const chartConfig = this.createChartPerformance();
        this.performanceChart = new Chart('canvas', chartConfig);
    }

    ngOnAfterViewInit() {
        const chartConfig = this.createChartPerformance();
        this.performanceChart = new Chart('canvas', chartConfig);
    }

    calculatePerformanceData(period: string): any {
        return {
            "fundChange": this.selectedFund[period],
            "fundRate": this.graphService.calculateFundRate(this.selectedFund, period),
            "benchmark": this.graphService.calculateBenchmark(period, this.graphFunds),
            "rate": this.selectedFund.rate,
            "yearHigh": this.graphService.caculateYearHigh(this.selectedFund),
            "yearLow": this.graphService.caculateYearLow(this.selectedFund),
        };
    }

    createChartPerformance(): any {
        const chartConfig = {
            type: 'line',
            data: {
                labels: [
                    '3y',
                    '1y',
                    '3m',
                    '1m',
                    this.fundService.formatDate(this.selectedFund.estimationDate)
                ],
                datasets: [{
                    label: 'Fund',
                    data: this.graphService.getChartChangeDataset(this.selectedFund),
                    borderWidth: 3,
                    fill: false,
                    backgroundColor: 'rgba(93, 175, 89, 0.1)',
                    borderColor: '#3e95cd',
                },
                {
                    label: 'Benchmark',
                    data: this.getBenchmarkData(),
                    borderWidth: 3,
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderColor: '#ff6384',
                }]
            },
            options: {
                scales: {
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    annotation: {
                        annotations: [
                            this.graphService.getYearHighAnnotation(this.selectedFund),
                            this.graphService.getYearLowAnnotation(this.selectedFund)
                        ]
                    }
                }
            }
        };
    
        return chartConfig;
    }
    

    getBenchmarkData(): number[] {
        return [
            this.graphService.calculateBenchmark('change3y', this.graphFunds),
            this.graphService.calculateBenchmark('change1y', this.graphFunds),
            this.graphService.calculateBenchmark('change3m', this.graphFunds),
            this.graphService.calculateBenchmark('change1m', this.graphFunds),
        ];
    }
}
