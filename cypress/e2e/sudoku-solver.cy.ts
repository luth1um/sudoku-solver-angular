describe('The Sudoku solver', () => {
  it('should initially only have empty fields', () => {
    cy.visit('/');
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        cy.get('#sudoku-input-' + row + column)
          .should('be.visible')
          .should('contain.text', '');
      }
    }
  });

  it('should solve the empty Sudoku puzzle correctly and display the solution', () => {
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

    cy.visit('/');
    cy.get('#button-solve').click();

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const inputField = cy.get('#sudoku-input-' + row + column);
        inputField.should('contain.value', correctSolution[row][column]);
      }
    }
  });

  it('should solve a valid Sudoku puzzle correctly and display the solution', () => {
    const sudoku: number[][] = [
      [-1, -1, -1, -1, -1, 4, -1, 9, -1],
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

    cy.visit('/');
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

  it('should have an empty puzzle when the reset button is pressed', () => {
    const id0: string = '#sudoku-input-35';
    const id1: string = '#sudoku-input-76';

    cy.visit('/');

    cy.get(id0).should('contain.text', ''); // assumption
    cy.get(id1).should('contain.text', ''); // assumption
    cy.get(id0).type('3');
    cy.get(id1).type('7');
    cy.get(id0).should('contain.value', 3); // assumption
    cy.get(id1).should('contain.value', 7); // assumption

    cy.get('#button-reset').click();
    cy.get('#button-reset-confirm').click();

    cy.get(id0).should('contain.text', '');
    cy.get(id1).should('contain.text', '');
  });

  // TODO: test for next number (different file)

  // TODO: test next number and solve complete puzzle (different file)
});
