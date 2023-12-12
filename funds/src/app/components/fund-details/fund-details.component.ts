import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.css']
})
export class FundDetailsComponent implements OnInit {
  selectedFund: Fund | null;
  closePriceDate: any;

  constructor(private fundService: FundService) { }

  ngOnInit() {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      // convert epoch  to date in format 11-Dec-2020
      this.closePriceDate = new Date(this.selectedFund?.latestClosePriceDate);
      this.closePriceDate = this.closePriceDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      // add - between date and month and year
      this.closePriceDate = this.closePriceDate?.replace(/ /g, '-');
    });

    console.log("selectedFund: fund-details", this.selectedFund)
  }

  ngOnChanges(): void {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
    });

    console.log("selectedFund: fund-details 2", this.selectedFund)
  }
}
