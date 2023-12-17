import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material/material.module';

import { SearchService } from 'src/app/services/search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: true,
    imports: [CommonModule, MaterialModule]
})
export class SearchComponent implements OnInit {
  searchQuery: string[] = [];
  searchInput: string = '';
  showCancelButton: boolean;
  @ViewChild('searchInput') searchInputEl: ElementRef;

  constructor(private searchService: SearchService ) { }
  
  ngOnInit(): void {
    this.showCancelButton = this.searchInput.length > 0;
  }

  // Update search query and emit to subscribers
  search() {
    this.searchQuery = this.searchInputEl.nativeElement.value.split(' ').filter((word: string) => word.trim() != '');
    this.searchService.setQuery(this.searchQuery);
    this.searchService.setZeroResults(false);
  }

  // Clear search query and emit to subscribers
  resetSearch(item: string) {
    this.searchQuery = this.searchQuery.filter((word: string) => word != item);
    this.searchService.setQuery(this.searchQuery);
    if (this.searchQuery.length === 0) {
      this.searchService.resetSearch();
      this.searchInputEl.nativeElement.value = '';
    }
  }

  // Display cancel button in search bar when user starts typing
  onInputChange(event: any) {
    this.showCancelButton = event.target.value.length > 0;
  }

  // Clear search input and hide cancel button
  clearInput() {
    this.searchInputEl.nativeElement.value = '';
    this.showCancelButton = false;
  }
}
