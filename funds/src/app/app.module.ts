import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { FundListComponent } from './components/fund-list/fund-list.component';

import { FundService } from './services/fund.service';
import { SearchComponent } from './components/search/search.component';
import { FundDetailsComponent } from './components/fund-details/fund-details.component';
import { FundComponent } from './components/fund-list/fund/fund.component';

@NgModule({
  declarations: [
    AppComponent,
    FundListComponent,
    SearchComponent,
    FundDetailsComponent,
    FundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [FundService],
  bootstrap: [AppComponent]
})
export class AppModule { }
