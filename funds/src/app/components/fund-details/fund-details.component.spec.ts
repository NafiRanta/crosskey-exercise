import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDetailsComponent } from './fund-details.component';

describe('FundDetailsComponent', () => {
  let component: FundDetailsComponent;
  let fixture: ComponentFixture<FundDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FundDetailsComponent]
});
    fixture = TestBed.createComponent(FundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
