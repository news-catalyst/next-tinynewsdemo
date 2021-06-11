describe('homepage', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Oaklyn')
    cy.get('header nav a[href="/business"]')
    cy.get('a.featured')
  })
  it('renders the business section page successfully', () => {
    cy.visit('http://localhost:3000/business')
    cy.contains('Oaklyn')
    cy.get('h3').contains("Business")
    cy.get('ul li div h4 a')
  })
})
