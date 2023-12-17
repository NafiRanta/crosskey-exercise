import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Fund } from 'src/app/models/fund';
import { GraphComponent } from '../graph/graph.component';

@Component({
    selector: 'app-fund-details',
    templateUrl: './fund-details.component.html',
    styleUrls: ['./fund-details.component.css'],
    standalone: true,
    imports: [CommonModule, MaterialModule, GraphComponent]
})
export class FundDetailsComponent implements OnInit {
  selectedFund: Fund | null;
  documents: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.selectedFund = data.selectedFund;
    }
  
  // Display fund documents
  ngOnInit() {
      this.documents = this.selectedFund?.documents;
  }
}
