import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchService } from 'src/app/services/search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, NgIf, MatButtonModule, MatIconModule, NgFor]
})
export class SearchComponent {
  searchQuery: string[] = [];
  showCloseIcon: boolean = false;
  @ViewChild('searchInput') searchInputEl: ElementRef;

  constructor(private searchService: SearchService) { }


  // Update search query and emit to subscribers
  updateSearch() {
    this.searchQuery = this.searchInputEl.nativeElement.value.split(' ').filter((word: string) => word.trim() != '');
    this.searchService.setQuery(this.searchQuery);
    this.showCloseIcon = this.searchQuery.length > 0;
  }

  // Clear search query and emit to subscribers
  cancelSearch(item: string) {
    this.searchQuery = this.searchQuery.filter((word: string) => word != item);
    console.log('this.searchQuery: ', this.searchQuery);
    this.searchService.setQuery(this.searchQuery);
    this.searchInputEl.nativeElement.value = '';
    this.showCloseIcon = this.searchQuery.length > 0;
    this.searchService.setZeroResults(false);
  }
}
