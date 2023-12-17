import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FundDetailsComponent } from './fund-details.component';
import { Fund } from 'src/app/models/fund';
import { GraphComponent } from '../graph/graph.component';

describe('FundDetailsComponent', () => {
  let component: FundDetailsComponent;
  let fixture: ComponentFixture<FundDetailsComponent>;
  let graphComponent: GraphComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundDetailsComponent],
      imports: [CommonModule, MaterialModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { selectedFund: {  } }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDetailsComponent);
    component = fixture.componentInstance;
    graphComponent = TestBed.createComponent(GraphComponent).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedFund and documents on ngOnInit', () => {
    const fundData: Fund = { 

      // mock your Fund data here
      instrumentId: '1',
      fundName: 'test',
      fundCompany: 'test',
      fundType: 'test',
      currency: 'test',
      startValue: 1,
      closePrice: 1,
      estimationDate: 1,
      latestClosePriceDate: 1,
      change1m: 1,
      change3m: 1,
      change1y: 1,
      change3y: 1,
      yearHigh: 1,
      yearLow: 1,
      documents: ['test'],
      administrativeFee: 1,
      countDecimals: 1,
      startDate: 1,
      isin: 'test',
      isFavourite: true,
      isGraph: true,
      rate: 1

     };
    component.ngOnInit();
    expect(component.selectedFund).toEqual(fundData);
    expect(component.documents).toEqual(fundData.documents);
  });

  // Add more test cases as needed based on your component's functionality
});

