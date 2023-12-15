import { Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { FundService } from 'src/app/services/fund.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, NgIf, MatButtonModule, MatIconModule, NgFor]
})
export class SearchComponent implements OnChanges {
  searchQuery: string[] = [];
  showCloseIcon: boolean = false;
  @ViewChild('searchInput') searchInputEl: ElementRef;

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked();  
  }

  ngOnChanges(): void {
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked();  
  }

  // Display funds that are in favourites
  subscribeToFavouriteButtonClicked(): void {
    this.fundService.isFavourite$.subscribe((isFavourite) => {
      if (isFavourite) {
       this.searchQuery = [];
       this.searchInputEl.nativeElement.value = '';
      }
    });
  }

  // Display all funds
  subscribeToAllButtonClicked(): void {
    this.fundService.isAll$.subscribe((isAll) => {
      if (isAll) {
       this.searchQuery = [];
        this.searchInputEl.nativeElement.value = '';
      }
    });
  }

  // Update search query and emit to subscribers
  updateSearch() {
    this.searchQuery = this.searchInputEl.nativeElement.value.split(' ').filter((word: string) => word.trim() != '');
    this.fundService.setQuery(this.searchQuery);
    this.showCloseIcon = this.searchQuery.length > 0;
  }

  // Clear search query and emit to subscribers
  cancelSearch(item: string) {
    this.searchQuery = this.searchQuery.filter((word: string) => word != item);
    this.fundService.setQuery(this.searchQuery);
    this.searchInputEl.nativeElement.value = '';
    this.showCloseIcon = this.searchQuery.length > 0;
    this.fundService.setZeroResults(false);
  }
}
