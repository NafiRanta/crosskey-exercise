import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { FundComponent } from './fund/fund.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
@Component({
    selector: 'app-fund-list',
    templateUrl: './fund-list.component.html',
    styleUrls: ['./fund-list.component.css'],
    standalone: true,
    imports: [NgIf, MatIconModule, MatTooltipModule, NgFor, FundComponent]
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

  // Display all funds if searchText is empty
  // Set filteredFunds to include only funds that match the isin, fundName, fundType, or fundCompany
  filterFunds(): void {
    if (this.searchText?.length > 0) {
      this.filteredFunds = this.allFunds.filter(fund =>
        this.searchText.some(keyword =>
          (fund.fundName?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
          (fund.fundType?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
          (fund.fundCompany?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
          (fund.isin?.toLowerCase() || '').includes(keyword.toLowerCase()) 
        )
      );
      if (this.filteredFunds.length === 0) {
        this.fundService.setZeroResults(true);
      }
      this.fundService.setFundArr(this.filteredFunds);
    } else {
      this.filteredFunds = this.allFunds;
      this.fundService.setFundArr(this.filteredFunds);
    }
  }
}
