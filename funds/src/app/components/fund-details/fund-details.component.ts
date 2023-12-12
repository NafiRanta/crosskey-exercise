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

  constructor(private fundService: FundService) { }

  ngOnInit() {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
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
