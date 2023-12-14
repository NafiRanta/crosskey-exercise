import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/modules/material/material.module';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, NgIf],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() fundsArr: Fund[];
  @ViewChild("selectedCurrency") selectedCurrency: MatFormField;
  @ViewChild("selectedFundType") selectedFundType: MatFormField;
  @ViewChild("selectedFundCompany") selectedFundCompany: MatFormField;
  filterByCurrency: string[] = [];
  filterByFundType: string[] = [];
  filterByFundCompany: string[] = [];

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.fundsArr.forEach(fund => {
      if (fund.currency && !this.filterByCurrency.includes(fund.currency)) {
        this.filterByCurrency.push(fund.currency);
      }
  
      if (fund.fundType && !this.filterByFundType.includes(fund.fundType)) {
        this.filterByFundType.push(fund.fundType);
      }
  
      if (fund.fundCompany && !this.filterByFundCompany.includes(fund.fundCompany)) {
        this.filterByFundCompany.push(fund.fundCompany);
      }
    });
  
    // Add 'All' to the beginning of each array
    this.filterByCurrency.unshift('All');
    this.filterByFundType.unshift('All');
    this.filterByFundCompany.unshift('All');
  
    // Sort the arrays alphabetically
    this.filterByCurrency.sort();
    this.filterByFundType.sort();
    this.filterByFundCompany.sort();
  }
  
  // Emit selected currency to subscribers
  onFundTypeSelectionChange(event: any) {
    console.log('event: ', event);
    let filterData = {
      "id": event.source.id,
      "value": event.value
    }
    this.fundService.setFilters(filterData);
  }
}
