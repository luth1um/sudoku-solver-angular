import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { convertSudokuFormToNumberArray } from '../_shared/solver-utils';

/**
 * Validator function to check whether there are Sudoku form entries exluding each other (e.g., the same number appears twice in a row).
 * @param row row of the field to validate
 * @param column column of the field to validate
 * @returns validator function to check whether there are Sudoku form entries exluding each other
 */
export function excludingEntriesValidator(sudokuForm: FormGroup, row: number, column: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const entry: number = parseInt(control.value);
    const sudoku: number[][] = convertSudokuFormToNumberArray(sudokuForm);
    if (
      !rowContainsEntryAtMostOnce(sudoku, row, entry) ||
      !columnContainsEntryAtMostOnce(sudoku, column, entry) ||
      !boxContainsEntryAtMostOnce(sudoku, row, column, entry)
    ) {
      return { exludingEntry: '(row: ' + row + ', column: ' + column + ')' };
    }
    return null;
  };
}

/**
 * Checks for the given row whether the given entry is contained more than once.
 * @param sudoku the Sudoku puzzle to check
 * @param row the row to check
 * @param entry the entry value to check
 * @returns true if, and only if, the given row contains the given entry at most once
 */
function rowContainsEntryAtMostOnce(sudoku: number[][], row: number, entry: number): boolean {
  let entryFoundOnce: boolean = false;
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === entry) {
      if (entryFoundOnce) {
        return false;
      } else {
        entryFoundOnce = true;
      }
    }
  }
  return true;
}

/**
 * Checks for the given column whether the given entry is contained more than once.
 * @param sudoku the Sudoku puzzle to check
 * @param column the column to check
 * @param entry the entry value to check
 * @returns true if, and only if, the given column contains the given entry at most once
 */
function columnContainsEntryAtMostOnce(sudoku: number[][], column: number, entry: number): boolean {
  let entryFoundOnce: boolean = false;
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][column] === entry) {
      if (entryFoundOnce) {
        return false;
      } else {
        entryFoundOnce = true;
      }
    }
  }
  return true;
}

/**
 * Checks for the box of the given entry whether the box contains the entry more than once.
 * @param sudoku the Sudoku puzzle to check
 * @param row row of the entry to check
 * @param column column of the entry to check
 * @param entry the entry value to check
 * @returns true if, and only if, the box of the given entry contains the given entry at most once
 */
function boxContainsEntryAtMostOnce(sudoku: number[][], row: number, column: number, entry: number): boolean {
  const leftmostCoordOfBox = Math.trunc(column / 3) * 3;
  const topmostCoordOfBox = Math.trunc(row / 3) * 3;
  let entryFoundOnce: boolean = false;

  for (let i = topmostCoordOfBox; i < topmostCoordOfBox + 3; i++) {
    for (let j = leftmostCoordOfBox; j < leftmostCoordOfBox + 3; j++) {
      if (sudoku[i][j] === entry) {
        if (entryFoundOnce) {
          return false;
        } else {
          entryFoundOnce = true;
        }
      }
    }
  }
  return true;
}
