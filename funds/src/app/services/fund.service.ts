import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fund } from '../models/fund';


@Injectable({
  providedIn: 'root'
})
export class FundService {
  private api = 'https://ivarpivar.netlify.app/api';
  private funds: Fund[] = []; 

  // Observable for selected fund
  private selectedFundSubject = new BehaviorSubject<Fund | null>(null);
  selectedFund$ = this.selectedFundSubject.asObservable();
  
  // Observable for query text
  private querySubject = new BehaviorSubject<string[]>([]);
  queryText$ = this.querySubject.asObservable();

  // Observable for query event
  private isQuerySubject = new BehaviorSubject<boolean>(false);
  isQuery$ = this.isQuerySubject.asObservable();

  // Observable for fund type filter
  private filterFundTypeSubject = new BehaviorSubject<string>('All');
  filterFundTypeSubject$ = this.filterFundTypeSubject.asObservable();

  // Observable for fund company filter
  private filterFundCompanySubject = new BehaviorSubject<string>('All');
  filterFundCompanySubject$ = this.filterFundCompanySubject.asObservable();

  // Observable for currency filter
  private filterCurrencySubject = new BehaviorSubject<string>('All');
  filterCurrencySubject$ = this.filterCurrencySubject.asObservable();

  // Observable for zero results
  private isZeroResultsSubject = new BehaviorSubject<boolean>(false);
  isZeroResults$ = this.isZeroResultsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get API data
  getAPI(): Observable<any> {
    return this.http.get(this.api);
  }

  // Set fund array
  setFundsArr(funds: Fund[]) {
    this.funds = funds;
  }

  // Get filtered fund array
  getFunds(): Fund[] {
    return this.funds;
  }

  // Emit selected fund to subscribers
  setSelectedFund(fund: Fund | null) {
    this.selectedFundSubject.next(fund);
  }

  // Get search query
  getQuery(): string[] {
    return this.querySubject.value;
  }

  // Emit search query to subscribers
  setQuery(searchText: string[]): void {
    this.querySubject.next(searchText);
    this.isQuerySubject.next(true); 
  }

  // Emit selected currency to subscribers
  setSelectedFundType(fundType: string): void {
    this.filterFundTypeSubject.next(fundType);
  }

  // Emit selected currency to subscribers
  setSelectedFundCompany(fundCompany: string): void {
    this.filterFundCompanySubject.next(fundCompany);
  }

  // Emit selected currency to subscribers
  setSelectedCurrency(currency: string): void {
    this.filterCurrencySubject.next(currency);
  }

  // Emit zero results to subscribers
  setZeroResults(isZeroResults: boolean): void {
    this.isZeroResultsSubject.next(isZeroResults);
  }
}
