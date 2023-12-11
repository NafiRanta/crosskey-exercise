import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.css']
})
export class FundListComponent implements OnInit{
@Input() funds: Fund[];

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.fundService.setFunds(this.funds);
  }


}
