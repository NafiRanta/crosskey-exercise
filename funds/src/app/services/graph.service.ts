import { Injectable } from '@angular/core';
import { Fund } from '../models/fund';
import { FundService } from './fund.service';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private allfunds: Fund[] = [];
  SEKtoUSD: number = 0.0953;
  EURtoUSD: number = 1.0715;

  constructor(private fundService: FundService) { }

  getFundsWithGraph(): Fund[] {
    this.allfunds = this.fundService.getFunds();
    return this.allfunds.filter(fund => fund.isGraph);
  }

  calculateBenchmark(period: string, graphFunds: Fund[]): number {
    let benchmark: number = 0;
    graphFunds.forEach(fund => {
            benchmark += (fund[period] / fund.rate) * 100;
    });

    return benchmark / graphFunds.length;;
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

  calculateFundRate(fund: Fund, period: string): number {
    return (fund[period] / fund.rate) * 100;
  }

  caculateYearHigh(fund: Fund): number {
    return( (fund.rate - fund.yearHigh ) / 100) * 100;
  }

  caculateYearLow(fund: Fund): number {
    return (( fund.rate - fund.yearLow ) / 100) * 100;
  }
}

