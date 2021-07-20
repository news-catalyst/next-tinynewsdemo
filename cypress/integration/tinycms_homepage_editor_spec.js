describe('tinycms homepage editor', () => {
  it('displays the editor and changes layout', () => {
    cy.visit('/tinycms/homepage')
    cy.get('a').contains("Change Layout:")
    cy.get('a.layout-switcher:last').click()
    // cy.get('form').submit()
    cy.get('a.layout-switcher:last').contains("(current)")
  })
})