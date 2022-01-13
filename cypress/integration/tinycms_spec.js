// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms', () => {
  // before(() => {
  //   cy.log('before tests, setting up data...');
  //   cy.task('db:seed');
  // });

  it('renders the authors list', () => {
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

  it('renders the homepage successfully', () => {
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

  it('renders the sections list', () => {
    cy.visit('/tinycms/sections');
    cy.get('h1').contains('Sections');
    // has at least one header
    cy.get('table thead tr th');
    cy.get('th').contains('Name');
  });

  it('updates an existing section', () => {
    cy.visit('/tinycms/sections').then(() => {
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

  it('updates the settings', () => {
    cy.visit('/tinycms/settings');
    cy.get('h1').contains('Site Information');
    cy.get('input[name="siteUrl"').clear().type('https://example.org/');
    cy.get('form.settings-form').submit();
    cy.get('strong').contains('Success!');
  });

  it('renders the tags list and updates the first tag', () => {
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

  //   it('displays the editor and changes layout', () => {
  //     cy.visit('/tinycms/homepage');
  //     cy.get('a').contains('Change Layout:');
  //     cy.get('a.layout-switcher:last', { timeout: 10000 }).click();
  //     // cy.get('form').submit()
  //     cy.get('a.layout-switcher:last', { timeout: 10000 }).contains('(current)');
  //   });
});
