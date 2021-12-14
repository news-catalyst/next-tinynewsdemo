describe('tinycms sections', () => {
  it('renders the list', () => {
    cy.visit('/tinycms/sections');
    cy.get('h1').contains('Sections');
    // has at least one header
    cy.get('table thead tr th');
    cy.get('th').contains('Name');
  });

  it('updates an existing section', () => {
    cy.visit('/tinycms/sections');
    cy.get('table>tbody>tr:first>td>a')
      .click()
      .then(() => {
        // cy.get('input[name="title"').clear().type("News") // commented out because order of items not guaranteed and this could end up duping the existing "News" category!
        cy.get('form')
          .submit()
          .then(() => {
            cy.get('strong').contains('Success!');
          });
      });
  });
});
