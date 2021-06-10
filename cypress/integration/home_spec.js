describe('Home', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Oaklyn')
    cy.get('header nav a[href="/business"]')
    cy.get('a.featured')
  })
})
