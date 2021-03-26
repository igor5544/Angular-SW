import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFormControlsComponent } from './sort-form-controls.component';

describe('SortFormControlsComponent', () => {
  let component: SortFormControlsComponent;
  let fixture: ComponentFixture<SortFormControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortFormControlsComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
