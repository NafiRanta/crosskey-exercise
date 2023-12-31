import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Observable for query text
  private querySubject = new BehaviorSubject<string[]>([]);
  queryText$ = this.querySubject.asObservable();

  // Observable for query event
  private isQuerySubject = new BehaviorSubject<boolean>(false);
  isQuery$ = this.isQuerySubject.asObservable();

  // Observable for reset search
  private resetSubject = new BehaviorSubject<boolean>(false);
  reset$ = this.resetSubject.asObservable();

  // Get search query
  getQuery(): string[] {
    return this.querySubject.value;
  }

  // Emit search query to subscribers
  setQuery(searchText: string[]): void {
    this.querySubject.next(searchText);
    this.isQuerySubject.next(true); 
  }

  // Emit reset search to subscribers
  resetSearch(): void {
    this.querySubject.next([]);
    this.resetSubject.next(true);
  }
}
