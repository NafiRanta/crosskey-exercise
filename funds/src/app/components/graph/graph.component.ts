import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'],
    standalone: true,
    imports: [CommonModule, NgFor]
})
export class GraphComponent implements OnInit{
    @Input() selectedFund: Fund
    allFunds: Fund[] = this.fundService.getFunds();
    graphFunds: Fund[];
    benchmarkData: any;
    performanceData: any;
    performance1m: any;
    performance3m: any;
    performance1y: any;
    performance3y: any;
    SEKtoUSD: number = 0.0953;
    EURtoUSD: number = 1.0715;
    estimationDate: any;


    constructor(private fundService: FundService) {}

    ngOnInit() {
        this.graphFunds = this.getFundsWithGraph();
        this.estimationDate = new Date(this.selectedFund.estimationDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
        
        this.performance1m = this.calculatePerformanceData('change1m');
        console.log("performance1m", this.performance1m);

        this.performance3m = this.calculatePerformanceData('change3m');
        console.log("performance3m", this.performance3m);

        this.performance1y = this.calculatePerformanceData('change1y');
        console.log("performance1y", this.performance1y);

        this.performance3y = this.calculatePerformanceData('change3y');
        console.log("performance3y", this.performance3y);

        
        console.log("all funds len: ", this.allFunds.length);
        console.log("change1m", this.calculateBenchmark('change1m'));
        console.log("change3m", this.calculateBenchmark('change3m'));
    }

    calculatePerformanceData(period: string): any {
        let result: any
        let conversionRate: number;
        if (this.selectedFund.currency === 'EUR') {
            conversionRate = this.EURtoUSD; 
        } else if (this.selectedFund.currency === 'SEK') {
            conversionRate = this.SEKtoUSD;
        } else {
            conversionRate = 1;
        }


        if (period === 'change1m') {
            result = {
                "conversionRate": conversionRate,
                "estimationDate": this.estimationDate,
                "fund": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund[period], this.selectedFund.currency): this.selectedFund[period],
                "benchmark": this.calculateBenchmark(period),
                "rate": this.selectedFund.currency!== 'USD' ? this.convertToUSD(this.selectedFund.rate, this.selectedFund.currency): this.selectedFund.rate,
                "yearHigh": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearHigh, this.selectedFund.currency): this.selectedFund.yearHigh,
                "yearLow": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearLow, this.selectedFund.currency): this.selectedFund.yearLow
            }
        } else if (period === 'change3m') {
            result = {
                "conversionRate": conversionRate,
                "estimationDate": this.estimationDate,
                "fund": this.selectedFund[period],
                "benchmark": this.calculateBenchmark(period),
                "rate": this.selectedFund.currency!== 'USD' ? this.convertToUSD(this.selectedFund.rate, this.selectedFund.currency): this.selectedFund.rate,
                "yearHigh": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearHigh, this.selectedFund.currency): this.selectedFund.yearHigh,
                "yearLow": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearLow, this.selectedFund.currency): this.selectedFund.yearLow
            }
        } else if (period === 'change1y') {
            result = {
                "conversionRate": conversionRate,
                "estimationDate": this.estimationDate,
                "fund": this.selectedFund[period],
                "benchmark": this.calculateBenchmark(period),
                "rate": this.selectedFund.currency!== 'USD' ? this.convertToUSD(this.selectedFund.rate, this.selectedFund.currency): this.selectedFund.rate,
                "yearHigh": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearHigh, this.selectedFund.currency): this.selectedFund.yearHigh,
                "yearLow": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearLow, this.selectedFund.currency): this.selectedFund.yearLow
            }
        } else if (period === 'change3y') {
            result = {
                "conversionRate": conversionRate,
                "estimationDate": this.estimationDate,
                "fund": this.selectedFund[period],
                "benchmark": this.calculateBenchmark(period),
                "rate": this.selectedFund.currency!== 'USD' ? this.convertToUSD(this.selectedFund.rate, this.selectedFund.currency): this.selectedFund.rate,
                "yearHigh": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearHigh, this.selectedFund.currency): this.selectedFund.yearHigh,
                "yearLow": this.selectedFund.currency!== 'USD'? this.convertToUSD(this.selectedFund.yearLow, this.selectedFund.currency): this.selectedFund.yearLow
            }
        }
        return result;
    }

    getFundsWithGraph(): Fund[] {
        return this.allFunds.filter(fund => fund.isGraph);
    }


    convertToUSD(value: number, currency: string): number {
        let rate: number;
        if (currency === 'USD') {
            rate = 1;
        } else if (currency === 'EUR') {
            rate = this.EURtoUSD;
        } else if (currency === 'SEK') {
            rate = this.SEKtoUSD;
        } 
        return value * rate;
    }

    calculateBenchmark(period: string): number {
        let benchmark: number = 0;
        this.graphFunds.forEach(fund => {
            if (fund.currency !== 'USD') {
                benchmark += this.convertToUSD(fund[period], fund.currency) / this.graphFunds.length;
            } else{
                benchmark += fund[period] / this.graphFunds.length;
            }
        });
        return benchmark;
    }
}
