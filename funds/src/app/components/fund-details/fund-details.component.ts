import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.css']
})
export class FundDetailsComponent implements OnInit {
  selectedFund: Fund | null;
  closePriceDate: any;
  inceptDate: any;
  documents: any[] = [];
  isAccordionOpen: boolean = false;
  isSmallScreen: boolean = false;

  constructor(
    private fundService: FundService, private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      if (this.isSmallScreen){
        this.isAccordionOpen = !this.isAccordionOpen;
      }
      
      this.closePriceDate = new Date(this.selectedFund?.latestClosePriceDate);
      this.closePriceDate = this.closePriceDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      this.closePriceDate = this.closePriceDate?.replace(/ /g, '-');

      this.inceptDate = new Date(this.selectedFund?.startDate);
      this.inceptDate = this.inceptDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      this.inceptDate = this.inceptDate?.replace(/ /g, '-');

      this.documents = this.selectedFund?.documents;
    });

    console.log("selectedFund: fund-details", this.selectedFund)
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnChanges(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      if (this.isSmallScreen){
        this.isAccordionOpen = !this.isAccordionOpen;
      }
    });

    console.log("selectedFund: fund-details 2", this.selectedFund)
  }
}
