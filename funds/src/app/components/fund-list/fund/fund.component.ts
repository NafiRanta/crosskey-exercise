import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, ViewChild, AfterViewInit, OnInit  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';

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
  

  constructor(
    private fundService: FundService,
    private renderer: Renderer2
    ) { }

  ngAfterViewInit(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      const fundToHighlight = document.getElementById(fund.instrumentId)
      console.log("fund to highlight", fundToHighlight)
      if (fundToHighlight) {
        const allFundInfoData = document.querySelectorAll('.fund-info-data');
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
