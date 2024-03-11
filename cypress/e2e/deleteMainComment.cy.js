describe('Delete main comment', () => {
    it('Should delete main comment successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(1000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(1000)
        cy.get('#main-comment-btn').first().click()
        cy.wait(3000)
        cy.get('[data-cy="main-ellipsis"]').first().click();
        cy.wait(1000)
        cy.get('#delete-main-comment').first().click();
        cy.get('#main-comment-btn').first().click()        
    })
})
    
    