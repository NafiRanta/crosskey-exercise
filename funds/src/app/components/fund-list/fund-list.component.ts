import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { FundComponent } from './fund/fund.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { filter } from 'rxjs';
@Component({
    selector: 'app-fund-list',
    templateUrl: './fund-list.component.html',
    styleUrls: ['./fund-list.component.css'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, NgFor, FundComponent]
})
export class FundListComponent implements OnInit{
  @Input() fundsArr: Fund[];
  searchText: string[] = [];
  fundsToDisplay: Fund[]; 
  selectedFilters: any;
  favourites: Fund[] = [];
  
  constructor(private fundService: FundService) { }

  // Initialize filteredFunds with allFunds
  // Subscribe to isQuery$, if true, set searchText to query
  // Display funds that match the searchText via filterFunds()
  ngOnInit(): void {

    // set isGraph to funds with no graph properties
    this.fundsArr.forEach((fund: Fund) => {
      if (fund.change1m === null && fund.change3m == null && fund.change1y === null && fund.change3y === null && fund.yearHigh === null && fund.yearLow === null) {
        fund.isGraph = false;
      } else {
        fund.isGraph = true;
      }
    });

    this.fundService.setFundsArr(this.fundsArr);

    this.fundService.isFavourite$.subscribe((isFavourite) => {
      if (isFavourite) {
        let favFund = localStorage.getItem('favourites');
        if (favFund) {
          this.favourites = JSON.parse(favFund);
          // show only favourites
          this.fundsToDisplay = this.fundsArr.filter((fund: Fund) => {
            return this.favourites.some((favFund: Fund) => {
              return fund.instrumentId === favFund.instrumentId;
            });
          });
        }
      }
    });
    
  }

  ngOnChanges(): void {
    this.fundService.isQuery$.subscribe((query) => {
      if (query) {
        this.searchText = this.fundService.getQuery();
        console.log('searchText: ', this.searchText)
        this.filterFunds(this.selectedFilters);
      }
    });  
    
    this.fundService.isFilter$.subscribe((filterArr) => {
      if (filterArr) {
        this.selectedFilters = filterArr;
        console.log('selectedFilters: ', this.selectedFilters)
        this.filterFunds(this.selectedFilters);
      }
    });
   
  }

  // Display all funds if searchText is empty
  // Set filteredFunds to include only funds that match the isin, fundName, fundType, or fundCompany
  filterFunds( filterArr: any): void {
    if (filterArr.length > 0) {
      console.log('FILTER ARR: ', filterArr);
      console.log('FILTER ARR LENGTH: ', filterArr.length);
      this.fundsToDisplay = [...this.fundsArr];
      for (let i = 0; i < filterArr.length; i++) {
        console.log('FILTER ARR I: ', filterArr[i]);
        
        this.fundsToDisplay = this.fundsToDisplay.filter((fund: Fund) => {
          return fund.currency === filterArr[i].value || fund.fundType === filterArr[i].value;
        });
      }
  
      console.log('FUNDS TO DISPLAY: ', this.fundsToDisplay);
  
      if (this.fundsToDisplay.length === 0) {
        this.fundService.setZeroResults(true);
      } else {
        this.fundService.setZeroResults(false);
      }
      this.fundService.setFundsArr(this.fundsToDisplay);
    } else {
      this.fundsToDisplay = this.fundsArr;
      this.fundService.setZeroResults(false);
      this.fundService.setFundsArr(this.fundsToDisplay);
    }
  }
}  