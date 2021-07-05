// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms authors', () => {
  it('renders the list', () => {
    cy.visit('/tinycms/authors')
    cy.get('h1').contains("Authors")
    // has at least one header
    cy.get('table thead tr th')
    cy.get('th').contains("Name")

    cy.get('body')
      .then(($body) => {
        // synchronously query from body
        // to find which element was created
        if ($body.find('button.delete-author').length) {
          cy.get('button.delete-author').each(($el, index, $list) => {
            cy.wrap($el).click()
            cy.on('window:confirm', () => true);
          })
        }
      })
  })

 it('adds a new author', () => {
    cy.visit('/tinycms/authors/add')
    cy.get('input[name="name"').type("New AuthorName")
    cy.get('input[name="title"').type("Staff Editor")
    cy.get('input[name="twitter"').type("@twitterHandle")
    // cy.get('input[name="slug"').type("new-author-name")
    cy.get('textarea[name="bio"]').type("New author bio copy tk.")
    cy.get('[type="radio"]').first().check() // Check first radio element - staff
    cy.get('form').submit()
    cy.get('strong').contains('Success!')
  })

 it('updates an existing author', () => {
    cy.visit('/tinycms/authors')
    cy.get('table>tbody>tr>td>a').click();

    cy.get('input[name="title"').clear().type("Staff Writer")
    cy.get('form').submit()
    cy.get('strong').contains('Success!')
  })
})