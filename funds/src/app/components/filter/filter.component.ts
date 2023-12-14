import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { MatFormField } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() fundsArr: Fund[];
  @ViewChild("selectedCurrency") selectedCurrency: MatFormField;
  @ViewChild("selectedFundType") selectedFundType: MatFormField;
  filterByCurrency: string[] = [];
  filterByFundType: string[] = [];
  filterByFundCompany: string[] = [];
  isFavourites: boolean = false;
  filterByFavourites: Fund[] = [];
  favourites: string[] = [];
  formattedFilterByFavourites: any;

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeFavourites();
  }

  ngOnChanges(): void {
    this.subscribeToFavouriteChanges();
  }

  // Call initializeFilterArray() for each filter array
  // Add 'None' to filter arrays
  private initializeFilters(): void {
    this.initializeFilterArray(this.filterByCurrency, 'currency');
    this.initializeFilterArray(this.filterByFundType, 'fundType');

    this.filterByCurrency.unshift('None');
    this.filterByFundType.unshift('None');
    this.filterByFundCompany.unshift('None');
  }

  // Loop through fundsArr and add currency, fundType, fundCompany values to respective filter arrays
  private initializeFilterArray(filterArray: string[], propertyName: string): void {
    this.fundsArr.forEach(fund => {
      const propertyValue = fund[propertyName];
      if (propertyValue && !filterArray.includes(propertyValue)) {
        filterArray.push(propertyValue);
      }
    });
    filterArray.sort();
  }

  // Get favourites from local storage if any and replace ids with fund names
  private initializeFavourites(): void {
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      this.favourites = JSON.parse(storedFavourites);
      this.isFavourites = true;
    } else {
      this.filterByFavourites = [];

      document.getElementById('fav-button').classList.add('disabled');
    }
  }

  resetFilters(): void {
    this.fundService.setFilters({ id: 'currency', value: 'None' });
    this.fundService.setFilters({ id: 'fundType', value: 'None' });
    // reset mat-selects
    this.selectedCurrency._control.value = 'None';
    this.selectedFundType._control.value = 'None';
  }

  showFavourites(): void {
    console.log('showFavourites');
    this.isFavourites = true;
    this.fundService.setFavourite(true);
  }

  // Subscribe to favourite changes
  private subscribeToFavouriteChanges(): void {
    this.fundService.favourites$.subscribe((favourites) => {
      this.filterByFavourites = favourites || [];
      
    });
  }

  // Emit selected filters to subscribers
  onFundTypeSelectionChange(event: any) {
    console.log('event: ', event);
    const filterData = {
      id: event.source.id,
      value: event.value
    };
    this.fundService.setFilters(filterData);
  }
}
