import { Component, Input, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NgFor, CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FavouriteService } from 'src/app/services/favourite.service';
import { FundDetailsComponent } from '../fund-details/fund-details.component';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { SearchService } from 'src/app/services/search.service';

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
    imports: [CommonModule, MatSortModule, FundDetailsComponent, MatTableModule, MatIconModule, MatTooltipModule, NgFor]
})

export class FundListComponent implements OnInit{
  @Input() allFunds: Fund[];
  searchText: string[] = [];
  fundsToDisplay: Fund[]; 

  fundColumns: string[] = ['favourite', 'name', 'type', 'change1m', 'change3m', 'change1y', 'change3y', 'yearHigh', 'yearLow', 'currency', 'closePriceDate', 'inceptionDate', 'view'];
  dataSource: MatTableDataSource<Fund>;
  favouriteFunds: Fund[] = [];
  isFavourite: boolean = false;
  isAccordionOpen: boolean = false;
  selectedFund: Fund | null = null;
  @ViewChild(MatSort) sort: MatSort;
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
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.subscribeToResetSearch(); 
    this.subscribeToQuery();
  }

  ngOnChanges(): void {
    this.subscribeToQuery();   
    this.subscribeToResetSearch();
  }

  // subscribe to reset search
  subscribeToResetSearch(): void {
    this.searchService.reset$.subscribe((reset) => {
      this.searchText = this.searchService.getQuery();
      if (reset && this.searchText.length < 0) {
        this.fundsToDisplay = this.allFunds;
        console.log('RESET SEARCH: ',this.searchText );
      } else {
        this.searchService.setQuery(this.searchText);
        this.filterFunds(this.searchText);
      }
    });
  }
  
  // Display funds that matches the searchText
  subscribeToQuery(): void {
       // Display funds that matches the searchText
       this.searchService.isQuery$.subscribe((query) => {
        if (query) {
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
        }
      }
    });
  }

  // Display all funds
  subscribeToAllButtonClicked(): void {
    this.fundService.isAll$.subscribe((isAll) => {
      if (isAll) {
      //this.setFavouriteProperties();
        this.fundsToDisplay = this.allFunds;
      }
    });
  }
  // Display funds that matches the searchText
  filterFunds(searchText: string[]): void {
    if (searchText?.length > 0) {
      // Use filter to include only funds that match the searchText
      this.fundsToDisplay = this.allFunds.filter((fund: Fund) => {
        return searchText.some((word: string) => {
          return (fund.fundName?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.fundCompany?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.fundType?.toLowerCase() || '').includes(word.toLowerCase()) 
          || (fund.isin?.toLowerCase() || '').includes(word.toLowerCase());
        });
      });
      console.log('FUNDS TO DISPLAY: ', this.fundsToDisplay);
      this.dataSource.data = this.fundsToDisplay;
      this.changeDetectorRef.detectChanges();
  
      if (this.fundsToDisplay.length === 0) {
        this.searchService.setZeroResults(true);
      } else {
        this.searchService.setZeroResults(false);
      }
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
    this.fundsToDisplay = this.allFunds.filter((fund) =>
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