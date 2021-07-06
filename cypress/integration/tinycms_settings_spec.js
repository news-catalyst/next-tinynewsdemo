describe('tinycms settings', () => {
  it('updates values', () => {
    cy.visit('/tinycms/settings')
    cy.get('h1').contains("Site Information")
    cy.get('input[name="siteUrl"').clear().type("https://example.org/")
    cy.get('form').submit()
    cy.get('strong').contains('Success!')
  })
})