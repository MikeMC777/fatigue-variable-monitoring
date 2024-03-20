import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VariablesListComponent } from './variables-list.component';
import { NgbToastModule } from 'ngb-toast';

describe('VariablesListComponent', () => {
  let component: VariablesListComponent;
  let fixture: ComponentFixture<VariablesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
      declarations: [ VariablesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
