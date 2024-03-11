describe('Add sub comment', () => {
    it('Should add sub comment successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(1000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(1000)
        cy.get('#main-comment-btn').first().click()
        cy.wait(2000)
        cy.get('#sub-comment-btn').first().click()
        cy.wait(1000)
        cy.get('#sub-comment-input').first().type('This is a sub comment', { delay: 200})
        cy.wait(1000)
        cy.get('#add-sub-comment').first().click()
        cy.wait(1000)
        cy.get('#main-comment-btn').first().click()
        cy.get('#sub-comment-btn').first().click()
        
    })
})
    
    