import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileReadingComponent } from './file-reading.component';
import { NgbToastModule } from 'ngb-toast';

describe('FileReadingComponent', () => {
  let component: FileReadingComponent;
  let fixture: ComponentFixture<FileReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgbToastModule],
      declarations: [ FileReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
