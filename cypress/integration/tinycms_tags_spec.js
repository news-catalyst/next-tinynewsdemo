// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms tags', () => {
  it('renders the list', () => {
    cy.visit('/tinycms/tags')
    cy.get('h1').contains("Tags")
    // has at least one header
    cy.get('table thead tr th')
    cy.get('th').contains("Name")

    cy.get('body')
      .then(($body) => {
        // synchronously query from body
        // to find which element was created
        if ($body.find('button.delete-tag').length) {
          cy.get('button.delete-tag').each(($el, index, $list) => {
            cy.wrap($el).click()
            cy.on('window:confirm', () => true);
          })
        }
      })
  })

 it('adds a new tag', () => {
    cy.visit('/tinycms/tags/add')
    cy.get('input[name="title"').type("New Tag")
    cy.get('input[name="slug"').type("new-tag")
    cy.get('form').submit().then( () => {
      cy.get('strong').contains('Success!')
    });
  })

 it('updates an existing tag', () => {
    cy.visit('/tinycms/tags')
    cy.get('table>tbody>tr>td>a').click().then(() => {
      cy.get('input[name="title"').clear().type("Updated Tag")
      cy.get('form').submit()
      cy.get('strong').contains('Success!')
    });

  })
})