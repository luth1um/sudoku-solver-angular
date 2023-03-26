/**
 * This file only contains Sudoku puzzles that are computationally expensive.
 * These Sudokus are only meant for performance tests.
 * DO NOT use these tests as regular E2E tests.
 */
describe('The Sudoku solver', () => {
  it('should solve a computionally expensive puzzle', () => {
    const sudoku: number[][] = [
      [-1, -1, -1, -1, -1, 6, -1, -1, -1],
      [-1, 5, 9, -1, -1, -1, -1, -1, 8],
      [2, -1, -1, -1, -1, 8, -1, -1, -1],
      [-1, 4, 5, -1, -1, -1, -1, -1, -1],
      [-1, -1, 3, -1, -1, -1, -1, -1, -1],
      [-1, -1, 6, -1, -1, 3, -1, 5, 4],
      [-1, -1, -1, 3, 2, 5, -1, -1, 6],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];
    const correctSolution: number[][] = [
      [4, 3, 8, 7, 9, 6, 2, 1, 5],
      [6, 5, 9, 1, 3, 2, 4, 7, 8],
      [2, 7, 1, 4, 5, 8, 6, 9, 3],
      [8, 4, 5, 2, 1, 9, 3, 6, 7],
      [7, 1, 3, 5, 6, 4, 8, 2, 9],
      [9, 2, 6, 8, 7, 3, 1, 5, 4],
      [1, 9, 4, 3, 2, 5, 7, 8, 6],
      [3, 6, 2, 9, 8, 7, 5, 4, 1],
      [5, 8, 7, 6, 4, 1, 9, 3, 2],
    ];

    cy.visit('/sudoku-solver-angular');
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (sudoku[row][column] !== -1) {
          cy.get('#sudoku-input-' + row + column).type('' + sudoku[row][column]);
        }
      }
    }
    cy.get('#button-solve').click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const inputField = cy.get('#sudoku-input-' + row + column);
        inputField.should('contain.value', correctSolution[row][column]);
      }
    }
  });
});
