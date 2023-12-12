import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.css']
})
export class FundListComponent implements OnInit{
@Input() allFunds: Fund[];
searchText: string[] = [];
filteredFunds: Fund[]; 

  constructor(private fundService: FundService) { }

  // Initialize filteredFunds with allFunds
  // Subscribe to isQuery$, if true, set searchText to query
  // Display funds that match the searchText via filterFunds()
  ngOnInit(): void {
    this.fundService.setFundArr(this.allFunds);
    this.fundService.isQuery$.subscribe((query) => {
      if (query) {
        this.searchText = this.fundService.getQuery();
      }
      this.filterFunds();
    });
  }

  ngOnChanges(): void {
    this.filterFunds();
  }

  filterFunds(): void {
    if (this.searchText?.length > 0) {
      // Use filter to include only funds that match the searchText
      this.filteredFunds = this.allFunds.filter(fund =>
        this.searchText.some(keyword =>
          fund.fundName.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      this.fundService.setFundArr(this.filteredFunds);
    } else {
      // If there's no searchText, display all funds
      this.filteredFunds = this.allFunds;
      this.fundService.setFundArr(this.filteredFunds);
    }
    
  }
}
