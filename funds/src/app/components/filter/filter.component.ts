import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fund } from 'src/app/models/fund';
import { FundService } from 'src/app/services/fund.service';
import { MatFormField } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() fundsArr: Fund[];
  filterByFavourites: Fund[] = [];
  favourites: string[] = [];

  constructor(private fundService: FundService) { }

  ngOnInit(): void {
    this.initializeFavourites();
  }


  // Get favourites from local storage if any and replace ids with fund names
  private initializeFavourites(): void {
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      this.favourites = JSON.parse(storedFavourites);
    } else {
      this.filterByFavourites = [];
      document.getElementById('fav-button').classList.add('disabled');
    }
  }

  showAll(): void {
    this.fundService.setQuery([]);
    this.fundService.setAll(true);
  }

  showFavourites(): void {
    this.fundService.setQuery([]);
    this.fundService.setFavourite(true);
  }
}
