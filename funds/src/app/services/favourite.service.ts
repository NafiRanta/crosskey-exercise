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
    private isFavouriteButtonClickedSubject = new BehaviorSubject<boolean>(false);
    isFavouriteButtonClicked$ = this.isFavouriteButtonClickedSubject.asObservable();

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  // Emit favourite button click to subscribers
  setFavourite(isFavourite: boolean): void {
    this.isFavouriteButtonClickedSubject.next(isFavourite);
  }

  // Load favourites from local storage
  private loadFavoritesFromLocalStorage() {
    const favoritesString = localStorage.getItem('favourites');
    const favorites = favoritesString ? JSON.parse(favoritesString) : [];
    this.favoritesSubject.next(favorites);
  }

  // Add or remove fund from favourites
  addToFavorites(fund: Fund) {
    const favorites = [...this.favoritesSubject.value, fund];
    this.updateLocalStorage(favorites);
  }

  // Remove fund from favourites
  removeFromFavorites(fund: Fund) {
    const favorites = this.favoritesSubject.value.filter((f) => f.instrumentId !== fund.instrumentId);
    this.updateLocalStorage(favorites);
  }

  // Update local storage and emit new value to subscribers
  private updateLocalStorage(favorites: Fund[]) {
    localStorage.setItem('favourites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

   // Update favourite property for each fund
   updateFavouriteProperties(allFunds: Fund[], favFunds: Fund[]): void {
    let favFund = localStorage.getItem('favourites');
    if (favFund) {
      favFunds = JSON.parse(favFund);
      this.favoritesSubject.next(favFunds);
    }
    allFunds.forEach((fund: Fund) => {
      if (favFunds.some((favFund: Fund) => {
        return fund.instrumentId === favFund.instrumentId;
      })) {
        fund.isFavourite = true;
      } else {
        fund.isFavourite = false;
      }
    });
  }
}
