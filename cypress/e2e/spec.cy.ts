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
      cy.get('[data-test="ingredient"]').first().click();
      cy.get('[data-test="modal"]').should('exist').and('be.visible');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get('[data-test="ingredient"]').first().click();
      cy.get('[data-test="modal"]').should('exist');
      cy.get('[data-test="close-button"]').click();
      cy.get('[data-test="modal"]').should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get('[data-test="ingredient"]').first().click();
      cy.get('[data-test="modal"]').should('exist');
      cy.get('[data-test="modal-overlay"]').click({ force: true });
      cy.get('[data-test="modal"]').should('not.exist');
    });
  });

  describe('Оформление заказа', () => {
    it('Оформление заказа, проверка номера и закрытие модалки', () => {
      cy.wait('@getUser');
      cy.wait('@getIngredients');

      cy.contains('[data-test="ingredient"]', 'булка').within(() => {
        cy.get('button').contains('Добавить').click();
      });
      cy.contains('[data-test="ingredient"]', 'котлета').within(() => {
        cy.get('button').contains('Добавить').click();
      });
      cy.contains('[data-test="ingredient"]', 'Соус').within(() => {
        cy.get('button').contains('Добавить').click();
      });

      cy.contains('Оформить заказ').click();

      cy.get('[data-test="modal"]').should('exist');
      cy.get('[data-test="order-number"]').should('have.text', '12345');

      cy.get('[data-test="close-button"]').click();
      cy.get('[data-test="modal"]').should('not.exist');

      cy.get('[data-test="bun"]').should('not.exist');
      cy.get('[data-test="ingredient-list"]')
        .find('li')
        .should('have.length', 0);
    });
  });
});
