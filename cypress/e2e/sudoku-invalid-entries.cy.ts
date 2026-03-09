describe('The Sudoku solver', () => {
  it('should not allow entering 0 in a cell', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#sudoku-input-37').should('contain.value', ''); // assumption
    cy.get('#sudoku-input-37').type('0');
    cy.get('#sudoku-input-37').should('contain.value', '');

    cy.get('#sudoku-input-81').should('contain.value', ''); // assumption
    cy.get('#sudoku-input-81').type('0');
    cy.get('#sudoku-input-81').should('contain.value', '');
  });

  it('should not allow entering numbers greater than 9 and only accept the valid leading digit', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#sudoku-input-64').should('contain.value', ''); // assumption
    cy.get('#sudoku-input-64').type('10');
    // '1' is valid and auto-advances focus, '0' lands in the next cell and is blocked
    cy.get('#sudoku-input-64').should('contain.value', '1');
    cy.get('#sudoku-input-65').should('contain.value', '');

    cy.get('#sudoku-input-47').should('contain.value', ''); // assumption
    cy.get('#sudoku-input-47').type('317');
    // '3' is valid and auto-advances, '1' lands in next cell, '7' lands in the one after
    cy.get('#sudoku-input-47').should('contain.value', '3');
  });

  it('should not allow entering letters in a cell', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#sudoku-input-13').should('contain.value', ''); // assumption
    cy.get('#sudoku-input-13').type('a');
    cy.get('#sudoku-input-13').should('contain.value', '');
  });

  it('should disable the buttons for solving and next number if there is an invalid entry', () => {
    cy.visit('/sudoku-solver-angular');
    // Use duplicate entries to trigger the excludingEntries validator
    cy.get('#sudoku-input-00').type('5');
    cy.get('#sudoku-input-01').type('5');
    cy.get('#sudoku-input-00.sudoku-input.ng-invalid').should('have.length', 1); // assumption

    cy.get('#button-solve').should('be.disabled');
    cy.get('#button-next-number').should('be.disabled');
  });

  it('should show an error message in case of an invalid input', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('mat-snack-bar-container').should('not.exist'); // assumption
    // Use duplicate entries to trigger the excludingEntries validator
    cy.get('#sudoku-input-00').type('5');
    cy.get('#sudoku-input-01').type('5');
    cy.get('#sudoku-input-00.sudoku-input.ng-invalid').should('have.length', 1); // assumption

    cy.get('mat-snack-bar-container').should('be.visible');
  });

  it('should mark inputs as invalid if the same number appears twice in a row, column, or box', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#sudoku-input-21.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-65.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-61.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-02.sudoku-input.ng-valid').should('have.length', 1); // assumption

    cy.get('#sudoku-input-21').type('3');

    cy.get('#sudoku-input-21.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-65.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-61.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-02.sudoku-input.ng-valid').should('have.length', 1);

    cy.get('#sudoku-input-65').type('3');

    cy.get('#sudoku-input-21.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-65.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-61.sudoku-input.ng-valid').should('have.length', 1);
    cy.get('#sudoku-input-02.sudoku-input.ng-valid').should('have.length', 1);

    cy.get('#sudoku-input-61').type('3');

    cy.get('#sudoku-input-21.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-65.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-61.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-02.sudoku-input.ng-valid').should('have.length', 1);

    cy.get('#sudoku-input-02').type('3');

    cy.get('#sudoku-input-21.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-65.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-61.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-02.sudoku-input.ng-valid').should('have.length', 0);
  });
});
