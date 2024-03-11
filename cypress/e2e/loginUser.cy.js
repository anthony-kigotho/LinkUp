describe('Login user', () => {
  it('Login user successfully', () => {
    cy.visit('http://127.0.0.1:5500/client/landing/index.html')
    cy.wait(2000)
    cy.get('[data-cy="login"]').click()
    cy.get('#username').type('doe', { delay: 200 })
    cy.get('#password').type('Pass1234', { delay: 200 })
    cy.get('#sign-in').click()
  })
})
  
  