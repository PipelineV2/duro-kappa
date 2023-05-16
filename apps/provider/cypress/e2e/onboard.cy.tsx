it('onboards the user', () => {
	cy.visit('http://localhost:3000/onboard');

	cy.get('[name=business_name]').type("my business")
	cy.get('[name=location]').type("your locations")
	cy.get('button[type=submit]').click();
	cy.get('button[type=submit]').contains("loading...")
})

