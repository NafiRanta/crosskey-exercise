import { Component, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { GraphComponent } from '../graph/graph.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-fund-details',
    templateUrl: './fund-details.component.html',
    styleUrls: ['./fund-details.component.css'],
    standalone: true,
    imports: [NgIf, MatIconModule, MatTooltipModule, GraphComponent, NgFor]
})
export class FundDetailsComponent implements OnInit {
  selectedFund: Fund | null;
  closePriceDate: any;
  inceptDate: any;
  documents: any[] = [];
  isAccordionOpen: boolean = false;

  constructor(
    private fundService: FundService) { }
  
  // Display selected or first fund from list
  // Format dates to DD-MMM-YYYY
  // Get documents from selected fund
  // Observe screen size for responsive design
  ngOnInit() {
    this.fundService.selectedFund$.subscribe((fund) => {
      this.selectedFund = fund;
      
      this.closePriceDate = new Date(this.selectedFund?.latestClosePriceDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
      this.inceptDate = new Date(this.selectedFund?.startDate)?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })?.replace(/ /g, '-');
      
      this.documents = this.selectedFund?.documents;
    });
  }
}
