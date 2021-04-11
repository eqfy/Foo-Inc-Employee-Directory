/// <reference types="cypress" />

describe("Predictive search by filters", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    const coreInfoKeys = [
        "cell",
        "phone",
        "employeementType",
        "yearsPriorExperience",
        "division",
        "companyName",
        "officeLocation",
        "physicalLocation",
        "hireDate",
    ];
    const validWorkers = {
        10003: {
            name: "Saul Sampson",
            title: "Manager-Marketing",
            email: "sampsons@acme.ca",
            cell: "604-123-7654",
            phone: "604-123-4567",
            employeementType: "Salary",
            yearsPriorExperience: "0.0",
            division: "Marketing",
            companyName: "Acme Seeds Inc.",
            officeLocation: "Corporate, Vancouver",
            physicalLocation: "Vancouver",
            hireDate: "10/1/1999",
            skills: {},
        },
        60105: {
            name: "Allison Martin",
            title: "Associate",
            email: "martin101@acme.ca",
            cell: "778-565-1101",
            phone: "604-132-1101",
            employeementType: "Salary",
            yearsPriorExperience: "2.0",
            division: "Accounting",
            companyName: "Acme Seeds Inc.",
            officeLocation: "Corporate, Vancouver",
            physicalLocation: "Victoria",
            hireDate: "1/1/2020",
            skills: {
                Agriculture: ["Soil Preparation"],
            },
        },
        60815: {
            name: "Amanda Hamiton",
            title: "Associate",
            email: "hamiton811@acme.ca",
            cell: "778-565-1811",
            phone: "604-132-1811",
            employeementType: "Salary",
            yearsPriorExperience: "2.0",
            division: "Marketing & Sales",
            companyName: "Acme Harvesting Ltd.",
            officeLocation: "Kelowna",
            physicalLocation: "Victoria",
            hireDate: "5/6/1998",
            skills: {},
        },
        10005: {
            name: "Connie Conner",
            title: "Manager-HR/Accounting",
            email: "connerc@acme.ca",
            cell: "604-123-7654",
            phone: "604-123-4567",
            employeementType: "Salary",
            yearsPriorExperience: "3.2",
            division: "Human Resources",
            companyName: "Acme Seeds Inc.",
            officeLocation: "Corporate, Vancouver",
            physicalLocation: "Vancouver",
            hireDate: "5/28/1997",
            skills: {
                Accounting: [
                    "Reconciling",
                    "Transaction Processing",
                    "Auditing",
                ],
                Management: ["Planning", "Performance Reviews", "Budgeting"],
                Agriculture: ["Harvesting", "Fertilizing", "Soil Preparation"],
                "Marketing & Sales": [
                    "Preparing Marketing Materials",
                    "Customer Service",
                ],
            },
        },
    };

    // check whether worker is valid, and optionally check for skills to search transition
    const checkValidWorker = (workerId, checkForSkills = false) => {
        if (!validWorkers[workerId]) {
            cy.contains(
                "Sorry, there is no employee or contractor with matching id."
            ).should("exist");
        } else {
            // check card
            const card = () => cy.get('[data-cy="employee-card"]');
            const expectedResult = validWorkers[workerId];
            card()
                .find(`.card-name-${workerId}`)
                .contains(expectedResult.name)
                .should("exist");
            card()
                .find(`.card-title-${workerId}`)
                .contains(expectedResult.title)
                .should("exist");
            card()
                .find(`.card-email-${workerId}`)
                .contains(expectedResult.email)
                .should("exist");

            // check core info
            const coreInfo = () =>
                cy.get('[data-cy="core-info-content"]').find("span");
            for (let counter = 0; counter < coreInfoKeys.length; counter++) {
                coreInfo()
                    .eq(counter)
                    .contains(expectedResult[coreInfoKeys[counter]])
                    .should("exist");
            }

            // check skills
            const skills = () => cy.get('[data-cy="profile-skill-content"]');
            const skillRow = (skillCategory) =>
                skills().find(
                    `[data-cy="profile-skill-group-${skillCategory}"]`
                );
            if (Object.keys(expectedResult.skills).length === 0) {
                skills().contains("No skills").should("exist");
            } else {
                for (const skillCategory in expectedResult.skills) {
                    skillRow(skillCategory)
                        .find("td")
                        .contains(skillCategory)
                        .should("exist");
                    for (const skill of expectedResult.skills[skillCategory]) {
                        if (!checkForSkills) {
                            skillRow(skillCategory)
                                .find(`[data-cy="profile-skill-chip-${skill}"]`)
                                .should("exist");
                        } else {
                            // click on each chip and make sure search page has the corresponding chip in filter area
                            skillRow(skillCategory)
                                .find(`[data-cy="profile-skill-chip-${skill}"]`)
                                .click();

                            cy.get(".MuiChip-label").should("have.length", 1);
                            cy.get(".MuiChip-label")
                                .contains(`${skill} (${skillCategory})`)
                                .should("exist");
                            cy.contains("Profile View").click();
                        }
                    }
                }

                // check "search with these skills"
                if (checkForSkills) {
                    cy.contains("Search with these skills").click();
                    let totalSkillCount = 0;
                    for (const skillCategory in expectedResult.skills) {
                        for (const skill of expectedResult.skills[
                            skillCategory
                        ]) {
                            cy.get(".MuiChip-label")
                                .contains(`${skill} (${skillCategory})`)
                                .should("exist");
                            totalSkillCount++;
                        }
                    }
                    cy.get(".MuiChip-label").should(
                        "have.length",
                        totalSkillCount
                    );
                }
            }
        }
    };

    it("valid workers from url", () => {
        cy.visit(`${baseUrl}/profile/10003`);

        cy.get('[data-cy="loading-profile"]').should("exist");
        cy.get('[data-cy="loading-profile"]', { timeout }).should("not.exist");

        checkValidWorker(10003, true);

        cy.visit(`${baseUrl}/profile/10005`);

        cy.get('[data-cy="loading-profile"]').should("exist");
        cy.get('[data-cy="loading-profile"]', { timeout }).should("not.exist");

        checkValidWorker(10005, true);
    });

    it("invalid worker from url", () => {
        cy.visit(`${baseUrl}/profile/123456`);

        cy.get('[data-cy="loading-profile"]').should("exist");
        cy.get('[data-cy="loading-profile"]', { timeout }).should("not.exist");

        checkValidWorker(123456);
    });

    it("valid worker from profile + previous / next", () => {
        cy.visit(baseUrl);

        cy.get('[data-cy="loading-results"]').should("exist");
        cy.get('[data-cy="loading-results"]', { timeout }).should("not.exist");

        cy.contains("Allison Martin").click();

        cy.get('[data-cy="loading-profile"]').should("not.exist");
        checkValidWorker(60105);

        cy.contains("Next").click();

        cy.get('[data-cy="loading-profile"]').should("not.exist");
        checkValidWorker(60815);

        cy.contains("Previous").click();

        cy.get('[data-cy="loading-profile"]').should("not.exist");
        checkValidWorker(60105);
    });

    it("valid worker from org chart", () => {
        cy.visit(`${baseUrl}/orgchart/10003`);

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        cy.contains("Profile View").click();

        cy.get('[data-cy="loading-profile"]').should("not.exist");
        checkValidWorker(10003);

        cy.contains("Organization Chart").click();

        cy.contains("Connie Conner").click();

        cy.get('[data-cy="loading-orgchart"]').should("exist");
        cy.get('[data-cy="loading-orgchart"]', { timeout }).should("not.exist");

        cy.contains("Profile View").click();

        checkValidWorker(10005);
    });
});
