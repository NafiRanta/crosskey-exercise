import { Component, ElementRef, ViewChild } from '@angular/core';
import { FundService } from 'src/app/services/fund.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery: string[] = [];
  showCloseIcon: boolean = false;
  @ViewChild('searchInput') searchInputEl: ElementRef;

  constructor(private fundService: FundService) { }

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
  }
}
