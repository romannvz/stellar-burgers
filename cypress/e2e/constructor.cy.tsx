describe('проверяем доступность приложения', () => {
  it('сервис доступен по адресу localhost:4000', () => {
    cy.visit('http://localhost:4000');
  });
});

describe('перехват запроса на эндпоинт "api/ingredients"', () => {
  it('заглушка запроса ингредиентов и заказов', () => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
  });
});

describe('работоспособность конструктора', () => {
  it('добавление ингредиентов из списка в конструктор', () => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get(`[data-cy=ingredient1]`).contains('Добавить').click();
    cy.get(`[data-cy=ingredient2]`).contains('Добавить').click();
    cy.get(`[data-cy=bunTopInConstructor]`).should('exist').contains('булка');
    cy.get(`[data-cy=bunBottomInConstructor]`)
      .should('exist')
      .contains('булка');
    cy.get(`[data-cy=mainsInConstructor]`).should('exist').contains('котлета');
  });
});

describe('работа модальных окон', () => {
  it('открытие модального окна ингредиента', () => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get(`[data-cy=ingredient1]`).click();
    cy.get(`[data-cy=modal]`).should('be.visible');
  });

  it('закрытие по клику на крестик', () => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get(`[data-cy=ingredient1]`).click();
    cy.get(`[data-cy=closeModal]`).click();
    cy.get(`[data-cy=modal]`).should('not.exist');
  });

  it('закрытие по нажатию эскейп', () => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get(`[data-cy=ingredient1]`).click();
    cy.get('body').type('{esc}');
    cy.get(`[data-cy=modal]`).should('not.exist');
  });
});

describe('создание заказа', () => {
  it('сценарий авторизации, выбора ингредиентов и оформление заказа', () => {
    cy.fetchs();
    // перехват запроса на эндпоинт 'api/login'
    cy.intercept('https://norma.nomoreparties.space/api/auth/login', (req) => {
      req.reply({ fixture: 'userData.json' });
    }).as('userStub');
    // перехват запроса на эндпоинт 'api/orders'
    cy.intercept('https://norma.nomoreparties.space/api/orders', (req) => {
      req.reply({ fixture: 'createOrder.json' });
    }).as('orderStub');
    // Подставляются моковые токены авторизации.
    cy.visit('http://localhost:4000/login');
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get('body').contains('Войти').click();
    cy.wait('@userStub');
    // Собирается бургер.
    cy.get(`[data-cy=ingredient1]`).contains('Добавить').click();
    cy.get(`[data-cy=ingredient2]`).contains('Добавить').click();
    cy.get(`[data-cy=ingredient3]`).contains('Добавить').click();
    // Вызывается клик по кнопке «Оформить заказ».
    cy.get(`[data-cy=orderButton]`).click();
    // Проверяется, что модальное окно открылось и номер заказа верный.
    cy.get(`[data-cy=modal]`).should('be.visible').contains('99999');
    // Закрывается модальное окно и проверяется успешность закрытия.
    cy.get('body').type('{esc}');
    cy.get(`[data-cy=modal]`).should('not.exist');
    // Проверяется, что конструктор пуст.
    cy.get(`[data-cy=bunTopInConstructor]`).contains('div', 'Выберите булки');
    cy.get(`[data-cy=mainsInConstructor]`).contains('div', 'Выберите начинку');
    cy.get(`[data-cy=bunBottomInConstructor]`).contains(
      'div',
      'Выберите булки'
    );
  });
});
