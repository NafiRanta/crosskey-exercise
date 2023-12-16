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
  selectedFilters: any;

  // Observable for selected fund
  private selectedFundSubject = new BehaviorSubject<Fund | null>(null);
  selectedFund$ = this.selectedFundSubject.asObservable();
  
  // Observable for query text
  private querySubject = new BehaviorSubject<string[]>([]);
  queryText$ = this.querySubject.asObservable();

  // Observable for query event
  private isQuerySubject = new BehaviorSubject<boolean>(false);
  isQuery$ = this.isQuerySubject.asObservable();

  // Observable for zero results
  private isZeroResultsSubject = new BehaviorSubject<boolean>(false);
  isZeroResults$ = this.isZeroResultsSubject.asObservable();

  // Observable for favourite button click
  private isFavouriteSubject = new BehaviorSubject<boolean>(false);
  isFavourite$ = this.isFavouriteSubject.asObservable();

  // Observable for all button click
  private isAllSubject = new BehaviorSubject<boolean>(false);
  isAll$ = this.isAllSubject.asObservable();

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

  // Emit zero results to subscribers
  setZeroResults(isZeroResults: boolean): void {
    this.isZeroResultsSubject.next(isZeroResults);
  }

  // Emit favourite button click to subscribers
  setFavourite(isFavourite: boolean): void {
    this.isFavouriteSubject.next(isFavourite);
  }

  // Emit all button click to subscribers
  setAll(isAll: boolean): void {
    this.isAllSubject.next(isAll);
  }

  formatDate(dateString: number): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
  }
}
