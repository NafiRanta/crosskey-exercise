import { Component, EventEmitter, Input, Output , ElementRef, Renderer2, ViewChild, OnInit  } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent implements OnInit {
  @Input() fund: Fund;
  @Output() selectedFund = new EventEmitter<Fund>();
  isSelected: boolean = false;
  @ViewChild('fundInfoData') fundInfoData: ElementRef;

  constructor(
    private fundService: FundService,
    private renderer: Renderer2,
    private el: ElementRef
    ) { }

  ngOnInit(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      console.log("fund in fund component:", fund);
      const fundToHighlight = document.getElementById(fund.instrumentId)
      this.renderer.addClass(fundToHighlight, 'highlight');
    });
  }

  onSelectedFund(fund: Fund) {
    this.isSelected = true;
    console.log("selectedFund in fund component:", fund);
    this.fundService.setSelectedFund(fund);
    if (this.isSelected){
      // Remove selected class from all other divs
      const allFundInfoData = document.querySelectorAll('.fund-info-data');
      allFundInfoData.forEach(element => {
        this.renderer.removeClass(element, 'highlight');
      });
      
      console.log("fund is selected");
      this.renderer.addClass(this.fundInfoData.nativeElement, 'highlight');
    }
    // remove selected class from all other divs
  }
}
