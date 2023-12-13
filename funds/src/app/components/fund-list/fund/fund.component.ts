import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent implements AfterViewInit {
  @Input() fund: Fund;
  @Output() selectedFund = new EventEmitter<Fund>();
  isSelected: boolean = false;
  @ViewChild('fundInfoData') fundInfoData: ElementRef;
  searchText: string[] = [];
  closePriceDate: any;
  isSmallScreen: boolean = false;
  isAccordionOpen: boolean = false;

  constructor(
    private fundService: FundService,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit() {
      this.closePriceDate = new Date(this.fund?.latestClosePriceDate);
      this.closePriceDate = this.closePriceDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      this.closePriceDate = this.closePriceDate?.replace(/ /g, '-');

      const allFundInfoData = document.querySelectorAll('.fund-info-data');
      // assign odd/even class to funds
      allFundInfoData.forEach((element, index) => {
        if (index % 2 === 0) {
          this.renderer.addClass(element, 'even-row');
        } else {
          this.renderer.addClass(element, 'odd-row');
        }
      });
      this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
    }

  ngAfterViewInit(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      const fundToHighlight = document.getElementById(fund.instrumentId)
      if (fundToHighlight) {
        const allFundInfoData = document.querySelectorAll('.fund-info');
      allFundInfoData.forEach(element => {
        this.renderer.removeClass(element, 'highlight');
      });
        this.renderer.addClass(fundToHighlight, 'highlight');
      } else {
        console.warn(`Element with ID ${fund.instrumentId} not found.`);
      }
    });

  }

  onSelectedFund(fund: Fund) {
    this.isSelected = true;
    this.isAccordionOpen = !this.isAccordionOpen;
    this.fundService.setSelectedFund(fund);
    if (this.isSelected){
      // Remove selected class from all other divs
      const allFundInfoData = document.querySelectorAll('.fund-info-data');
      allFundInfoData.forEach(element => {
        this.renderer.removeClass(element, 'highlight');
      });
      this.renderer.addClass(this.fundInfoData.nativeElement, 'highlight');
    }
  }

  shouldShowFund(fund: any): boolean {
    if (this.searchText?.length === 0) {
      return true;
    }
    return this.searchText?.some(keyword => fund.fundName.toLowerCase().includes(keyword.toLowerCase()));
  }
}
