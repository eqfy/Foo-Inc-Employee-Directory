
describe("Add contractor tests", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    it.skip("should add a contractor", () => {
        cy.visit(baseUrl+'/addContractor');
        cy.url().should('eq', baseUrl+'/login?referrer=addContractor');
        cy.get('[name=username]').type("moses_admin");
        cy.get('[name=password]').type("Moses123!");
        cy.get('button[type=submit]').click();
        cy.url().should('eq', baseUrl+'/addContractor');
        
        cy.intercept('predictiveSearchResource?*').as('getSupervisor');
        cy.intercept('getAllOfficeLocations?*').as('getOfficeLocations');
        cy.intercept('getAllGroupCodes?*').as('getAllGroupCodes');

        cy.get('form').within(() => {
            cy.get('[name=firstName]').type('Johnie');
            cy.get('[name=lastName]').type('Doe');
            cy.get('[name=email]').type('johniedoe6@gmail.com');
            cy.get('[name=workPhone]').type('2345678910');
            cy.get('[name=title]').type('Contractor');
            cy.get('[name=supervisor]').type('Susan Acm').wait('@getSupervisor');
            cy.get('.search-dropdown-entry').type('{downarrow}').click(); // TODO: FIX
            cy.get('[name=employmentType]').click().type('{downarrow}').type('{enter}');
            cy.get('[name=YPE]').type('10');
            cy.get('[name=physicalLocation]').click().type('{downarrow}').type('{enter}');
            cy.get('[name=companyCode]').click().type('{downarrow}').type('{enter}');
            cy.wait('@getOfficeLocations');
            cy.get('[name=officeCode]').click().type('{downarrow}').type('{enter}');
            cy.wait('@getAllGroupCodes');
            cy.get('[name=groupCode]').click().type('{downarrow}').type('{enter}');
            cy.get('[name=skill]').click().type('{downarrow}').type('{enter}');
            cy.get('[name=skill]').click().type('{downarrow}').type('{downarrow}').type('{enter}');
          });
          cy.get('button[type=submit]').click();
          cy.intercept('addContractor').as('addContractor');
          // eslint-disable-next-line jest/valid-expect-in-promise
          cy.wait('@addContractor').then((interception) => {
            assert.isNull(interception.response.body);          //TODO: Fix/check for 'no current user' error
          })
          // navigate to search page and search
          cy.visit(baseUrl+'/search');
          cy.intercept('predictiveSearchResource?*').as('searchByName');
          cy.get('[name="searchByName"]').type('Johnie Doe').wait('@searchByName').type('{downarrow}').type('{enter}'); //TODO: Fix 

          cy.get('[data-cy="loading-results"]');
          cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

          cy.get('[data-cy="employee-card"]').should("have.length", 1);
          cy.contains("Johnie Doe").should("exist");
    });
    
    it("should not add a contractor (missing form fields)", () => {
        cy.visit(baseUrl+'/addContractor');
        cy.url().should('eq', baseUrl+'/login?referrer=addContractor');
        cy.get('[data-cy="admin-login-username-input"]').type("andre");
        cy.get('[data-cy="admin-login-password-input"]').type("Pass123!");
        cy.get('button[type=submit]').click();
        cy.url().should('eq', baseUrl+'/addContractor');
        

        cy.get('form').within(() => {
            cy.get('[name=firstName]').type('Jane');
            cy.get('[name=lastName]').type('Doe');
            cy.get('[name=email]').type('janedoe@gmail.com');
            cy.get('[name=workPhone]').type('2345678910');
            cy.get('[name=title]').type('Contractor');
            cy.get('[name=YPE]').type('10');
          })

          cy.intercept({
            method: 'PUT',
            url: '/addContractor',
            onRequest: () => {
              throw new Error('Should not have sent request to add contractor')
            }
          })

        cy.get('button[type=submit]').click();
    });
});