import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  }

  // Clear search query and emit to subscribers
  resetSearch(item: string) {
    this.searchQuery = this.searchQuery.filter((word: string) => word != item);
    console.log('this.searchQuery: ', this.searchQuery);
    this.searchService.setQuery(this.searchQuery);
    this.searchInputEl.nativeElement.value = '';
    this.searchService.setZeroResults(false);
    this.searchService.resetSearch();
  }

  onInputChange(event: any) {
    this.searchInput = event.target.value;
    this.showCancelButton = this.searchInput.length > 0;
  }

  clearInput() {
    this.searchInputEl.nativeElement.value = '';
    this.showCancelButton = false;
  }
}
