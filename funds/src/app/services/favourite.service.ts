import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fund } from '../models/fund';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private favoritesSubject: BehaviorSubject<Fund[]> = new BehaviorSubject<Fund[]>([]);
  favorites$: Observable<Fund[]> = this.favoritesSubject.asObservable();
    // Observable for favourite button click
    private isFavouriteSubject = new BehaviorSubject<boolean>(false);
    isFavourite$ = this.isFavouriteSubject.asObservable();

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

    // Emit favourite button click to subscribers
    setFavourite(isFavourite: boolean): void {
    this.isFavouriteSubject.next(isFavourite);
  }
  private loadFavoritesFromLocalStorage() {
    const favoritesString = localStorage.getItem('favourites');
    const favorites = favoritesString ? JSON.parse(favoritesString) : [];
    this.favoritesSubject.next(favorites);
  }

  private updateLocalStorage(favorites: Fund[]) {
    localStorage.setItem('favourites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  addToFavorites(fund: Fund) {
    const favorites = [...this.favoritesSubject.value, fund];
    this.updateLocalStorage(favorites);
  }

  removeFromFavorites(fund: Fund) {
    const favorites = this.favoritesSubject.value.filter((f) => f.instrumentId !== fund.instrumentId);
    this.updateLocalStorage(favorites);
  }
}
