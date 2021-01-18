describe('Organizer', () => {
    
    it('has Sign In page', () => {
        cy.visit('http://localhost:3000/sign-in#/login')
    })

    it('can login with admin credentials', () => {
        cy.get('input[name=email]').type("test@test.com")
        cy.get('input[name=password]').type("test")
        cy.get('button[type=submit]').click()
        cy.get('div[class=MuiCardContent-root]').contains('Voting configuration')
    })

    it('can add shareholders', () => {
        for (var i = 0; i < 4; i++) { 
            var shareholder = 'Shareholder-' + String(i)
            var email = [shareholder, '@test.com'].join('')
            var password = [shareholder, '-password'].join('')
            var emailInput = ['input[name=', shareholder, ']'].join('')
            var passwordInput = ['input[name=Pass-', String(i), ']'].join('')
            cy.get(emailInput).type(email)
            cy.get(passwordInput).type(password)
            if (i != 3) {
                cy.get('button').contains('Add new Shareholder').click()
            }
        }
    })

    it('can logout', () => {
        cy.get('li').contains('Logout').click()
    })

    it('can organize voting E2E', () => {
        cy.visit('http://localhost:3000/sign-in#/login')
        cy.get('input[name=email]').type("test@test.com")
        cy.get('input[name=password]').type("test")
        cy.get('button[type=submit]').click()
        cy.get('div[class=MuiCardContent-root]').contains('Voting configuration')
        for (var i = 0; i < 4; i++) { 
            var shareholder = 'Shareholder-' + String(i)
            var email = [shareholder, '@test.com'].join('')
            var password = [shareholder, '-password'].join('')
            var emailInput = ['input[name=', shareholder, ']'].join('')
            var passwordInput = ['input[name=Pass-', String(i), ']'].join('')
            cy.get(emailInput).type(email)
            cy.get(passwordInput).type(password)
            if (i != 3) {
                cy.get('button').contains('Add new Shareholder').click()
            }
        }
        cy.get('input[type=submit]').click()
        cy.get('li').contains('Logout').click()
    })
})