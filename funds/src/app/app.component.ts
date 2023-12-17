import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MaterialModule } from './modules/material/material.module';

import { SearchComponent } from './components/search/search.component';
import { FundListComponent } from './components/fund-list/fund-list.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchService } from './services/search.service';
import { FavouriteService } from './services/favourite.service';
import { FundService } from './services/fund.service';
import { Fund } from './models/fund';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
      SearchComponent, 
      AsyncPipe, 
      CommonModule, 
      FundListComponent, 
      MaterialModule, 
      FilterComponent]
})

export class AppComponent implements OnInit{
  title = 'Investment Funds';
  isLoading = true;
  isError = false;
  allFunds$: Observable<Fund[]>;
  isSmallScreen: boolean = false;
  noResults: boolean = false;
  noFavorites: boolean = false;
  favourites: Fund[] = [];

  constructor(
    private fundService: FundService,
    private searchService: SearchService,
    private favouriteService: FavouriteService
    ) { }
  
  ngOnInit(): void {
    this.getAPIData();
    this.subscribeToNoResults();
    this.subscribeToFavourites();
  }

  // Get API data
  // Show spinner while loading API data
  // Show error message if there's an error
  // Update graph and favourite properties for each fund
  // Assign data object from API data to allFunds$ if no error
  // Pass allFunds$ to fund-list component
  getAPIData(): void {
    this.fundService.getAPI().pipe().subscribe({
      next: response => {
        console.log('response: ', response);
        this.isLoading = false;
        this.isError = false;
        this.updateGraphProperties(response[0].data);
        this.updateFavouriteProperties(response[0].data);
        this.allFunds$ = of(response[0].data);
        this.fundService.setAllFunds(response[0].data);
      },
      error: error => {
        this.isLoading = false;
        this.isError = true;
        console.error('There was an error!', error);
      }
    })  
  }

  // Update graph property for each fund
  updateGraphProperties(allFunds: Fund[]): void {
    allFunds.forEach((fund: Fund) => {
      if (this.isGraphPropertiesEmpty(fund)) {
        fund.isGraph = false;
      } else {
        fund.isGraph = true;
      }
    });
  }

  // Update favourite property for each fund
  updateFavouriteProperties(allFunds: Fund[]): void {
    let favFund = localStorage.getItem('favourites');
    if (favFund) {
      this.favourites = JSON.parse(favFund);
    }
    allFunds.forEach((fund: Fund) => {
      if (this.favourites.some((favFund: Fund) => {
        return fund.instrumentId === favFund.instrumentId;
      })) {
        fund.isFavourite = true;
      } else {
        fund.isFavourite = false;
      }
    });
  }

  // Helper method to check if graph properties are empty
  isGraphPropertiesEmpty(fund: Fund): boolean {
    return (
      fund.change1m === null &&
      fund.change3m === null &&
      fund.change1y === null &&
      fund.change3y === null &&
      fund.yearHigh === null &&
      fund.yearLow === null
    );
  }

  // Display no results found if isZeroResults$ is true
  subscribeToNoResults(): void {
    this.searchService.isZeroResults$.subscribe((zeroResults) => {
      if (zeroResults) {
        this.noResults = true;
      } else {  
        this.noResults = false;
      }
    });
  }

  // Display no favourties found if isZeroFavourites$ is true
  subscribeToFavourites(): void {
    this.favouriteService.favorites$.subscribe((favourites) => {
      console.log('FAVOURITES: ', favourites)
      if (favourites.length === 0) {
        this.noFavorites = true;
      } else {  
        this.noFavorites = false;
      }
    });
  }

  // Display all funds if all button is clicked
  showAll(): void {
    this.fundService.setAll(true);
    this.favouriteService.setFavourite(false);
    this.noFavorites = false;
    this.searchService.setQuery([]);
  }

  // Display favourite funds if favourite button is clicked
  showFavourites(): void {
    this.favouriteService.setFavourite(true);
    this.fundService.setAll(false); 
    this.searchService.setQuery([]);
  }
}

