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

        cy.get("[id=20104]").should("contain", "Gordon Trent").click();

        cy.url().should("eq", `${baseUrl}/orgchart/20104`);
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");
        cy.get(".current").should("contain", "Gordon Trent");

        cy.contains("Profile View").click();

        cy.url().should("eq", `${baseUrl}/profile/20104`);
        cy.contains("Gordon Trent").should("exist");
    });

    it("profile view sets focused worker", () => {
        cy.visit(baseUrl);

        // Wait for the progress circle to show up, then wait for it to disappear
        // essentially wait for the search to complete
        cy.get('[data-cy="loading-results"]');
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

        cy.contains("Alice Allen").click();

        cy.contains("Profile View").click();

        cy.url().should("eq", `${baseUrl}/profile/60645`);
        cy.contains("Alice Allen").should("exist");

        cy.contains("Next").click();
        cy.url().should("eq", `${baseUrl}/profile/60105`);
        cy.contains("Allison Martin").should("exist");

        cy.contains("Next").click();
        cy.url().should("eq", `${baseUrl}/profile/60815`);
        cy.contains("Amanda Hamiton").should("exist");

        cy.contains("Previous").click();
        cy.url().should("eq", `${baseUrl}/profile/60105`);
        cy.contains("Allison Martin").should("exist");

        cy.contains("Organization Chart").click();
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        cy.url().should("eq", `${baseUrl}/orgchart/60105`);
        cy.get(".current").should("contain", "Allison Martin");
    });
});
