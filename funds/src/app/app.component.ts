import { Component, OnInit } from '@angular/core';
import { FundService } from './services/fund.service';
import { Fund } from './models/fund';
import { Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SearchComponent } from './components/search/search.component';
import { FundListComponent } from './components/fund-list/fund-list.component';
import { MaterialModule } from './modules/material/material.module';
import { FilterComponent } from './components/filter/filter.component';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
      SearchComponent, 
      AsyncPipe, 
      CommonModule, 
      FundListComponent, 
      MaterialModule, 
      FilterComponent]
})

export class AppComponent implements OnInit{
  title = 'Investment Funds';
  isLoading = true;
  isError = false;
  allFunds$: Observable<Fund[]>;
  isSmallScreen: boolean = false;
  selectedFund: Fund | null = null;
  isZeroResults: boolean = false;

  constructor(private fundService: FundService) { }
  
  // Get API data on init
  // Display no results found if isZeroResults$ is true
  ngOnInit(): void {
    this.getAPIData();
    
    this.fundService.isZeroResults$.subscribe((zeroResults) => {
      if (zeroResults) {
        this.isZeroResults = true;
      } else {  
        this.isZeroResults = false;
      }
    });
  }

  // Get API data
  // Show spinner while loading API data
  // Show error message if there's an error
  // Assign data object from API data to allFunds$ if no error
  // Pass allFunds$ to fund-list component
  getAPIData(): void {
    this.fundService.getAPI().pipe().subscribe({
      next: response => {
        console.log('response: ', response);
        this.isLoading = false;
        this.isError = false;
        this.allFunds$ = of(response[0].data);
      },
      error: error => {
        this.isLoading = false;
        this.isError = true;
        console.error('There was an error!', error);
      }
    })
  }
  onSelectedFund(fund: Fund) {
    this.selectedFund = fund;
  }
}

