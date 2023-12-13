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
  
  // Display selected or first fund from list
  // Format dates to DD-MMM-YYYY
  // Get documents from selected fund
  // Observe screen size for responsive design
  ngOnInit() {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      if (this.isSmallScreen){
        this.isAccordionOpen = !this.isAccordionOpen;
      }
      
      this.closePriceDate = new Date(this.selectedFund?.latestClosePriceDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
      this.inceptDate = new Date(this.selectedFund?.startDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
      
      this.documents = this.selectedFund?.documents;
    });

    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }

  // Display first or selected fund from list as accordion if screen size is small
  ngOnChanges(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      if (this.isSmallScreen){
        this.isAccordionOpen = !this.isAccordionOpen;
      }
    });
  }
}
