describe('Add main comment', () => {
    it('Should add main comment successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(1000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(1000)
        cy.get('#main-comment-input').first().type('This is a main comment', { delay: 200})
        cy.wait(1000)
        cy.get('#add-main-comment').first().click()
        cy.wait(2000)
        cy.get('#main-comment-btn').first().click()
        
    })
})
    
    