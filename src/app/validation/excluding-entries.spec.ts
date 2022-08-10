import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { excludingEntriesValidator } from './excluding-entries';

describe('The validation function for excluding Sudoku form entries', () => {
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
          column0: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column1: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column2: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column3: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column4: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column5: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column6: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column7: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
          column8: fb.control<string>('', {
            validators: [excludingEntriesValidator(sudokuForm, i, 0)],
          }),
        })
      );
    }
  });

  it('should mark a form with only valid inputs as valid', () => {
    // set values for some fields
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('0')!.patchValue({ column1: '5' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('3')!.patchValue({ column4: '9' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('7')!.patchValue({ column6: '2' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('8')!.patchValue({ column8: '4' });

    const isValid = sudokuForm.valid;
    expect(isValid).toBeTrue();
  });

  it('should mark the empty form as valid', () => {
    const isValid = sudokuForm.valid;
    expect(isValid).toBeTrue();
  });

  it('should mark a form with entries excluding each other in the same row as invalid', () => {
    // set values for some fields
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('3')!.patchValue({ column1: '5' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('3')!.patchValue({ column7: '5' });

    const isInvalid = sudokuForm.invalid;
    expect(isInvalid).toBeTrue();
  });

  it('should mark a form with entries excluding each other in the same column as invalid', () => {
    // set values for some fields
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('0')!.patchValue({ column0: '5' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('3')!.patchValue({ column0: '5' });

    const isInvalid = sudokuForm.invalid;
    expect(isInvalid).toBeTrue();
  });

  it('should mark a form with entries excluding each other in the same box as invalid', () => {
    // set values for some fields
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('0')!.patchValue({ column0: '5' });
    (sudokuForm.get('rows') as FormArray<FormGroup>).get('2')!.patchValue({ column1: '5' });

    const isInvalid = sudokuForm.invalid;
    expect(isInvalid).toBeTrue();
  });
});
