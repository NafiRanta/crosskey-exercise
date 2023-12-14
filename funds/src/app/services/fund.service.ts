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

  // Observable for filter event
  private isFilterSubject = new BehaviorSubject<Object[]>([]);
  isFilter$ = this.isFilterSubject.asObservable();

  // Observable for zero results
  private isZeroResultsSubject = new BehaviorSubject<boolean>(false);
  isZeroResults$ = this.isZeroResultsSubject.asObservable();

  // Observable for favourite changes
  private favouritesSubject = new BehaviorSubject<string[]>([]);
  favourites$ = this.favouritesSubject.asObservable();

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

  // Emit selected filters to subscribers
  setFilters(filter: any): void {
    if (!this.selectedFilters) {
      this.selectedFilters = [];
    }
    
    if (filter.value !== 'All') { 
      this.selectedFilters = this.selectedFilters.filter((selectedFilter: any) => {
        return selectedFilter.id !== filter.id;
      });     
      this.selectedFilters.push(filter); 
    } else{ // remove filter object that contains 'All' from value
      this.selectedFilters = this.selectedFilters.filter((selectedFilter: any) => {
        return selectedFilter.id !== filter.id;
      });
    }
      
      this.isFilterSubject.next(this.selectedFilters);
  }

  // Emit favourite changes to subscribers
  updateFavourites(favourites: string[]): void {
    this.favouritesSubject.next(favourites);
  }

  // Emit zero results to subscribers
  setZeroResults(isZeroResults: boolean): void {
    this.isZeroResultsSubject.next(isZeroResults);
  }
}
