import { Component, Input, OnInit } from '@angular/core';
import { FundService } from './services/fund.service';
import { Fund } from './models/fund';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'funds';
  isLoading = true;
  isError = false;
  allFunds$: Observable<Fund[]>;

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.getFundList();
  }

  getFundList(): void {
    this.fundService.getFundList().pipe().subscribe({
      next: response => {
        console.log('response: ', response);
        this.isLoading = false;
        this.isError = false;
        this.allFunds$ = of(response[0].data);
      },
      error: error => {
        this.isLoading = false;
        this.isError = true;
        console.error('There was an error!', error);
      }
    })
  }

}

