describe('The app', () => {
  it('is running', () => {
    cy.visit('/sudoku-solver-angular');
    const header = cy.get('#heading').should('be.visible');
    header.contains('Sudoku');
  });

  it('should contain the toolbar', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#toolbar').should('be.visible');
  });

  it('should contain the how-to box', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#how-to-box').should('be.visible').contains('🔎');
  });

  it('should contain the Sudoku form', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#sudoku-form').should('be.visible');
  });

  it('should contain buttons for solving, resetting, and next number', () => {
    cy.visit('/sudoku-solver-angular');
    cy.get('#button-solve').should('be.visible');
    cy.get('#button-reset').should('be.visible');
    cy.get('#button-next-number').should('be.visible');
  });
});
