// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms tags', () => {
  it('renders the list and updates the first tag', () => {
    cy.visit('/tinycms/tags');
    cy.get('h1').contains('Tags');
    // has at least one header
    cy.get('table thead tr th');
    cy.get('th').contains('Name');

    cy.get('table>tbody>tr:first>td>a')
      .click()
      .then(() => {
        cy.get('input[name="title"').clear().type('Updated Tag');
        cy.get('form').submit();
        cy.get('strong').contains('Success!');
      });
  });

  it('adds a new tag', () => {
    cy.visit('/tinycms/tags/add');
    cy.task('newTagTitle').then((title) => {
      cy.log('new tag title:', title);
      cy.get('input[name="title"').type(title);
      cy.get('form')
        .submit()
        .then(() => {
          cy.get('strong').contains('Success!');
        });
    });
  });
});
