/// <reference types="cypress" />

import { parseFullName } from "parse-full-name";

describe("is sortable", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");
    beforeEach(() => {
        cy.reload();
        cy.visit(baseUrl);
        // Wait for search to complete
        cy.get('[data-cy="loading-results"]', { timeout });
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

        cy.get(".MuiChip-deleteIcon").click();

        cy.get('[data-cy="skill-input"]').type("Acc");

        cy.get(".category")
            .should("have.length", 1)
            .should("contain.text", "Accounting");
        cy.get(".filter-list-button")
            .should("have.length", 3)
            .each(($el) => cy.wrap($el).click());

        // Wait for search to complete
        cy.get('[data-cy="loading-results"]');
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");
    });

    it("for FirstName ASC", () => {
        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = names.sort();
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for FirstName DESC", () => {
        cy.contains("Ascending").click();

        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...names].sort((a, b) => {
                return a < b;
            });
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for LastName ASC", () => {
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="lastName"]').click();
        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...names].sort((a, b) => {
                const aLast = parseFullName(a).last;
                const bLast = parseFullName(b).last;
                return aLast > bLast;
            });
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for LastName DESC", () => {
        cy.contains("Ascending").click();
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="lastName"]').click();

        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...names].sort((a, b) => {
                const aLast = parseFullName(a).last;
                const bLast = parseFullName(b).last;
                return aLast < bLast;
            });
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for Title ASC", () => {
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="title"]').click();
        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const titles = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...titles].sort((a, b) => {
                return a > b;
            });
            cy.wrap(titles).should("deep.equal", sortedNames);
        });
    });

    it("for Title DESC", () => {
        cy.contains("Ascending").click();
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="title"]').click();
        return cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const titles = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...titles].sort((a, b) => {
                return a < b;
            });
            cy.wrap(titles).should("deep.equal", sortedNames);
        });
    });
});
