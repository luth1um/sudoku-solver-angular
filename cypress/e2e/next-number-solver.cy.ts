describe('The next-number solver', () => {
  it("should fill the first field with entry '1' in case of an empty Sudoku puzzle", () => {
    cy.visit('/sudoku-solver-angular');
    // check assumption that Sudoku puzzle is empty
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        cy.get('#sudoku-input-' + row + column).should('contain.value', '');
      }
    }

    cy.get('#button-next-number').click();
    cy.get('#sudoku-input-00').should('contain.value', '1');
  });

  it('should not make any changes in case the Sudoku puzzle is already solved', () => {
    const entries: number[][] = [
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
    cy.visit('/sudoku-solver-angular');

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        cy.get('#sudoku-input-' + row + column).type('' + entries[row][column]);
      }
    }

    // press button 10 times
    for (let i = 0; i < 10; i++) {
      cy.wait(100);
      cy.get('#button-next-number').click();
    }

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        cy.get('#sudoku-input-' + row + column).should('contain.value', entries[row][column]);
      }
    }
  });

  it('should eventually solve the Sudoku puzzle when the next-number button is clicked repeatedly', () => {
    const entries: number[][] = [
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
    cy.visit('/sudoku-solver-angular');

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (entries[row][column] !== -1) {
          cy.get('#sudoku-input-' + row + column).type('' + entries[row][column]);
        }
      }
    }

    // press next-number button often enough (46 empty fields + some additional clicks if solver too slow)
    for (let i = 0; i < 60; i++) {
      cy.wait(100);
      cy.get('#button-next-number').click();
    }

    // check result
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        cy.get('#sudoku-input-' + row + column).should('contain.value', correctSolution[row][column]);
      }
    }
  });
});
