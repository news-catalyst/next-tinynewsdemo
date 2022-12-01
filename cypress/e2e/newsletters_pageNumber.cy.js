describe('pages/_sites/[site]/newsletters/archive/[pageNumber].js', () => {
  it('renders the newsletters archive header', () => {
    cy.visit('/newsletters/archive/1');
    cy.get('h3').contains('Newsletters Archive');
  });

  it('lists at most 10 newsletters', () => {
    cy.visit('/newsletters/archive/1');
    cy.get('[data-testid="articlesList"] > li')
      .its('length')
      .should('be.lte', 10);
  });

  it('displays the page numbers at the bottom', () => {
    cy.visit('/newsletters/archive/1');
    cy.get('[data-testid="pages"] > li').its('length').should('be.gte', 1);
  });
});
