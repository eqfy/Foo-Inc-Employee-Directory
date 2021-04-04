/// <reference types="cypress" />

describe("Focused worker", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    it("org chart sets focused worker", () => {
        cy.visit(baseUrl);
        cy.contains("Organization Chart").click();

        cy.url().should("eq", `${baseUrl}/orgchart/20004`);
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");
        cy.get(".current").should("contain", "Wally Westerson");

        cy.get("[id=60002]").should("contain", "Buzz Aldrin").dblclick();

        cy.url().should("eq", `${baseUrl}/orgchart/60002`);
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");
        cy.get(".current").should("contain", "Buzz Aldrin");

        cy.contains("Profile View").click();

        cy.url().should("eq", `${baseUrl}/profile/60002`);
        cy.contains("Buzz Aldrin").should("exist");
    });

    it("profile view sets focused worker", () => {
        cy.visit(baseUrl);

        // Wait for the progress circle to show up, then wait for it to disappear
        // essentially wait for the search to complete
        cy.get('[data-cy="loading-results"]');
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

        cy.contains("Profile View").click();

        cy.url().should("eq", `${baseUrl}/profile/20004`);
        cy.contains("Wally Westerson").should("exist");

        cy.contains("Previous").click();
        cy.url().should("eq", `${baseUrl}/profile/20002`);
        cy.contains("Sam Smithers").should("exist");

        cy.contains("Previous").click();
        cy.url().should("eq", `${baseUrl}/profile/60003`);
        cy.contains("Neil Armstrong").should("exist");

        cy.contains("Next").click();
        cy.url().should("eq", `${baseUrl}/profile/20002`);
        cy.contains("Sam Smithers").should("exist");

        cy.contains("Organization Chart").click();
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        cy.url().should("eq", `${baseUrl}/orgchart/20002`);
        cy.get(".current").should("contain", "Sam Smithers");
    });
});
