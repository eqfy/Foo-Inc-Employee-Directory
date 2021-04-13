/* eslint-disable jest/valid-expect-in-promise */
/// <reference types="cypress" />

import { parseFullName } from "parse-full-name";

describe("Search page is sortable", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");
    beforeEach(() => {
        cy.reload();
        cy.visit(baseUrl);
        // Wait for search to complete
        cy.get('[data-cy="loading-results"]', { timeout });
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");
    });

    it("for FirstName ASC", () => {
        cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...names].sort((a, b) => {
                const aFirst = parseFullName(a).first;
                const bFirst = parseFullName(b).first;
                return aFirst > bFirst;
            });
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for FirstName DESC", () => {
        cy.contains("Ascending").click();

        cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const names = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedNames = [...names].sort((a, b) => {
                const aFirst = parseFullName(a).first;
                const bFirst = parseFullName(b).first;
                return aFirst < bFirst;
            });
            cy.wrap(names).should("deep.equal", sortedNames);
        });
    });

    it("for LastName ASC", () => {
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="lastName"]').click();
        cy.get('[data-cy="employee-card-name"]').then(($el) => {
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

        cy.get('[data-cy="employee-card-name"]').then(($el) => {
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
        cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const titles = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedTitles = [...titles].sort((a, b) => {
                return a > b;
            });
            cy.wrap(titles).should("deep.equal", sortedTitles);
        });
    });

    it("for Title DESC", () => {
        cy.contains("Ascending").click();
        cy.get(".MuiSelect-root").contains("First Name").click();
        cy.get('[data-value="title"]').click();
        cy.get('[data-cy="employee-card-name"]').then(($el) => {
            const titles = $el
                .map((_index, html) => Cypress.$(html).text())
                .get();
            const sortedTitles = [...titles].sort((a, b) => {
                return a < b;
            });
            cy.wrap(titles).should("deep.equal", sortedTitles);
        });
    });
});
