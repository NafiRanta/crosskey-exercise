import { Component, Input, OnInit } from '@angular/core';
import { Fund } from 'src/app/models/fund';

@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html',
  styleUrls: ['./fund-list.component.css']
})
export class FundListComponent implements OnInit{
@Input() funds: Fund[];

  constructor() { }

  ngOnInit(): void {
    console.log("all funds", this.funds);
  }

}
