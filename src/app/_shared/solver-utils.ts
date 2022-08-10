import { FormArray, FormGroup } from '@angular/forms';

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
