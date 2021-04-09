describe("Filter coordination", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    beforeEach(() => {
        // Reload the page to clear all redux states
        cy.reload();
    });

    it("filter bar and filter dropdown are coordinated", () => {
        // Visit search page and clear all filters
        cy.visit(baseUrl);
        cy.get(".MuiChip-deleteIcon", { timeout }).click();

        // Selects a Manager-Sales as a title filter by typing
        cy.get('[data-cy="title-input"]').type("sales");
        cy.contains("Manager-Sales").should("exist");
        cy.get(".filter-list-button").should("have.length", 2);
        cy.get('[data-cy="Manager-Sales checkbox"]').click();
        cy.get(".MuiChip-label").contains("Manager-Sales");
        cy.get("[data-cy=clear-filters]").should("not.exist");

        // Selects Sales as a department filter by dropdown
        cy.get("[data-cy=expand-department-filters]").click();
        cy.get('[data-cy="Sales checkbox"]').click();
        cy.get(".MuiChip-label").contains("Sales");
        cy.get(".MuiChip-label").should("have.length", 2);

        // Clears all filters
        cy.get("[data-cy=clear-filters]").click();
        cy.get(".MuiChip-label").should("not.exist");
    });

    describe("Filter bar and profile page coordination", () => {
        it("Search with these skills button applies all of worker's skill as filters", () => {
            // Visit the search page and wait for current user to be loaded
            cy.visit(baseUrl);
            cy.get(".MuiChip-deleteIcon", { timeout });
            cy.get(".MuiChip-label").contains("Victoria").should("exist");

            // Go to profile and click search with these skills
            cy.contains("Profile View").click();
            cy.contains("Search with these skills").click();
            cy.url().should("contain", "search");

            cy.get(".MuiChip-label").should("have.length", 3);
            cy.get(".MuiChip-label").contains("Victoria").should("not.exist");
        });

        it("clicking on a skill applies it as a filter", () => {
            // Visit the search page and wait for current user to be loaded
            cy.visit(baseUrl);
            cy.get(".MuiChip-deleteIcon", { timeout });
            cy.get(".MuiChip-label").contains("Victoria").should("exist");

            // Go to profile and click search with these skills
            cy.contains("Profile View").click();
            cy.get(".MuiChip-label").contains("Customer Service").click();
            cy.url().should("contain", "search");

            cy.get(".MuiChip-label").should("have.length", 1);
            cy.get(".MuiChip-label")
                .contains("Customer Service")
                .should("exist");
            cy.get(".MuiChip-label").contains("Victoria").should("not.exist");
        });
    });
});
