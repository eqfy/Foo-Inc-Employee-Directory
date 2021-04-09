describe("Search page search by name", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    beforeEach(() => {
        // Reload the page to clear all redux states
        cy.reload();
    });

    it("Single worker matched", () => {
        // Visit the search page and wait for current user to be loaded
        cy.visit(baseUrl);
        cy.get(".MuiChip-deleteIcon", { timeout });

        // Search by name
        cy.get("[data-cy=search-by-name]").type("Da Silva");
        cy.get('[data-cy="loading-name-result"]', {
            timeout,
        }).should("exist");
        cy.get('[data-cy="loading-name-result"]', {
            timeout,
        }).should("not.exist");
        cy.get(".search-dropdown-entry", {
            timeout,
        })
            .contains("Gregore Da Silva")
            .click();
        cy.get(".search-dropdown-entry").should("not.exist");

        // Check that existing filters are cleared and name is the only filter
        cy.get(".MuiChip-label").should("have.length", 1);
        cy.get(".MuiChip-label").contains("Searched name: Gregore Da Silva");

        // Delete the name filter and check if search by name bar is coordinated
        cy.get(".MuiAutocomplete-endAdornment").click();
        cy.get('[data-cy="search-by-name"]')
            .contains("Gregore Da Silva")
            .should("not.exist");
        cy.get(".MuiChip-label").should("have.length", 0);
    });
    it("Multiple worker matched", () => {
        // Visit the search page and wait for current user to be loaded
        cy.visit(baseUrl);
        cy.get(".MuiChip-deleteIcon", { timeout });

        // Search by name for duplicate
        cy.get("[data-cy=search-by-name]").type("B Aldrin");
        cy.get('[data-cy="loading-name-result"]', {
            timeout,
        }).should("exist");
        cy.get('[data-cy="loading-name-result"]', {
            timeout,
        }).should("not.exist");
        cy.get(".search-dropdown-entry").contains("found");
        cy.get(".search-dropdown-entry", {
            timeout,
        })
            .contains("Buzz Aldrin")
            .click();
        cy.get(".search-dropdown-entry").should("not.exist");

        // Check that existing filters are cleared and name is the only filter
        cy.get(".MuiChip-label").should("have.length", 1);
        cy.get(".MuiChip-label").contains("Searched name: Buzz Aldrin");

        // Check that there are two results
        cy.get('[data-cy="employee-card"]')
            .should("have.length", 2)
            .contains("Buzz Aldrin");

        // Selects Sales as a department filter by dropdown
        cy.get("[data-cy=expand-department-filters]").click();
        cy.get('[data-cy="Sales checkbox"]').click();
        cy.get(".MuiChip-label").contains("Sales");
        cy.get(".MuiChip-label").should("have.length", 2);

        // Check that there is now only one result
        cy.get('[data-cy="employee-card"]')
            .should("have.length", 1)
            .contains("Buzz Aldrin");
    });
});
