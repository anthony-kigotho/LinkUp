describe('Delete sub comment', () => {
    it('Should delete sub comment successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(1000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(2000)
        cy.get('#main-comment-btn').first().click()
        cy.wait(2000)
        cy.get('#sub-comment-btn').first().click()
        cy.wait(1000)
        cy.get('[data-cy="sub-ellipsis"]').first().click();
        cy.wait(1000)
        cy.get('#delete-sub-comment').first().click();
        cy.wait(2000)
        cy.get('#main-comment-btn').first().click()        
        cy.get('#sub-comment-btn').first().click()        
    })
})
    
    