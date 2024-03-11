describe('Delete post', () => {
    it('Should delete post successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.get('[data-cy="profile"]').click()
        cy.wait(2000)
        cy.get('[data-cy="post-ellipsis"]').first().click();
        cy.wait(1000)
        cy.get('#delete-post').first().click();
    })
})
    
    