// import { cypressDeleteAuthors } from "../../lib/authors"

describe('tinycms tags', () => {
  it('renders the list', () => {
    cy.visit('/tinycms/tags')
    cy.get('h1').contains("Tags")
    // has at least one header
    cy.get('table thead tr th')
    cy.get('th').contains("Name")
  })

 it('adds a new tag', () => {
    cy.task("db:tags");
    cy.visit('/tinycms/tags/add')
    cy.get('input[name="title"').type("New Tag")
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