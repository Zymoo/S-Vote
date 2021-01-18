var id = 0;

beforeEach(() => {
    id = id + 1;
  })

describe('Organizer', () => {
    it('can organize voting', () => {
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
        cy.wait(10000)
    })
})

var n_voters = 5;
var i = 0;
for (i = 0; i < n_voters; i++) {
    describe('Voter-' + String(i), () => {
        beforeEach(() => {
            id = id + 1;
          })

        it('has Sign Up page', () => {
            cy.visit('http://localhost:3000/sign-up')
        })
    
        it('can login with some credentials', () => {
            var email = ['voter-', String(id), '@test.com'].join('')
            cy.get('input[id=email]').type(email)
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
            cy.wait(1000)
            cy.get('[type="radio"]').last().check()
        })

        it('can cast a vote', () => {
            cy.get('button[type=submit]').click()
        })
    })
}