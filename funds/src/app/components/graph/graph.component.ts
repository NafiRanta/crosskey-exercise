import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { GraphService } from 'src/app/services/graph.service';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables  } from 'chart.js';
import { FundService } from 'src/app/services/fund.service';
import annotationPlugin  from 'chartjs-plugin-annotation';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

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
    imports: [CommonModule, NgFor, MaterialModule, NgChartsModule, MatTableModule]
})

export class GraphComponent implements OnInit{
    @Input() selectedFund: Fund
    graphFunds: Fund[];
    performanceData: any = {};
    estimationDate: string;
    performanceChart: Chart;
    performanceCharts: Chart[] = [];
    displayedColumns: string[] = ['title', '1m', '3m', '1y', '3y'];
    dataSource = new MatTableDataSource<TableRow>([]);
    
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
        this.estimationDate = this.fundService.formatDate(this.selectedFund.estimationDate);
   
     // Initialize tableData array with empty values
 
    console.log("table", this.tableData);
    
    //Update values in tableData
    this.tableData[0].change1m = this.selectedFund.change1m;
    this.tableData[0].change3m = this.selectedFund.change3m;
    this.tableData[0].change1y = this.selectedFund.change1y;
    this.tableData[0].change3y = this.selectedFund.change3y;
    this.tableData[1].change1m = this.graphService.calculateBenchmark('change1m', this.graphFunds);
    this.tableData[1].change3m = this.graphService.calculateBenchmark('change3m', this.graphFunds);
    this.tableData[1].change1y = this.graphService.calculateBenchmark('change1y', this.graphFunds);
    this.tableData[1].change3y = this.graphService.calculateBenchmark('change3y', this.graphFunds);
    
    this.dataSource.data = this.tableData;  // Update dataSource with the new tableData
        
         // Create a new performance chart for the selected fund
        const chartConfig = this.createChartPerformance();
        this.performanceChart = new Chart('canvas', chartConfig);
    }

    ngOnAfterViewInit() {
        const chartConfig = this.createChartPerformance();
        this.performanceChart = new Chart('canvas', chartConfig);
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
