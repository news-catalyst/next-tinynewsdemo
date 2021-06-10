describe('Home', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Oaklyn')
  })
})
