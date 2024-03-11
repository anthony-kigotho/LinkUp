describe('Create post', () => {
    it('Should create post with no image successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(2000)
        cy.get('[data-cy="post"]').click()
        cy.wait(1000)
        cy.get('#post-content').type('E2E is fun', { delay: 300 })
        cy.get('#post-btn').click()
        cy.get('[data-cy="profile"]').click()
        cy.wait(3000)
    })

    it('Should create post with an image successfully', () => {
        cy.login('doe', 'Pass1234')
        cy.wait(2000)
        cy.get('[data-cy="post"]').click()
        cy.wait(1000)
        cy.get('#post-content').type('Post with an image', { delay: 300 })
        cy.get('#post-img').attachFile('images/clock.jpg')
        cy.get('#post-btn').click()
        cy.wait(3000)
        cy.get('[data-cy="profile"]').click()
    })
})
    
    