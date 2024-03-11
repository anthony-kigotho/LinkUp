describe('Register user', () => {
  it('Register user successfully', () => {
    cy.visit('http://127.0.0.1:5500/client/landing/index.html')
    cy.wait(2000)
    cy.get('[data-cy="sign-up"]').click()
    cy.get('#display-name').type('Doe', { delay: 200 })
    cy.get('#username').type('doe', { delay: 200 })
    cy.get('#email').type('doe@gmail.com', { delay: 200 })
    cy.get('#password').type('Pass1234', { delay: 200 })
    cy.get('#confirm-password').type('Pass1234', { delay: 200 })
    cy.get('#sign-up').click()
  })
})

