import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables  } from 'chart.js';
import annotationPlugin  from 'chartjs-plugin-annotation';

import { Fund } from 'src/app/models/fund';
import { GraphService } from 'src/app/services/graph.service';
import { FundService } from 'src/app/services/fund.service';

interface TableRow {
    title: string;
    change1m: number; 
    change3m: number; 
    change1y: number; 
    change3y: number; 
  }

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
    standalone: true,
    imports: [CommonModule, MaterialModule, NgChartsModule, MatTableModule]
})

export class GraphComponent implements OnInit{
    @Input() selectedFund: Fund
    graphFunds: Fund[];
    latestEstimationDate: string;
    performanceChart: any;
    displayedColumns: string[] = ['Details', '1m', '3m', '1y', '3y'];
    dataSource = new MatTableDataSource<TableRow>([]);
    
    // Initialize tableData array with empty values
    tableData: TableRow[] = [
        {title: 'Fund', change1m: 0, change3m: 0, change1y: 0, change3y: 0},
        {title: 'Benchmark', change1m: 0, change3m: 0, change1y: 0, change3y: 0}
    ];
 
    constructor(
        private graphService: GraphService, private fundService: FundService) {
            Chart.register(...registerables);
            Chart.register(annotationPlugin);           
        }

    ngOnInit() {    
        this.graphFunds = this.graphService.getFundsWithGraph();
        if (this.selectedFund.isGraph) {
           this.latestEstimationDate = this.fundService.formatDate(this.selectedFund.latestClosePriceDate);
        
            //Update values in tableData
            this.updateTableData();
            this.dataSource.data = this.tableData; 
            
            // Create performance chart for selected fund
            const chartConfig = this.createChartPerformance();
            this.performanceChart = new Chart('canvas', chartConfig);
        }
    }

    // Update tableData values
    updateTableData() {
        this.tableData[0].change1m = this.graphService.calculateFundRate(this.selectedFund, 'change1m');
        this.tableData[0].change3m = this.graphService.calculateFundRate(this.selectedFund, 'change3m');
        this.tableData[0].change1y = this.graphService.calculateFundRate(this.selectedFund, 'change1y');
        this.tableData[0].change3y = this.graphService.calculateFundRate(this.selectedFund, 'change3y');
        this.tableData[1].change1m = this.graphService.calculateBenchmark('change1m', this.graphFunds);
        this.tableData[1].change3m = this.graphService.calculateBenchmark('change3m', this.graphFunds);
        this.tableData[1].change1y = this.graphService.calculateBenchmark('change1y', this.graphFunds);
        this.tableData[1].change3y = this.graphService.calculateBenchmark('change3y', this.graphFunds);
    }
    
    // Create performance chart for selected fund
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
    
    // Get benchmark data for performance table
    getBenchmarkData(): number[] {
        return [
            this.graphService.calculateBenchmark('change3y', this.graphFunds),
            this.graphService.calculateBenchmark('change1y', this.graphFunds),
            this.graphService.calculateBenchmark('change3m', this.graphFunds),
            this.graphService.calculateBenchmark('change1m', this.graphFunds),
        ];
    }
}
