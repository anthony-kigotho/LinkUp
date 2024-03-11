describe('Follow user', () => {
    it('Should follow user successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(2000)
        cy.get('#show-more').click();
        cy.get('#follow').first().click();
        cy.wait(2000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(2000)
        cy.get('#following-btn').click()
    })
})
    