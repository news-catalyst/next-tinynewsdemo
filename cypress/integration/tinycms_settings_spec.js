describe('tinycms settings', () => {
  before(() => {
    cy.log('before tests, setting up data...');
    cy.task('db:seed');
  });
  it('updates values', () => {
    cy.visit('/tinycms/settings');
    cy.get('h1').contains('Site Information');
    cy.get('input[name="siteUrl"').clear().type('https://example.org/');
    cy.get('form.settings-form').submit();
    cy.get('strong').contains('Success!');
  });
});
