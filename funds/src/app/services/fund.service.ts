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

  constructor(private http: HttpClient) { }

  // Get API data
  getAPI(): Observable<any> {
    return this.http.get(this.api);
  }

  // Set fund array
  setFundArr(funds: Fund[]) {
    this.funds = funds;
    if (funds.length > 0) {
      this.setSelectedFund(funds[0]); 
    }
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
}
