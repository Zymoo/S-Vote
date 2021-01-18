describe('Voter', () => {
    
    it('has Sign Up page', () => {
        cy.visit('http://localhost:3000/sign-up')
    })

    it('can login with some credentials', () => {
        cy.get('input[id=email]').type("voter@test.com")
        cy.get('input[id=password]').type("password")
        cy.get('button[type=submit]').click()
        cy.get('button').contains(' Sign up for elections!')
    })

    it('can sign up for elections', () => {
        cy.get('button').contains(' Sign up for elections!').click()
        cy.wait(10)
    })

    it('can choose a candidate', () =>{
        cy.get('.btn').click()
        cy.wait(1000)
        cy.get('.btn').click()
        cy.wait(2000)
        cy.get('[type="radio"]').last().check()
    })

    it('can cast a vote', () => {
        cy.get('button[type=submit]').click()
    })
})