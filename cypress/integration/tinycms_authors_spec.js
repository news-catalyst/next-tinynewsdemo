// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms authors', () => {
  before(() => {
    cy.log('before tests, setting up data...');
    cy.task('db:seed');
  });

  it('renders the list', () => {
    cy.visit('/tinycms/authors');
    cy.get('h1').contains('Authors');
    // has at least one header
    cy.get('table thead tr th');
    cy.get('th').contains('Name');
  });

  it('adds a new author', () => {
    cy.visit('/tinycms/authors/add');
    cy.location('pathname').should('eq', '/tinycms/authors/add');
    cy.get('input[name="first_names"').type('New');
    cy.get('input[name="last_name"').type('AuthorName');
    cy.get('input[name="title"').type('Staff Editor');
    cy.get('input[name="twitter"').type('@twitterHandle');
    // cy.get('input[name="slug"').type("new-author-name")
    cy.get('[type="radio"]').first().check(); // Check first radio element - staff
    cy.get('form').submit({
      timeout: 10000,
    });
    cy.get('strong', { timeout: 10000 }).contains('Success');
  });

  it('updates an existing author', () => {
    cy.task('newUser').then((user) => {
      cy.visit('/tinycms/authors');
      cy.get('table>tbody>tr:first>td>a').click();
      cy.get('input[name="first_names"').clear().type(user.firstName);
      cy.get('input[name="last_name"').clear().type(user.lastName);

      cy.get('input[name="title"').clear().type(user.title);
      cy.get('form').submit();
      cy.get('strong', { timeout: 10000 }).contains('Success');
    });
  });
});
