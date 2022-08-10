import { solveSudoku } from '../solver/sudoku-solver';

describe('Sudoku solver', () => {
  it('should solve a valid Sudoku puzzle correctly', () => {
    const sudoku: number[][] = [
      [-1, -1, -1, -1, -1, 4, -1, 9],
      [8, -1, 2, 9, 7, -1, -1, -1, -1],
      [9, -1, 1, 2, -1, -1, 3, -1, -1],
      [-1, -1, -1, -1, 4, 9, 1, 5, 7],
      [-1, 1, 3, -1, 5, -1, 9, 2, -1],
      [5, 7, 9, 1, 2, -1, -1, -1, -1],
      [-1, -1, 7, -1, -1, 2, 6, -1, 3],
      [-1, -1, -1, -1, 3, 8, 2, -1, 5],
      [-1, 2, -1, 5, -1, -1, -1, -1, -1],
    ];
    const correctSolution: number[][] = [
      [7, 3, 5, 6, 1, 4, 8, 9, 2],
      [8, 4, 2, 9, 7, 3, 5, 6, 1],
      [9, 6, 1, 2, 8, 5, 3, 7, 4],
      [2, 8, 6, 3, 4, 9, 1, 5, 7],
      [4, 1, 3, 8, 5, 7, 9, 2, 6],
      [5, 7, 9, 1, 2, 6, 4, 3, 8],
      [1, 5, 7, 4, 9, 2, 6, 8, 3],
      [6, 9, 4, 7, 3, 8, 2, 1, 5],
      [3, 2, 8, 5, 6, 1, 7, 4, 9],
    ];
    const result = solveSudoku(sudoku);
    expect(result[0]).toBeTrue();
    expect(result[1]).toEqual(correctSolution);
  });

  it('should mark an unsolvable Sudoku puzzle as unsolvable', () => {
    const unsolvableSudoku: number[][] = [
      [-1, -1, -1, -1, -1, -1, 4, 8, 9],
      [-1, -1, -1, -1, -1, -1, 5, -1, 3],
      [-1, -1, -1, -1, 3, -1, 6, -1, 2],
      [-1, -1, -1, -1, -1, -1, 2, 7, 4],
      [-1, -1, -1, -1, -1, -1, 8, 9, 5],
      [-1, 2, -1, -1, -1, -1, 1, 3, 6],
      [-1, -1, -1, -1, -1, -1, -1, -1, 7],
      [-1, -1, -1, -1, -1, -1, -1, -1, 8],
      [-1, -1, -1, -1, -1, -1, -1, -1, 1],
    ];
    const result = solveSudoku(unsolvableSudoku);
    expect(result[0]).toBeFalse();
  });

  it('should solve the empty Sudoku puzzle correctly', () => {
    const emptySudoku: number[][] = [
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
    const correctSolution: number[][] = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 1, 6, 7, 4, 8, 9, 5],
      [8, 7, 5, 9, 1, 2, 3, 6, 4],
      [6, 9, 4, 5, 3, 8, 2, 1, 7],
      [3, 1, 7, 2, 6, 5, 9, 4, 8],
      [5, 4, 2, 8, 9, 7, 6, 3, 1],
      [9, 6, 8, 3, 4, 1, 5, 7, 2],
    ];
    const result = solveSudoku(emptySudoku);
    expect(result[0]).toBeTrue();
    expect(result[1]).toEqual(correctSolution);
  });
});
