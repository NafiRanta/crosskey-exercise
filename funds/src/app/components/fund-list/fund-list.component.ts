import { Component, Input, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { FavouriteService } from 'src/app/services/favourite.service';
import { SearchService } from 'src/app/services/search.service';
import { FundDetailsComponent } from '../fund-details/fund-details.component';


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
  closePriceDate: Date;
  inceptionDate: Date;
  view: string;
}

@Component({
    selector: 'app-fund-list',
    templateUrl: './fund-list.component.html',
    styleUrls: ['./fund-list.component.css'],
    standalone: true,
    imports: [
      CommonModule, 
      MaterialModule,
      FundDetailsComponent, 
      MatTableModule]
})

export class FundListComponent implements OnInit{
  @Input() allFunds: Fund[];
  @ViewChild(MatSort) sort: MatSort;
  fundsToDisplay: Fund[]; 
  favouriteFunds: Fund[] = [];
  searchText: string[] = [];
  fundColumns: string[] = ['favourite', 'name', 'type', 'change1m', 'change3m', 'change1y', 'change3y', 'yearHigh', 'yearLow', 'currency', 'closePriceDate', 'inceptionDate', 'view'];
  dataSource: MatTableDataSource<Fund>;
  isFavourite: boolean = false;
  isAccordionOpen: boolean = false;
  isHovered: boolean = false;

  constructor(
    private fundService: FundService, 
    private favouriteService: FavouriteService,
    private searchService: SearchService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog, 
    private _liveAnnouncer: LiveAnnouncer
    ) { }

  ngOnInit(): void {
    // Initialize data
    this.fundsToDisplay = this.allFunds;
    this.dataSource = new MatTableDataSource(this.fundsToDisplay);

   // Setup subscriptions
    this.subscribeToFavouriteButtonClicked();
    this.subscribeToAllButtonClicked(); 
    this.subscribeToQuery();     
  }

  
  ngAfterViewInit() {
    // Sort funds by column
    this.dataSource.sort = this.sort;
    //this.subscribeToResetSearch(); 
    //this.subscribeToQuery();

    // Custom sort by date and string 
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'closePriceDate':
          return new Date(item.latestClosePriceDate);
        case 'inceptionDate':
          return new Date(item.startDate);
        case 'name':
          return item.fundName.toLocaleLowerCase();
        case 'type':
          return item.fundType.toLocaleLowerCase(); 
        default:
          return item[property];
      }
    };
  }

  ngOnChanges(): void {
    //this.subscribeToQuery();   
    this.subscribeToResetSearch();
    this.subscribeToAllButtonClicked(); 
  }

  // subscribe to reset search
  subscribeToResetSearch(): void {
    this.searchService.reset$.subscribe((reset) => {
      if (reset) {
        this.fundsToDisplay = this.allFunds;
        this.dataSource.data = this.fundsToDisplay;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  
  // Display funds that matches the searchText
  subscribeToQuery(): void {
       this.searchService.isQuery$.subscribe((query) => {
        if (query) {
          console.log('QUERY: ', this.searchService.getQuery());
          this.filterFunds( this.searchService.getQuery());
        }
      });  
    }

   // Display funds that are in favourites
   subscribeToFavouriteButtonClicked(): void {
    this.favouriteService.isFavourite$.subscribe((isFavourite) => {
      if (isFavourite) {
        let favFund = localStorage.getItem('favourites');
        if (favFund) {
          this.fundsToDisplay = JSON.parse(favFund);
          this.dataSource.data = this.fundsToDisplay;
          this.changeDetectorRef.detectChanges();
        }
      }
    });
  }

  // Display all funds
  subscribeToAllButtonClicked(): void {
    this.fundService.isAll$.subscribe((isAll) => {
      if (isAll) {
          this.fundsToDisplay = this.allFunds;
          this.dataSource.data = this.fundsToDisplay;
          this.changeDetectorRef.detectChanges();
      }
    });
  }

  // Display funds that matches the searchText
  filterFunds(searchText: string[]): void {
    if (searchText?.length > 0) {
      this.fundsToDisplay = this.allFunds.filter((fund: Fund) => {
        return searchText.some((word: string) => {
          return (fund.fundName?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.fundCompany?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.fundType?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.isin?.toLowerCase() || '').includes(word.toLowerCase());
        });
      });
      this.dataSource.data = this.fundsToDisplay;
      this.changeDetectorRef.detectChanges();
  
      if (this.fundsToDisplay.length === 0) {
        this.searchService.setZeroResults(true);
      } else {
        console.log("this.fundsToDisplay leng", this.fundsToDisplay.length);
        console.log('zero: ');
        //this.searchService.setZeroResults(false);
      }
    } else if (searchText.length === 0) {
      this.dataSource.data = this.allFunds;
      this.changeDetectorRef.detectChanges();
    }
  }

  // add to local storage array of favourites
  addToFav(selectedFund: Fund) {
    selectedFund.isFavourite = true;
    this.favouriteService.addToFavorites(selectedFund);
  }

  // remove from local storage array of favourites
  removeFromFav(selectedFund: Fund) {
    selectedFund.isFavourite = false;
    this.favouriteService.removeFromFavorites(selectedFund);
  }

  // Open productDetail modal
  openProductDetail(selectedFund: Fund): void {
    this.dialog.open(FundDetailsComponent, {
      data: {
        selectedFund: selectedFund, 
      },
    });
  }


  // Announce sort change
  announceSortChange(sortState: Sort) {
    console.log("sortstate", sortState);
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}  