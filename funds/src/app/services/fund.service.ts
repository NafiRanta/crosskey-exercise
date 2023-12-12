import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fund } from '../models/fund';


@Injectable({
  providedIn: 'root'
})
export class FundService {
  private api = 'https://ivarpivar.netlify.app/api';
  private selectedFundSource = new BehaviorSubject<Fund | null>(null);
  selectedFund$ = this.selectedFundSource.asObservable();
  private funds: Fund[] = []; 
  
  private searchTextSubject = new BehaviorSubject<string[]>([]);
  searchText$ = this.searchTextSubject.asObservable();
  private searchTextSetSubject = new BehaviorSubject<boolean>(false);
  searchTextSet$ = this.searchTextSetSubject.asObservable();

  constructor(private http: HttpClient) { }

  getFundList(): Observable<any> {
    return this.http.get(this.api);
  }

  setFunds(funds: Fund[]) {
    this.funds = funds;
    if (funds.length > 0) {
      this.setSelectedFund(funds[0]); 
    }
  }

  setSelectedFund(fund: Fund | null) {
    this.selectedFundSource.next(fund);
  }

  getSearchText(): string[] {
    return this.searchTextSubject.value;
  }

  setSearchText(searchText: string[]): void {
    this.searchTextSubject.next(searchText);
    this.searchTextSetSubject.next(true); // Emit the event when searchText is set
  }
}
