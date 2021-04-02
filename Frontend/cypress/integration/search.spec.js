/// <reference types="cypress" />

describe('Get all filters', () => {
  const baseUrl = Cypress.env('baseUrl')
  const timeout = Cypress.env('timeoutInMs')

  it('gets all filters', () => {
    cy.visit(baseUrl)
    cy.get('[data-cy="loading-filters"]', { timeout }).should('not.exist')

    cy.get('[data-cy="expand-location-filters"]').click()
    cy.get('.filter-list-button').should('have.length', 4)
    cy.get('[data-cy="expand-location-filters"]').click()

    cy.get('[data-cy="expand-title-filters"]').click()
    cy.get('.filter-list-button').should('have.length.at.least', 14)
    cy.get('[data-cy="expand-title-filters"]').click()

    cy.get('[data-cy="expand-company-filters"]').click()
    cy.get('.filter-list-button').should('have.length', 3)
    cy.get('[data-cy="expand-company-filters"]').click()

    cy.get('[data-cy="expand-department-filters"]').click()
    cy.get('.filter-list-button').should('have.length', 9)
    cy.get('[data-cy="expand-department-filters"]').click()

    cy.get('[data-cy="expand-skill-filters"]').click()
    cy.get('.category').should('have.length', 4).each(($el) => {
      return cy.wrap($el).invoke('text').then((text) => {
        cy.wrap($el).click()
        cy.get('.filter-list-button').should('have.length', text === 'Agriculture' ? 5 : 3)
        cy.wrap($el).click()
      })
    })
  })
})

describe('Search and filter', () => {
  const baseUrl = Cypress.env('baseUrl')
  const timeout = Cypress.env('timeoutInMs')

  it('Filter by location and title', () => {
    cy.visit(baseUrl)

    cy.get('.MuiChip-deleteIcon', { timeout }).click()

    cy.get('[data-cy="location-input"]').type("Van")

    cy.contains('Vancouver').should('exist')
    cy.get('.filter-list-button').should('have.length', 1).click()
    cy.get('[data-cy="expand-location-filters"]').click()

    cy.get('[data-cy="title-input"]').type('Manager')
    cy.get('.filter-list-button').each(($el) => {
      cy.wrap($el).should('contain.text', 'Manager')
    })
    cy.get('[data-cy="Manager-Marketing checkbox"]').click()
    cy.get('[data-cy="loading-results"]', { timeout }).should('not.exist')
    cy.get('[data-cy="Manager-Sales checkbox"]').click()

    // Wait for search to complete
    cy.get('[data-cy="loading-results"]', { timeout })
    cy.get('[data-cy="loading-results"]', { timeout }).should('not.exist')

    cy.get('[data-cy="employee-card"]').should('have.length', 3)
    cy.contains('Saul Sampson').should('exist')
    cy.contains('Owen Jones').should('exist')
    cy.contains('Gregore Da Silva').should('exist')
  })

  it('Filter by skill', () => {
    cy.visit(baseUrl)

    cy.get('[data-cy="loading-filters"]', { timeout }).should('not.exist')
    cy.get('.MuiChip-deleteIcon').click()

    cy.get('[data-cy="skill-input"]').type("Acc")

    cy.get('.category').should('have.length', 1).should('contain.text', 'Accounting')
    cy.get('.filter-list-button').should('have.length', 3).each(($el) => cy.wrap($el).click())
    
    // Wait for search to complete
    cy.get('[data-cy="loading-results"]')
    cy.get('[data-cy="loading-results"]', { timeout }).should('not.exist')

    cy.get('[data-cy="employee-card"]').should('have.length', 1)
    cy.contains('Name Employee05').should('exist')

    cy.get('[data-cy="Transaction Processing checkbox"]').click()
    cy.get('[data-cy="Auditing checkbox"]').click()

    cy.get('[data-cy="skill-input"]').clear().type('Man')

    cy.get('[data-cy="Planning checkbox"]').click()
    cy.get('[data-cy="Performance Reviews checkbox"]').click()

    // Wait for search to complete
    cy.get('[data-cy="loading-results"]')
    cy.get('[data-cy="loading-results"]', { timeout }).should('not.exist')

    cy.get('[data-cy="employee-card"]').should('have.length', 1)
    cy.contains('Annie Ameras').should('exist')
  })
})
