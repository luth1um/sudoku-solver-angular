describe('The Sudoku solver', () => {
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

    cy.visit('/');
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (unsolvableSudoku[row][column] !== -1) {
          cy.get('#sudoku-input-' + row + column).type('' + unsolvableSudoku[row][column]);
        }
      }
    }
    cy.get('#card-sudoku-unsolvable').should('not.exist'); // assumption
    cy.get('#button-solve').click();
    cy.get('#card-sudoku-unsolvable').should('be.visible');
  });
});
