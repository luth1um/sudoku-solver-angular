import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { solveSudoku } from '../solver/sudoku-solver';
import { excludingEntriesValidator } from '../validation/excluding-entries';
import { convertSudokuFormToNumberArray } from '../_shared/solver-utils';

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
  disableButtonsForSolving: boolean = false;
  sudokuUnsolvable: boolean = false;
  snackBarInvalidInputOpen: boolean = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

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
        this.snackBar.dismiss(); // dismiss error message if form is valid
        return;
      }

      // if form is invalid: trigger notification if not already open
      if (!this.snackBarInvalidInputOpen) {
        this.snackBarInvalidInputOpen = true;
        this.openSnackBar(
          'Some of the entries are not valid or exclude each other! The Sudoku can only be solved when all entries are valid.',
          'OK'
        );
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

      // dismiss error message if form is valid
      if (!this.sudokuForm.invalid) {
        this.snackBar.dismiss();
      }
    });
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
    this.disableButtonsForSolving = true;

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
    this.disableButtonsForSolving = false;
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

  /**
   * Resets the complete Sudoku form (i.e., removes all entries).
   */
  reset(): void {
    this.sudokuForm.reset();
    this.sudokuUnsolvable = false;
  }

  /**
   * Opens a snack bar with the given message and action (i.e., annotation for close button).
   * @param message message to display
   * @param action annotation for close button
   */
  openSnackBar(message: string, action: string) {
    this.snackBar
      .open(message, action)
      .afterDismissed()
      .subscribe(() => {
        this.snackBarInvalidInputOpen = false;
      });
  }
}