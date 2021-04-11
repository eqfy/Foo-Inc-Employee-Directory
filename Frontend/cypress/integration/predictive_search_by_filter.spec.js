/// <reference types="cypress" />

describe("Predictive search by filters", () => {
    const baseUrl = Cypress.env("baseUrl");
    const timeout = Cypress.env("timeoutInMs");

    it("non-skill filter", () => {
        cy.visit(baseUrl);

        cy.get('[data-cy="loading-filters"]').should("exist");
        cy.get('[data-cy="loading-filters"]', { timeout }).should("not.exist");

        // dependent on database knowledge
        const testGroups = [
            {
                type: "location",
                initialLength: 4,
                actions: [
                    { typeIn: "V", results: ["Vancouver", "Victoria"] },
                    { typeIn: "an", results: ["Vancouver"] },
                    { typeIn: "xxx", results: [] },
                ],
            },
            {
                type: "title",
                initialLength: 14,
                actions: [
                    {
                        typeIn: "CO",
                        results: [
                            "COO",
                            "Manager-HR/Accounting",
                            "President and CEO",
                            "Office Manager - Kelowna",
                            "Office Manager - Prince George",
                        ],
                    },
                    {
                        typeIn: "G",
                        results: [
                            "Manager-HR/Accounting",
                            "Office Manager - Prince George",
                        ],
                    },
                    {
                        typeIn: "E",
                        results: ["Office Manager - Prince George"],
                    },
                    { typeIn: "A", results: [] },
                ],
            },
            {
                type: "company",
                initialLength: 3,
                actions: [
                    {
                        typeIn: "aa",
                        results: ["Acme Harvesting Ltd.", "Acme Planting Ltd."],
                    },
                    { typeIn: "E", results: ["Acme Harvesting Ltd."] },
                    { typeIn: "A", results: [] },
                ],
            },
            {
                type: "department",
                initialLength: 9,
                actions: [
                    {
                        typeIn: "at",
                        results: [
                            "Administration",
                            "Operations",
                            "Marketing",
                            "Marketing & Sales",
                            "Accounting",
                        ],
                    },
                    { typeIn: "o", results: ["Administration", "Operations"] },
                    { typeIn: "S", results: ["Operations"] },
                    { typeIn: "d", results: [] },
                ],
            },
        ];

        for (const { type, initialLength, actions } of testGroups) {
            cy.get(`[data-cy="expand-${type}-filters"]`).click();
            cy.get(".filter-list-button").should("have.length", initialLength);
            cy.get(`[data-cy="expand-${type}-filters"]`).click();

            for (const action of actions) {
                cy.get(`[data-cy="${type}-input"]`).type(action.typeIn);

                for (const result of action.results) {
                    cy.get(".filter-list-button")
                        .contains(result)
                        .should("exist");
                }

                cy.get(".filter-list-button").should(
                    "have.length",
                    action.results.length
                );
            }

            // clear would auto-hide
            cy.get(`[data-cy="${type}-input"]`).find("input").clear();
            cy.get(".filter-list-button").should("not.exist");
        }
    });

    it("skill filter", () => {
        cy.visit(baseUrl);

        cy.get('[data-cy="loading-filters"]').should("exist");
        cy.get('[data-cy="loading-filters"]', { timeout }).should("not.exist");

        const skillArea = cy.get(".filter-form").contains("Filter by skill");

        // dependent on database knowledge
        const getCategoryTitle = (category) => {
            return skillArea.get(`[data-cy="category-title-${category}"]`);
        };

        const getCategoryCheckboxes = (category) => {
            return skillArea.get(`[data-cy="category-checkboxes-${category}"]`);
        };

        const checkCategoryHasSkills = (cyCategory, array) => {
            if (array.length === 0) {
                cyCategory.should("not.exist");
            } else {
                cyCategory.should("have.length", array.length);
                for (const text of array) {
                    cyCategory.should("contain", text);
                }
            }
        };

        // initial check
        skillArea.get(`[data-cy="expand-skill-filters"]`).click();
        skillArea.get(".category").should("have.length", 4);

        getCategoryCheckboxes("Accounting").should("not.exist");
        getCategoryTitle("Accounting").click();
        checkCategoryHasSkills(
            getCategoryCheckboxes("Accounting").find(".filter-list-button"),
            ["Auditing", "Reconciling", "Transaction Processing"]
        );

        getCategoryCheckboxes("Agriculture").should("not.exist");
        getCategoryTitle("Agriculture").click();
        checkCategoryHasSkills(
            getCategoryCheckboxes("Agriculture").find(".filter-list-button"),
            [
                "Fertilizing",
                "Harvesting",
                "Irrigating",
                "Planting",
                "Soil Preparation",
            ]
        );

        getCategoryCheckboxes("Management").should("not.exist");
        getCategoryTitle("Management").click();
        checkCategoryHasSkills(
            getCategoryCheckboxes("Management").find(".filter-list-button"),
            ["Budgeting", "Performance Reviews", "Planning"]
        );

        getCategoryCheckboxes("Marketing & Sales").should("not.exist");
        getCategoryTitle("Marketing & Sales").click();
        checkCategoryHasSkills(
            getCategoryCheckboxes("Marketing & Sales").find(
                ".filter-list-button"
            ),
            [
                "Customer Service",
                "Marketing Strategies",
                "Preparing Marketing Materials",
            ]
        );

        // on click all hidden
        skillArea.get(`[data-cy="expand-skill-filters"]`).click();
        skillArea.get(".category").should("not.exist");
        getCategoryCheckboxes("Accounting").should("not.exist");
        getCategoryCheckboxes("Agriculture").should("not.exist");
        getCategoryCheckboxes("Management").should("not.exist");
        getCategoryCheckboxes("Marketing & Sales").should("not.exist");

        const actions = [
            {
                typeIn: "ac",
                results: {
                    Accounting: [
                        "Auditing",
                        "Reconciling",
                        "Transaction Processing",
                    ],
                    Agriculture: [
                        "Fertilizing",
                        "Harvesting",
                        "Irrigating",
                        "Planting",
                        "Soil Preparation",
                    ],
                    Management: ["Performance Reviews"],
                    "Marketing & Sales": [],
                },
            },
            {
                typeIn: "c",
                results: {
                    Accounting: [
                        "Auditing",
                        "Reconciling",
                        "Transaction Processing",
                    ],
                    Agriculture: [],
                    Management: [],
                    "Marketing & Sales": [],
                },
            },
            {
                typeIn: "c",
                results: {
                    Accounting: [],
                    Agriculture: [],
                    Management: [],
                    "Marketing & Sales": [],
                },
            },
            {
                typeIn: "{backspace}{backspace}{backspace}",
                results: {
                    Accounting: [
                        "Auditing",
                        "Reconciling",
                        "Transaction Processing",
                    ],
                    Agriculture: [
                        "Fertilizing",
                        "Harvesting",
                        "Irrigating",
                        "Planting",
                        "Soil Preparation",
                    ],
                    Management: [
                        "Budgeting",
                        "Performance Reviews",
                        "Planning",
                    ],
                    "Marketing & Sales": [
                        "Customer Service",
                        "Marketing Strategies",
                        "Preparing Marketing Materials",
                    ],
                },
            },
            {
                typeIn: "{backspace}{backspace}{backspace}",
                results: {
                    Accounting: [],
                    Agriculture: [],
                    Management: [],
                    "Marketing & Sales": [],
                },
            },
        ];

        const categories = [
            "Accounting",
            "Agriculture",
            "Management",
            "Marketing & Sales",
        ];

        for (const { typeIn, results } of actions) {
            cy.get(`[data-cy="skill-input"]`).type(typeIn);
            for (const category of categories) {
                if (results[category].length === 0) {
                    getCategoryTitle(category).should("not.exist");
                    getCategoryCheckboxes(category).should("not.exist");
                } else {
                    getCategoryTitle(category).should("exist");
                    checkCategoryHasSkills(
                        getCategoryCheckboxes(category).find(
                            ".filter-list-button"
                        ),
                        results[category]
                    );
                }
            }
        }
    });
});
