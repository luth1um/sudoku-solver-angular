import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { solveSudoku } from '../solver/sudoku-solver';
import { excludingEntriesValidator } from '../validation/excluding-entries';

@Component({
  selector: 'solve-sudoku-box',
  templateUrl: './sudoku-box.component.html',
  styleUrls: ['./sudoku-box.component.scss'],
})
export class SudokuBoxComponent implements OnInit {
  sudokuForm = this.fb.group({
    rows: this.fb.array([]),
  });
  entryPattern: string = '[1-9]';
  formChangeSubscription?: Subscription;
  disableSolveButton: boolean = false;
  sudokuUnsolvable: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    for (let i = 0; i < 9; i++) {
      (this.sudokuForm.get('rows') as FormArray<FormGroup>).push(
        this.fb.group({
          column0: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 0)],
            updateOn: 'change',
          }),
          column1: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 1)],
            updateOn: 'change',
          }),
          column2: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 2)],
            updateOn: 'change',
          }),
          column3: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 3)],
            updateOn: 'change',
          }),
          column4: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 4)],
            updateOn: 'change',
          }),
          column5: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 5)],
            updateOn: 'change',
          }),
          column6: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 6)],
            updateOn: 'change',
          }),
          column7: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 7)],
            updateOn: 'change',
          }),
          column8: this.fb.control<string>('', {
            validators: [Validators.pattern(this.entryPattern), excludingEntriesValidator(this.sudokuForm, i, 8)],
            updateOn: 'change',
          }),
        })
      );
    }
    this.onFormChange();
  }

  /**
   * Listens to form changes and revalidates all fields in case of the form is invalid.
   * This is needed to ensure that EVERY excluding field is marked as invalid (and not just the field that was changed last).
   */
  private onFormChange(): void {
    this.formChangeSubscription = this.sudokuForm.statusChanges.subscribe((_) => {
      // only do something if there are invalid values
      if (!this.sudokuForm.invalid) {
        return;
      }

      // if form is invalid: revalidate ALL fields such that EVERY excluding field is marked as invalid (and not just the field that was changed last)
      // NOTE: unsubscribe (and later resubscribe) to avoid infinite loop
      this.formChangeSubscription?.unsubscribe();
      for (const formRow of (this.sudokuForm.get('rows') as FormArray<FormGroup>).controls) {
        for (let i = 0; i < 9; i++) {
          formRow.get('column' + i)!.updateValueAndValidity();
        }
      }
      this.onFormChange(); // resubscribe to changes
    });
  }

  /**
   * Prints the Sudoku puzzle of the form to the terminal. This is intended for debugging purposes.
   */
  printSudokuFormToConsole() {
    // TODO: remove this method ASAP
    for (const row of (this.sudokuForm.get('rows') as FormArray).controls) {
      let rowString: string = row.get('column0')!.value;
      for (let i = 1; i < 9; i++) {
        rowString += ' ' + row.get('column' + i)!.value;
      }
      console.log(rowString);
    }
  }

  /**
   * Triggers the process of solving the Sudoku puzzle and updating the form with the result.
   */
  solve(): void {
    if (this.sudokuForm.invalid) {
      return;
    }

    this.sudokuUnsolvable = false; // reset "unsolvability" whenever solving (re-)starts
    this.sudokuForm.disable(); // disable form to prevent changes
    this.disableSolveButton = true;

    console.log('Solving Sudoku puzzle...');
    const sudoku: number[][] = convertSudokuFormToNumberArray(this.sudokuForm);
    const result: [boolean, number[][]] = solveSudoku(sudoku);
    const isSolved: boolean = result[0];
    const solvedSudoku: number[][] = result[1];

    if (isSolved) {
      console.log('Sudoku puzzle solved!');
      this.formChangeSubscription?.unsubscribe(); // don't listen to changes while updating the form with the solved Sudoku
      this.updateSudokuFormWithSolvedPuzzle(solvedSudoku);
      this.onFormChange(); // listen again to changes when update of form complete
    } else {
      console.log('Sudoku not solvable');
      this.sudokuUnsolvable = true;
    }
    this.sudokuForm.enable();
    this.disableSolveButton = false;
  }

  /**
   * Updates the Sudoku form with the result of the Sudoku solver.
   * @param solvedSudoku solved Sudoku puzzle
   */
  private updateSudokuFormWithSolvedPuzzle(solvedSudoku: number[][]): void {
    let i = 0;
    // outer loop: iterate over rows
    for (const formRow of (this.sudokuForm.get('rows') as FormArray<FormGroup>).controls) {
      // inner loop: iterate over columns
      for (let j = 0; j < 9; j++) {
        const entry = solvedSudoku[i][j];
        if (entry >= 1) {
          formRow.get('column' + j)!.setValue(entry);
        }
      }
      i++;
    }
  }
}

/**
 * Converts the Sudoku form into a number array.
 * @returns Sudoku form as a number array
 */
export function convertSudokuFormToNumberArray(sudokuForm: FormGroup): number[][] {
  const sudokuArray: number[][] = [];

  // outer loop: iterate over rows
  for (const formRow of (sudokuForm.get('rows') as FormArray<FormGroup>).controls) {
    const row: number[] = [];

    // inner loop: iterate over columns
    for (let i = 0; i < 9; i++) {
      const valueString: string = formRow.get('column' + i)!.value;

      // if no value: set -1 to indicate missing value
      if (valueString === '') {
        row[i] = -1;
      } else {
        row[i] = parseInt(valueString);
      }
    }
    sudokuArray.push(row);
  }
  return sudokuArray;
}
