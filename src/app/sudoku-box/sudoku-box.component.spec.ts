import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SudokuBoxComponent } from './sudoku-box.component';

describe('SudokuBoxComponent', () => {
  let component: SudokuBoxComponent;
  let fixture: ComponentFixture<SudokuBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SudokuBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SudokuBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
