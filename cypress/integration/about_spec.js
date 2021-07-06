describe('about page', () => {
  it('renders a 404 page', () => {
    cy.request({url: '/about', failOnStatusCode: false}).its('status').should('equal', 404)
    cy.visit('/about', {failOnStatusCode: false})
  })
  // it('renders successfully', () => {
  //   cy.visit('http://localhost:3000/about')
  //   cy.contains('The Test Org')
  //   cy.get('h1').contains("About Oaklyn")
  //   cy.get('h1 span').contains("About")
  //   // has at least one paragraph of text
  //   cy.get('div p span')
  //   cy.get('h2').contains("Our Staff")
  // })
})
