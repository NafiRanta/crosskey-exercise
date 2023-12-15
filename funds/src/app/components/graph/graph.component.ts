import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { GraphService } from 'src/app/services/graph.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
    standalone: true,
    imports: [CommonModule, NgFor, MaterialModule]
})
export class GraphComponent implements OnInit{
    @Input() selectedFund: Fund
    graphFunds: Fund[];
    performanceData: any = {};
    estimationDate: any;


    constructor(
        private graphService: GraphService) {}

    ngOnInit() {
        this.graphFunds = this.graphService.getFundsWithGraph();
        this.estimationDate = new Date(this.selectedFund.estimationDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
        
        this.performanceData['change1m'] = this.calculatePerformanceData('change1m');
        this.performanceData['change3m'] = this.calculatePerformanceData('change3m');
        this.performanceData['change1y'] = this.calculatePerformanceData('change1y');
        this.performanceData['change3y'] = this.calculatePerformanceData('change3y');
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
}
