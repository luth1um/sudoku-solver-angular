import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { nextNumber, NextNumberResult, solveSudoku } from 'fast-sudoku-solver';
import { combineLatest, firstValueFrom } from 'rxjs';

import { ResetDialogComponent } from '../reset-dialog/reset-dialog.component';
import { excludingEntriesValidator } from '../validation/excluding-entries';
import { convertSudokuFormToNumberArray } from '../_shared/solver-utils';

@Component({
  selector: 'solve-sudoku-box',
  templateUrl: './sudoku-box.component.html',
  styleUrl: './sudoku-box.component.scss',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    TranslateModule,
  ],
})
export class SudokuBoxComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  sudokuForm = this.fb.group({
    rows: this.fb.array([]),
  });
  entryPattern: string = '[1-9]';
  disableButtonsForSolving = signal<boolean>(false);
  sudokuUnsolvable = signal<boolean>(false);
  snackBarInvalidInputOpen = signal<boolean>(false);

  protected readonly Array = Array;

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
    this.sudokuForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // only do something if there are invalid values
      if (!this.sudokuForm.invalid) {
        this.snackBar.dismiss(); // dismiss error message if form is valid
        return;
      }

      // if form is invalid: trigger notification if not already open
      if (!this.snackBarInvalidInputOpen()) {
        this.snackBarInvalidInputOpen.set(true);
        this.openSnackBarTemp('sudoku-box.form-invalid-snack-bar-message', 'sudoku-box.form-invalid-snack-bar-action');
      }

      // if form is invalid: revalidate ALL fields such that EVERY excluding field is marked as invalid (and not just the field that was changed last)
      for (const formRow of (this.sudokuForm.get('rows') as FormArray<FormGroup>).controls) {
        for (let i = 0; i < 9; i++) {
          formRow.get('column' + i)!.updateValueAndValidity({ emitEvent: false });
        }
      }

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

    this.sudokuUnsolvable.set(false); // reset "unsolvability" whenever solving (re-)starts
    this.sudokuForm.disable(); // disable form to prevent changes
    this.disableButtonsForSolving.set(true);

    const sudoku: number[][] = convertSudokuFormToNumberArray(this.sudokuForm);
    const result: [boolean, number[][]] = solveSudoku(sudoku);
    const isSolved: boolean = result[0];
    const solvedSudoku: number[][] = result[1];

    if (isSolved) {
      this.updateSudokuFormEntries(solvedSudoku);
    } else {
      this.sudokuUnsolvable.set(true);
    }
    this.sudokuForm.enable();
    this.disableButtonsForSolving.set(false);
  }

  /**
   * Triggers the process of calculating the next number for the Sudoku puzzle.
   */
  nextNumber(): void {
    if (this.sudokuForm.invalid) {
      return;
    }

    this.sudokuUnsolvable.set(false); // reset "unsolvability" whenever solving (re-)starts
    this.sudokuForm.disable(); // disable form to prevent changes
    this.disableButtonsForSolving.set(true);

    const sudoku: number[][] = convertSudokuFormToNumberArray(this.sudokuForm);
    const result: NextNumberResult = nextNumber(sudoku);
    const isSolvable: boolean = result.isSolvable;
    const row: number = result.row;
    const column: number = result.column;
    const entry: number = result.entry;

    if (isSolvable) {
      if (entry !== -1) {
        // -1 means that puzzle is already completely solved (hence, nothing to do)
        sudoku[row][column] = entry;
        this.updateSudokuFormEntries(sudoku);
      }
    } else {
      this.sudokuUnsolvable.set(true);
    }
    this.sudokuForm.enable();
    this.disableButtonsForSolving.set(false);
  }

  /**
   * Updates the Sudoku form with the result of the Sudoku solver.
   * @param solvedSudoku solved Sudoku puzzle
   */
  private updateSudokuFormEntries(solvedSudoku: number[][]): void {
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
   * Opens the dialog for resetting the Sudoku puzzle.
   */
  openResetDialog(): void {
    const dialogRef: MatDialogRef<ResetDialogComponent> = this.dialog.open(ResetDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.resetSudoku();
      }
    });
  }

  /**
   * Resets the complete Sudoku form (i.e., removes all entries).
   */
  private resetSudoku(): void {
    this.sudokuForm.reset();
    this.sudokuUnsolvable.set(false);
  }

  /**
   * Opens a snack bar with the given message and action. Specifically, you need to provide the appropriate keys from the i18n files.
   * @param translationKeyMessage i18n key for the message
   * @param translationKeyAction i18n key for the action (i.e., the close button)
   */
  openSnackBarTemp(translationKeyMessage: string, translationKeyAction: string): void {
    firstValueFrom(
      combineLatest([this.translate.get(translationKeyMessage), this.translate.get(translationKeyAction)])
    ).then(([message, action]: [string, string]) => {
      this.snackBar
        .open(message, action)
        .afterDismissed()
        .subscribe(() => {
          this.snackBarInvalidInputOpen.set(false);
        });
    });
  }

  /**
   * Returns an array with the given length having all entries set to 0. The sole purpose of this function is to
   * circumvent the fact that Angular templates do not provide a direct way to use @for loops with an index.
   * @param length length of the array
   * @returns an array with the given length having all entries set to 0.
   */
  getZeroedArrayOfLength(length: number): number[] {
    return Array.from({ length }, () => 0);
  }
}
