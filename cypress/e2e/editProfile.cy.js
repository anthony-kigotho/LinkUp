describe('Edit profile', () => {
    it('Should edit user profile successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(1000)
        cy.get('[data-cy="profile"]').click()
        cy.wait(1000)
        cy.get('.btn-edit').click()
        cy.wait(1000)
        cy.get('#user-bio').type('Trust the process', { delay: 200 })
        cy.wait(1000)
        cy.get('#save-btn').click()
        
    })
})
    
    