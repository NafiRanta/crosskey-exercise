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
  favourites: Fund[] = [];
  
  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    // Initialize data
    this.setGraphProperties();
    this.fundsToDisplay = this.fundsArr;
    this.fundService.setFundsArr(this.fundsToDisplay);

    
   // Setup subscriptions
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked();  
  }

  ngOnChanges(): void {
    // Display funds that matches the searchText
    this.fundService.isQuery$.subscribe((query) => {
      if (query) {
        this.searchText = this.fundService.getQuery();
        this.filterFunds();
      }
    });     
  }

  // Set isGraph property for each fund
  setGraphProperties(): void {
    this.fundsArr.forEach((fund: Fund) => {
      if (this.isGraphPropertiesEmpty(fund)) {
        fund.isGraph = false;
      } else {
        fund.isGraph = true;
      }
    });
  }

  isGraphPropertiesEmpty(fund: Fund): boolean {
    return (
      fund.change1m === null &&
      fund.change3m === null &&
      fund.change1y === null &&
      fund.change3y === null &&
      fund.yearHigh === null &&
      fund.yearLow === null
    );
  }

  // Display funds that are in favourites
  subscribeToFavouriteButtonClicked(): void {
    this.fundService.isFavourite$.subscribe((isFavourite) => {
      if (isFavourite) {
        let favFund = localStorage.getItem('favourites');
        if (favFund) {
          this.favourites = JSON.parse(favFund);
          this.fundsToDisplay = this.fundsArr.filter((fund: Fund) => {
            return this.favourites.some((favFund: Fund) => {
              return fund.instrumentId === favFund.instrumentId;
            });
          });
        }
      }
    });
  }

  // Display all funds
  subscribeToAllButtonClicked(): void {
    this.fundService.isAll$.subscribe((isAll) => {
      if (isAll) {
        this.fundsToDisplay = this.fundsArr;
      }
    });
  }

  // Display funds that matches the searchText
  filterFunds(): void {
    if (this.searchText?.length > 0) {
      // Use filter to include only funds that match the searchText
      this.fundsToDisplay = this.fundsArr.filter((fund: Fund) => {
        return this.searchText.some((searchText: string) => {
          return (fund.fundName?.toLowerCase() || '').includes(searchText.toLowerCase()) 
          || (fund.fundCompany?.toLowerCase() || '').includes(searchText.toLowerCase()) 
          || (fund.fundType?.toLowerCase() || '').includes(searchText.toLowerCase()) 
          || (fund.isin?.toLowerCase() || '').includes(searchText.toLowerCase());
        });
      });
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