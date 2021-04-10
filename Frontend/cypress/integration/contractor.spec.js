/* eslint-disable cypress/no-unnecessary-waiting */

describe("Add contractor tests", () => {
    const baseUrl = Cypress.env("baseUrl");
    const adminUsername = "andre";
    const adminPassword = "Pass123!";
    const testFirstName = "Johnie"+new Date().getTime();
    const testEmail = testFirstName+"@gmail.com";
    const domWait = 3000;

    it("should add a contractor", () => {
        cy.visit(baseUrl+'/addContractor');
        cy.url().should('eq', baseUrl+'/login?referrer=addContractor');
        cy.get('[name=username]').type(adminUsername);
        cy.get('[name=password]').type(adminPassword);
        cy.get('button[type=submit]').click();
        cy.url().should('eq', baseUrl+'/addContractor');
        
        cy.intercept('predictiveSearchResource?*').as('getSupervisor');
        cy.intercept('getAllOfficeLocations?*').as('getOfficeLocations');
        cy.intercept('getAllGroupCodes?*').as('getAllGroupCodes');
        cy.intercept('addContractor').as('addContractor');

        cy.get('[name=firstName]').type(testFirstName);
        cy.get('[name=lastName]').type('Doe');
        cy.get('[name=email]').type(testEmail);
        cy.get('[name=workPhone]').type('2345678910');
        cy.get('[name=title]').type('Contractor');
        cy.get('[name=supervisor]').type('Susan Acm').wait('@getSupervisor');
        cy.wait(domWait);
        cy.get(".search-dropdown-entry").contains("Susan Acme").click();
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

          cy.get('button[type=submit]').click();
          // eslint-disable-next-line jest/valid-expect-in-promise
          cy.wait('@addContractor').then((interception) => {
            assert.equal(interception.response.body,'New contractor added.');
          })
          // navigate to search page and search
          cy.visit(baseUrl+'/search');
          cy.intercept('predictiveSearchResource?*').as('searchByName');
          cy.get("[data-cy=search-by-name]").type(testFirstName+' Doe').wait('@searchByName');
          cy.wait(domWait);
          cy.get(".search-dropdown-entry").contains(testFirstName+' Doe').click();
          cy.get('[data-cy="employee-card"]').should("have.length", 1);
          cy.contains(testFirstName+' Doe').should("exist");
    });

    it("should not add a contractor (email already exists)", () => {
        cy.visit(baseUrl+'/addContractor');
        cy.url().should('eq', baseUrl+'/login?referrer=addContractor');
        cy.get('[name=username]').type(adminUsername);
        cy.get('[name=password]').type(adminPassword);
        cy.get('button[type=submit]').click();
        cy.url().should('eq', baseUrl+'/addContractor');
        
        cy.intercept('predictiveSearchResource?*').as('getSupervisor');
        cy.intercept('getAllOfficeLocations?*').as('getOfficeLocations');
        cy.intercept('getAllGroupCodes?*').as('getAllGroupCodes');
        cy.intercept('addContractor').as('addContractor');

        cy.get('[name=firstName]').type(testFirstName+'1');
        cy.get('[name=lastName]').type('Doe');
        cy.get('[name=email]').type(testEmail+'1');
        cy.get('[name=workPhone]').type('2345678910');
        cy.get('[name=title]').type('Contractor');
        cy.get('[name=supervisor]').type('Susan Acm').wait('@getSupervisor');
        cy.wait(domWait);
        cy.get(".search-dropdown-entry").contains("Susan Acme").click();
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

        cy.get('button[type=submit]').click();
        // eslint-disable-next-line jest/valid-expect-in-promise
        cy.wait('@addContractor').then((interception) => {
        assert.equal(interception.response.body, 'New contractor added.');
        })
          
          // Try to add the contractor again
    
        cy.get('[name=firstName]').clear().type(testFirstName+'1');
        cy.get('[name=lastName]').clear().type('Doe');
        cy.get('[name=email]').clear().type(testEmail+'1');
        cy.get('[name=workPhone]').clear().type('2345678910');
        cy.get('[name=title]').clear().type('Contractor');
        cy.get('[name=supervisor]').clear().type('Susan Acm').wait('@getSupervisor');
        cy.wait(domWait);
        cy.get(".search-dropdown-entry").contains("Susan Acme").click();
        cy.get('[name=employmentType]').click().type('{downarrow}').type('{enter}');
        cy.get('[name=YPE]').clear().type('10');
        cy.get('[name=physicalLocation]').click().type('{downarrow}').type('{enter}');
        cy.get('[name=companyCode]').click().type('{downarrow}').type('{enter}');
        cy.wait('@getOfficeLocations');
        cy.get('[name=officeCode]').click().type('{downarrow}').type('{enter}');
        cy.wait('@getAllGroupCodes');
        cy.get('[name=groupCode]').click().type('{downarrow}').type('{enter}');
        cy.get('[name=skill]').click().type('{downarrow}').type('{enter}');
        cy.get('[name=skill]').click().type('{downarrow}').type('{downarrow}').type('{enter}');

        cy.get('button[type=submit]').click();
        cy.intercept('addContractor').as('addContractor');
        // eslint-disable-next-line jest/valid-expect-in-promise
        cy.wait('@addContractor').then((interception) => {
            assert.equal(interception.response.body,'A contractor with this email: '+testEmail+'1is already in the system.');
        })
    });
    
    it("should not add a contractor (missing form fields)", () => {
        cy.visit(baseUrl+'/addContractor');
        cy.url().should('eq', baseUrl+'/login?referrer=addContractor');
        cy.get('[name=username]').type(adminUsername);
        cy.get('[name=password]').type(adminPassword);
        cy.get('button[type=submit]').click();
        cy.url().should('eq', baseUrl+'/addContractor');
        

        cy.get('form').within(() => {
            cy.get('[name=firstName]').type(testFirstName);
            cy.get('[name=lastName]').type('Doe');
            cy.get('[name=email]').type(testEmail);
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