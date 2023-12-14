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
  favouriteFunds: Fund[] = [];
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

      // get from local storage if any
      let favFund = localStorage.getItem('favourites');
      if (favFund) {
        this.favouriteFunds = JSON.parse(favFund);
        this.isFavourite = true;
      }
    }

  onSelectedFund(fund: Fund) {
    this.isAccordionOpen = !this.isAccordionOpen;
    this.fundService.setSelectedFund(fund);
  }
}
