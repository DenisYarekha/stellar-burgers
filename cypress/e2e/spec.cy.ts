// Константы для селекторов
const selectors = {
  ingredient: '[data-test="ingredient"]',
  modal: '[data-test="modal"]',
  modalCloseButton: '[data-test="close-button"]',
  modalOverlay: '[data-test="modal-overlay"]',
  orderButton: 'Оформить заказ',
  orderNumber: '[data-test="order-number"]',
  ingredientList: '[data-test="ingredient-list"]',
  bun: '[data-test="bun"]'
};

describe('Тесты cypress', () => {
  beforeEach(() => {
    // Перехваты запросов на получение данных
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'mock-access-token');
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Модальные окна', () => {
    it('Открытие модального окна при клике на ингредиент', () => {
      cy.wait('@getIngredients');
      cy.clickIngredient('Соус Spicy-X');
      cy.get(selectors.modal).should('exist').and('be.visible');
      cy.get(selectors.modal).within(() => {
        cy.contains('Соус Spicy-X').should('exist');
      });
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.wait('@getIngredients');
      cy.clickIngredient('Краторная булка N-200i');
      cy.get(selectors.modal).should('exist');
      cy.closeModal();
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.wait('@getIngredients');
      cy.clickIngredient('Биокотлета из марсианской Магнолии');
      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modalOverlay).click({ force: true });
      cy.get(selectors.modal).should('not.exist');
    });
  });

  describe('Оформление заказа', () => {
    it('Оформление заказа, проверка номера и закрытие модалки', () => {
      cy.wait('@getUser');
      cy.wait('@getIngredients');

      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Биокотлета из марсианской Магнолии');
      cy.addIngredient('Соус Spicy-X');

      cy.get(selectors.bun).should('exist');
      cy.get(selectors.ingredientList).find('li').should('have.length', 2);

      cy.contains(selectors.orderButton).click();
      cy.get(selectors.modal).should('exist');
      cy.get(selectors.orderNumber).should('have.text', '12345');

      cy.closeModal();

      cy.get(selectors.bun).should('not.exist');
      cy.get(selectors.ingredientList).find('li').should('have.length', 0);
    });
  });
});
