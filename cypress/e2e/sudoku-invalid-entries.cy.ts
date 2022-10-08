describe('The Sudoku solver', () => {
  it('should mark fields with numbers being less than 1 as invalid until the entry is removed', () => {
    cy.visit('/');
    cy.get('#sudoku-input-37.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-37').type('0');
    cy.get('#sudoku-input-37.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-37').type('{backspace}');
    cy.get('#sudoku-input-37.sudoku-input.ng-valid').should('have.length', 1);

    cy.get('#sudoku-input-81.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-81').type('-7');
    cy.get('#sudoku-input-81.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-81').type('{backspace}{backspace}');
    cy.get('#sudoku-input-81.sudoku-input.ng-valid').should('have.length', 1);
  });

  it('should mark fields with numbers being greater than 9 as invalid until the entry is removed', () => {
    cy.visit('/');
    cy.get('#sudoku-input-64.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-64').type('10');
    cy.get('#sudoku-input-64.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-64').type('{backspace}{backspace}');
    cy.get('#sudoku-input-64.sudoku-input.ng-valid').should('have.length', 1);

    cy.get('#sudoku-input-47.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-47').type('317');
    cy.get('#sudoku-input-47.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-47').type('{backspace}{backspace}{backspace}');
    cy.get('#sudoku-input-47.sudoku-input.ng-valid').should('have.length', 1);
  });

  it('should mark fields with symbols not being nubmers as invalid until the entry is removed', () => {
    cy.visit('/');
    cy.get('#sudoku-input-13.sudoku-input.ng-valid').should('have.length', 1); // assumption
    cy.get('#sudoku-input-13').type('a');
    cy.get('#sudoku-input-13.sudoku-input.ng-valid').should('have.length', 0);
    cy.get('#sudoku-input-13').type('{backspace}');
    cy.get('#sudoku-input-13.sudoku-input.ng-valid').should('have.length', 1);
  });

  it('should disable the buttons for solving and next number if there is an invalid entry', () => {
    cy.visit('/');
    cy.get('#sudoku-input-27').type('a');
    cy.get('#sudoku-input-27.sudoku-input.ng-valid').should('have.length', 0); // assumption

    cy.get('#button-solve').should('be.disabled');
    cy.get('#button-next-number').should('be.disabled');
  });

  it('should show an error message in case of an invalid input', () => {
    cy.visit('/');
    cy.get('.mat-snack-bar-container').should('not.exist'); // assumption
    cy.get('#sudoku-input-27').type('a');
    cy.get('#sudoku-input-27.sudoku-input.ng-valid').should('have.length', 0); // assumption

    cy.get('.mat-snack-bar-container').should('be.visible');
  });

  it('should mark inputs as invalid if the same number appears twice in a row, column, or box', () => {
    cy.visit('/');
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
