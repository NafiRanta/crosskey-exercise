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
@Input() fundsArr: Fund[];
searchText: string[] = [];
fundsToDisplay: Fund[]; 
selectedFilters: any;

  constructor(private fundService: FundService) { }

  // Initialize filteredFunds with allFunds
  // Subscribe to isQuery$, if true, set searchText to query
  // Display funds that match the searchText via filterFunds()
  ngOnInit(): void {
    this.fundService.setFundsArr(this.fundsArr);
  }

  ngOnChanges(): void {
    this.fundService.isQuery$.subscribe((query) => {
      if (query) {
        this.searchText = this.fundService.getQuery();
      }
      console.log('searchText: ', this.searchText)
    });  
    
    this.fundService.isFilter$.subscribe((filterArr) => {
      if (filterArr) {
        this.selectedFilters = filterArr;
      }
      console.log('selectedFilters: ', this.selectedFilters)
    });
   this.filterFunds(this.searchText, this.selectedFilters);
  

  }

  // Display all funds if searchText is empty
  // Set filteredFunds to include only funds that match the isin, fundName, fundType, or fundCompany
  filterFunds(searchText: string[], filterArr: string[]): void {
    if (searchText?.length > 0 || filterArr?.length > 0) {
      // funds to display to show funds that match the search text and selected filters
      this.fundsToDisplay = this.fundsArr.filter((fund: Fund) => {
        return searchText.every((word: string) => {
          return fund.isin.toLowerCase().includes(word.toLowerCase()) ||
            fund.fundName.toLowerCase().includes(word.toLowerCase()) ||
            fund.fundType.toLowerCase().includes(word.toLowerCase()) ||
            fund.fundCompany.toLowerCase().includes(word.toLowerCase());
        }) || filterArr.every((filter: string) => {
          return fund.isin.toLowerCase().includes(filter.toLowerCase()) ||
            fund.fundName.toLowerCase().includes(filter.toLowerCase()) ||
            fund.fundType.toLowerCase().includes(filter.toLowerCase()) ||
            fund.fundCompany.toLowerCase().includes(filter.toLowerCase());
        });
      });

      console.log('fundsToDisplay: ', this.fundsToDisplay);
      if (this.fundsToDisplay.length === 0) {
        this.fundService.setZeroResults(true);
      }
      this.fundService.setFundsArr(this.fundsToDisplay);
    } else {
      this.fundsToDisplay = this.fundsArr;
    }
  }
}
