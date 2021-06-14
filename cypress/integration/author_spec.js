describe('author page', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/authors/jacqui-lough')
    cy.contains('Oaklyn')
    cy.get('h3').contains("Stories by Jacqui Lough")
    cy.get('ul li div h4 a')
  })
})
