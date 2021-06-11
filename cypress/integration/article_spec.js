describe('article page', () => {
  it('renders successfully', () => {
    cy.visit('http://localhost:3000/articles/news/kensingtons-last-minute-gift-guide')
    cy.contains('Oaklyn')
    cy.get('h1').contains("Kensington’s Last-Minute Gift Guide")
    cy.get('main div section div span a').contains("News")
  })
})
