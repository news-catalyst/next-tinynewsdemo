describe('tinycms homepage', () => {
  it('renders successfully', () => {
    cy.visit('/tinycms');
    cy.get('h1').contains('Welcome to the TinyCMS');
    // has at least one section link
    cy.get('section a div');
    cy.get('h3').contains('Analytics');
    cy.get('h3').contains('Homepage');
    cy.get('h3').contains('Settings');
    cy.get('h3').contains('Authors');
    cy.get('h3').contains('Sections');
    cy.get('h3').contains('Tags');
  });
});
