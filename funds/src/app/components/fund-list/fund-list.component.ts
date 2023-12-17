import { Component, Input, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { FundComponent } from './fund/fund.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NgFor, CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FavouriteService } from 'src/app/services/favourite.service';
import { FundDetailsComponent } from '../fund-details/fund-details.component';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';

interface TableRow {
  favourite: boolean;
  name: string;
  type: string;
  change1m: number;
  change3m: number;
  change1y: number;
  change3y: number;
  yearHigh: number;
  yearLow: number;
  currency: string;
  closePriceDate: any;
  inceptionDate: any;
  view: string;
}

@Component({
    selector: 'app-fund-list',
    templateUrl: './fund-list.component.html',
    styleUrls: ['./fund-list.component.css'],
    standalone: true,
    imports: [CommonModule, MatSortModule, FundDetailsComponent, MatTableModule, MatIconModule, MatTooltipModule, NgFor, FundComponent]
})

export class FundListComponent implements OnInit{
  @Input() fundsArr: Fund[];
  searchText: string[] = [];
  fundsToDisplay: Fund[]; 
  favourites: Fund[] = [];
  fundColumns: string[] = ['favourite', 'name', 'type', 'change1m', 'change3m', 'change1y', 'change3y', 'yearHigh', 'yearLow', 'currency', 'closePriceDate', 'inceptionDate', 'view'];
  dataSource: MatTableDataSource<Fund>;
  favouriteFunds: Fund[] = [];
  isFavourite: boolean = false;
  isAccordionOpen: boolean = false;
  selectedFund: Fund | null = null;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private fundService: FundService, 
    private favouriteService: FavouriteService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog, 
    private _liveAnnouncer: LiveAnnouncer
    ) { }

  ngOnInit(): void {
    // Initialize data
    this.setGraphProperties();
    this.setFavouriteProperties();

    this.fundsToDisplay = this.fundsArr;
    this.fundService.setFundsArr(this.fundsToDisplay);
    this.dataSource = new MatTableDataSource(this.fundsToDisplay);
    

   // Setup subscriptions
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked();  
   
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked();  
  }

  ngOnChanges(): void {
    this.setFavouriteProperties();
     this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked(); 

    // Display funds that matches the searchText
    this.fundService.isQuery$.subscribe((query) => {
      if (query) {
        this.searchText = this.fundService.getQuery();
        console.log('SEARCH TEXT: ', this.searchText)
        this.filterFunds();
        // Update the data source with the filtered funds
        this.dataSource.data = this.fundsToDisplay;
        // Trigger change detection to update the UI
        this.changeDetectorRef.detectChanges();
      }
    });    
  }

   // Display funds that are in favourites
   subscribeToFavouriteButtonClicked(): void {
    this.fundService.isFavourite$.subscribe((isFavourite) => {
      if (isFavourite) {
        let favFund = localStorage.getItem('favourites');
        if (favFund) {
          this.favourites = JSON.parse(favFund);
          console.log('FAV FUND: ', this.favourites);
          // set isFavourite property to true if fund is in favourites
          this.favourites.forEach((fund: Fund) => {
            if (this.favourites.some((favFund: Fund) => {
              return fund.instrumentId === favFund.instrumentId;
            })) {
              fund.isFavourite = true;
            } else {
              fund.isFavourite = false;
            }
          });
          this.fundsToDisplay = this.favourites;
        }
      }

    });
  }

  // Display all funds
  subscribeToAllButtonClicked(): void {
    this.fundService.isAll$.subscribe((isAll) => {
      if (isAll) {
      this.setFavouriteProperties();
        this.fundsToDisplay = this.fundsArr;
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

  // set isFavorite property for each fund
  setFavouriteProperties(): void {
    let favFund = localStorage.getItem('favourites');
    if (favFund) {
      this.favourites = JSON.parse(favFund);
    }

    this.fundsArr.forEach((fund: Fund) => {
      if (this.favourites.some((favFund: Fund) => {
        return fund.instrumentId === favFund.instrumentId;
      })) {
        fund.isFavourite = true;
      } else {
        fund.isFavourite = false;
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
      this.subscribeToAllButtonClicked();
      this.subscribeToFavouriteButtonClicked();
      this.fundService.setZeroResults(false);
      //this.fundService.setFundsArr(this.fundsToDisplay);
    }
  }

  addToFav(selectedFund: Fund) {
    this.favouriteService.addToFavorites(selectedFund);
    this.isFavourite = true;
    selectedFund.isFavourite = true;
  }

  // remove from local storage array of favourites
  removeFromFav(selectedFund: Fund) {
    this.favouriteService.removeFromFavorites(selectedFund);
     this.isFavourite = false;
     selectedFund.isFavourite = false;
  }


  private updateFavoritesState(favorites: Fund[]) {
    this.fundsToDisplay = this.fundsArr.filter((fund) =>
      favorites.some((favFund) => fund.instrumentId === favFund.instrumentId)
    );
  }

    
  // Emit selected fund to subscribers
  onSelectedFund(fund: Fund) {
    this.isAccordionOpen = !this.isAccordionOpen;
    this.fundService.setSelectedFund(fund);
    this.selectedFund = fund;
  }
  
  onRowClick(row: Fund): void {
    this.selectedFund = row;
  }

    // Open productDetail modal
    openProductDetail(selectedFund: Fund): void {
      this.dialog.open(FundDetailsComponent, {
       data: {
         selectedFund: selectedFund, 
       },
     });
   }

   announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    console.log("sortstate", sortState);
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}  