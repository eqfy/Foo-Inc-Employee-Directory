/// <reference types="cypress" />

describe("Org chart", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    const hierachy = {
        10001: {
            10001: [10002, 10101],
        },
        20004: {
            20006: [20002, 20003, { 20004: [20104] }, 20005, 20106],
        },
        20104: {
            20004: [20104],
        },
    };

    // check whether worker is valid, and optionally check for skills to search transition
    const checkValidWorker = (workerId) => {
        if (!hierachy[workerId]) {
            cy.contains(
                "Sorry, there is no employee or contractor with matching id."
            ).should("exist");
        } else {
            const currentHierachy = hierachy[workerId];
            const firstLevelId = Object.keys(currentHierachy)[0];
            const firstLevelDiv = () => cy.get(`#${firstLevelId}`);
            firstLevelDiv().should("exist");

            const secondLevel = currentHierachy[firstLevelId];
            for (const peer of secondLevel) {
                if (typeof peer === "number") {
                    // no subordinate
                    firstLevelDiv().next().find(`#${peer}`).should("exist");
                } else {
                    // have subordinates
                    const centerId = Object.keys(peer)[0];
                    const centerDiv = () =>
                        firstLevelDiv().next().find(`#${centerId}`);

                    centerDiv().should("exist");

                    const thirdLevelIds = peer[centerId];
                    for (const subordinateId of thirdLevelIds) {
                        centerDiv()
                            .next()
                            .find(`#${subordinateId}`)
                            .should("exist");
                    }
                }
            }
        }
    };

    it("valid worker from url", () => {
        // no supervisor
        cy.visit(`${baseUrl}/orgchart/10001`);

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        checkValidWorker(10001);

        // normal worker
        cy.visit(`${baseUrl}/orgchart/20004`);

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        checkValidWorker(20004);

        // no subordinates
        cy.visit(`${baseUrl}/orgchart/20104`);

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        checkValidWorker(20104);
    });

    it("valid worker from other tabs", () => {
        // from search results (using COO as the tag)

        cy.visit(baseUrl);

        cy.get('[data-cy="loading-filters"]').should("exist");
        cy.get('[data-cy="loading-filters"]', { timeout }).should("not.exist");

        cy.get(".MuiChip-deleteIcon", { timeout }).click();

        cy.get(".filter-form")
            .contains("Filter by title")
            .get(`[data-cy="expand-title-filters"]`)
            .click();
        cy.get(".filter-list-button").contains("President and CEO").click();

        cy.get('[data-cy="loading-results"]').should("exist");
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

        cy.get('[data-cy="employee-card"]')
            .find('[data-cy="orgchart-icon-10001"]')
            .click();

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");
        
        checkValidWorker(10001);

        // from profile

        cy.visit(`${baseUrl}/profile/20104`);

        cy.get('[data-cy="loading-profile"]').should("not.exist");

        cy.contains("Organization Chart").click();

        cy.get('[data-cy="loading-orgchart"]').should("not.exist");

        checkValidWorker(20104);
    });

    it("org chart navigation", () => {
        cy.visit(`${baseUrl}/orgchart/20004`);

        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        cy.get("#20104").click();

        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        checkValidWorker(20104);
    });

    it("invalid worker", () => {
        cy.visit(`${baseUrl}/orgchart/100030`);

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        checkValidWorker(100030);
    });
});
