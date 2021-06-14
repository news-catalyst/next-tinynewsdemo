describe('tag page', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/tags/philadelphia')
    cy.contains('Oaklyn')
    cy.get('h3').contains("Articles tagged with Philadelphia")
    // has at least one article link
    cy.get('ul li div h4 a')
  })
})
