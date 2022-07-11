import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileReadingComponent } from './file-reading.component';

describe('FileReadingComponent', () => {
  let component: FileReadingComponent;
  let fixture: ComponentFixture<FileReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
