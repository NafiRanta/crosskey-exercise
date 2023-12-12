import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.css']
})
export class FundListComponent implements OnInit{
@Input() funds: Fund[];
searchText: string[] = [];
filteredFunds: Fund[]; 

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.fundService.setFunds(this.funds);
    this.fundService.searchTextSet$.subscribe((isSet) => {
      if (isSet) {
        console.log("setSearchText fund-list", this.fundService.getSearchText());
        this.searchText = this.fundService.getSearchText();
      }
      this.filterFunds();
    });
    
    console.log("filteredFunds: ", this.filteredFunds);
  }

  ngOnChanges(): void {
    this.filterFunds();
  }

  filterFunds(): void {
    if (this.searchText?.length > 0) {
      // Use filter to include only funds that match the searchText
      this.filteredFunds = this.funds.filter(fund =>
        this.searchText.some(keyword =>
          fund.fundName.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    } else {
      // If there's no searchText, display all funds
      this.filteredFunds = this.funds;
    }
  }
}
