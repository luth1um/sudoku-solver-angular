import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertSudokuFormToNumberArray } from './solver-utils';

describe('Sudoku form conversion to number array', () => {
  let sudokuForm: FormGroup<{ rows: FormArray<FormControl<unknown>> }>;

  beforeEach(async () => {
    // create an empty form to be filled and/or converted later
    const fb = new FormBuilder();
    sudokuForm = fb.group({
      rows: fb.array([]),
    });
    for (let i = 0; i < 9; i++) {
      (sudokuForm.get('rows') as FormArray<FormGroup>).push(
        fb.group({
          column0: fb.control<string>(''),
          column1: fb.control<string>(''),
          column2: fb.control<string>(''),
          column3: fb.control<string>(''),
          column4: fb.control<string>(''),
          column5: fb.control<string>(''),
          column6: fb.control<string>(''),
          column7: fb.control<string>(''),
          column8: fb.control<string>(''),
        })
      );
    }
  });

  it('should produce the correct result for a valid input', () => {
    // set values for some fields
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('0')!.patchValue({ column3: '5' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('3')!.patchValue({ column1: '9' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('7')!.patchValue({ column1: '2' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('8')!.patchValue({ column8: '4' });

    // expected result
    const expectedArray: number[][] = [
      [-1, -1, -1, 5, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 9, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 2, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, 4],
    ];

    // compare result with expected result
    const result = convertSudokuFormToNumberArray(sudokuForm);
    expect(result).toEqual(expectedArray);
  });

  it('should produce the correct result for the empty form input', () => {
    // expected result
    const expectedArray: number[][] = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    // compare result with expected result
    const result = convertSudokuFormToNumberArray(sudokuForm);
    expect(result).toEqual(expectedArray);
  });
});
