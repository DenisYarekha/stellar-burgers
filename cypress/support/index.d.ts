/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    clickIngredient(name: string): Chainable<Element>;
    closeModal(): Chainable<Element>;
    addIngredient(name: string): Chainable<Element>;
  }
}
