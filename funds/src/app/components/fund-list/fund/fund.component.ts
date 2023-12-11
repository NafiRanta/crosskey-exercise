import { Component, Input } from '@angular/core';
import { Fund } from 'src/app/models/fund';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent {
  @Input() fund: Fund;
}
