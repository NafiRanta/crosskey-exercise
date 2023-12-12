import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FundService } from 'src/app/services/fund.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private fundService: FundService) { }

  searchText: string[] = [];
  @ViewChild('searchInput') searchInputEl: ElementRef;
  showCloseIcon: boolean = false;

  updateSearchText() {
    this.searchText = this.searchInputEl.nativeElement.value.split(' ').filter((word: string) => word.trim() != '');
    this.fundService.setSearchText(this.searchText);
    console.log("searchText: ", this.fundService.getSearchText());
    this.showCloseIcon = this.searchText.length > 0;
  }

  cancelSearch(item: string) {
    console.log("cancelSearch: ", item);
    this.searchText = this.searchText.filter((word: string) => word != item);
    this.fundService.setSearchText(this.searchText);
    this.searchInputEl.nativeElement.value = '';
    this.showCloseIcon = this.searchText.length > 0;
  }

}
