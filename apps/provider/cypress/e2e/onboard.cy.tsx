it('onboards the user', () => {
  cy.visit('http://127.0.0.1:3000/admin/onboard');

  cy.get('[name=company_name]').type("my business")
  cy.get('[name=location]').type("your locations")
  cy.get('[name=username]').type("your locations")
  cy.get('[name=email]').type("your locations")
  cy.get('[name=password]').type("your locations")
  cy.get('button[type=submit]').click();
  cy.get('button[type=submit]').contains("loading...")
})

