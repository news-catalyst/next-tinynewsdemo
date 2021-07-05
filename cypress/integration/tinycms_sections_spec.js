describe('tinycms sections', () => {
  it('renders the list', () => {
    cy.visit('/tinycms/sections')
    cy.get('h1').contains("Sections")
    // has at least one header
    cy.get('table thead tr th')
    cy.get('th').contains("Name")
  })

//  it('adds a new tag', () => {
//     cy.visit('/tinycms/tags/add')
//     cy.get('input[name="title"').type("New Tag")
//     cy.get('input[name="slug"').type("new-tag")
//     cy.get('form').submit().then( () => {
//       cy.get('strong').contains('Success!')
//     });
//   })

 it('updates an existing section', () => {
    cy.visit('/tinycms/sections')
    cy.get('table>tbody>tr>td>a:first').click().then(() => {
      cy.get('input[name="title"').clear().type("News")
      cy.get('form').submit()
      cy.get('strong').contains('Success!')
    });

  })
})