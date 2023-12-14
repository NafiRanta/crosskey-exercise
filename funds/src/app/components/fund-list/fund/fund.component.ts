import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { FundDetailsComponent } from '../../fund-details/fund-details.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-fund',
    templateUrl: './fund.component.html',
    styleUrls: ['./fund.component.css'],
    standalone: true,
    imports: [CommonModule, MatIconModule, NgIf, FundDetailsComponent]
})
export class FundComponent implements OnInit {
  @Input() fund: Fund;
  @Output() selectedFund = new EventEmitter<Fund>();
  @ViewChild('fundInfoData') fundInfoData: ElementRef;
  searchText: string[] = [];
  closePriceDate: any;
  isAccordionOpen: boolean = false;
  favouriteFunds: string[] = [];
  isFavourite: boolean = false;
 
  constructor(
    private fundService: FundService,
    private renderer: Renderer2
    ) { }

    // Format date to DD-MMM-YYYY
    // Add even/odd row class to fund 
    ngOnInit() {
      this.closePriceDate = new Date(this.fund?.latestClosePriceDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
      
      const allFundInfoData = document.querySelectorAll('.fund-info-data');
      allFundInfoData.forEach((element, index) => {
        if (index % 2 === 0) {
          this.renderer.addClass(element, 'even-row');
        } else {
          this.renderer.addClass(element, 'odd-row');
        }
      });

      // Get favourites from local storage if any 
      // Set isFavourite property to true if fund is in favourites
      let favFund = localStorage.getItem('favourites');
      if (favFund) {
        this.favouriteFunds = JSON.parse(favFund);
        this.favouriteFunds.forEach((id: string) => {
          if (this.fund.instrumentId === id) {
            this.isFavourite = true;
          } 
        });
      } 
    }

  // add to local storage array of favourites
  addToFav() {
    this.isFavourite = true;
    this.updateLocalStorageFavourites(true);
  }

  // remove from local storage array of favourites
  removeFromFav() {
    this.isFavourite = false;
    this.updateLocalStorageFavourites(false);
  }

  // update local storage array of favourites
  private updateLocalStorageFavourites(addToFavourites: boolean): void {
    let favFunds = localStorage.getItem('favourites') || '[]';
    this.favouriteFunds = JSON.parse(favFunds);
  
    if (addToFavourites) {
      this.favouriteFunds.push(this.fund.instrumentId);
    } else {
      this.favouriteFunds = this.favouriteFunds.filter((fav: string) => fav !== this.fund.instrumentId);
    }
  
    localStorage.setItem('favourites', JSON.stringify(this.favouriteFunds));
    this.fundService.updateFavourites(this.favouriteFunds);
  }
  
  // Emit selected fund to subscribers
  onSelectedFund(fund: Fund) {
    this.isAccordionOpen = !this.isAccordionOpen;
    this.fundService.setSelectedFund(fund);
  }
  
  
}
