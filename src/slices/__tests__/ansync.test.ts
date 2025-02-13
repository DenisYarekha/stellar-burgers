import { expect, test, describe, jest } from '@jest/globals';
import stellarBurgerSlice, {
  fetchFeed,
  fetchIngredients,
  fetchLoginUser,
  fetchLogout,
  fetchNewOrder,
  fetchRegisterUser,
  fetchUpdateUser,
  fetchUserOrders,
  getUserThunk,
  initialState
} from '../slices';
import { TIngredient, TOrder, TConstructorItems, TUser } from '@utils-types';

describe('Тестирование асинхронных действий', () => {
  let state:
    | {
        ingredients: TIngredient[];
        loading: boolean;
        isModalOpened: boolean;
        errorText: string;
        isInit: boolean;
        orders: TOrder[];
        userOrders: TOrder[] | null;
        orderModalData: TOrder | null;
        orderRequest: boolean;
        totalOrders: number;
        ordersToday: number;
        isAuthenticated: boolean;
        constructorItems: TConstructorItems;
        user: TUser;
      }
    | undefined;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('Тестирование getUserThunk', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(state, getUserThunk.pending(''));
      expect(newState.loading).toBe(true);
    });

    test('Должен обновить данные пользователя при fulfilled', () => {
      const mockResponse = {
        success: true,
        user: { name: 'user', email: 'user@mail.ru' }
      };
      const newState = stellarBurgerSlice(
        state,
        getUserThunk.fulfilled(mockResponse, '')
      );
      expect(newState.user).toEqual(mockResponse.user);
      expect(newState.isAuthenticated).toBe(true);
    });

    test('Должен сбросить данные пользователя при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        getUserThunk.rejected(mockError, '')
      );
      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.user).toEqual({ name: '', email: '' });
    });
  });

  describe('Тестирование fetchIngredients', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(state, fetchIngredients.pending(''));
      expect(newState.loading).toBe(true);
    });

    test('Должен обновить список ингредиентов при fulfilled', () => {
      const mockResponse = [
        {
          _id: '643d69a5c3f7b9001cfa093c',
          name: 'Краторная булка N-200i',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        }
      ];
      const newState = stellarBurgerSlice(
        state,
        fetchIngredients.fulfilled(mockResponse, '')
      );
      expect(newState.loading).toBe(false);
      expect(newState.ingredients).toEqual(mockResponse);
    });

    test('Должен сбросить loading при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchIngredients.rejected(mockError, '')
      );
      expect(newState.loading).toBe(false);
    });
  });

  describe('Тестирование fetchNewOrder', () => {
    test('Должен установить orderRequest в true при pending', () => {
      const mockOrder = ['testid1', 'testid2', 'testid3'];
      const newState = stellarBurgerSlice(
        state,
        fetchNewOrder.pending('', mockOrder)
      );
      expect(newState.orderRequest).toBe(true);
    });

    test('Должен сбросить orderRequest и обновить orderModalData при fulfilled', () => {
      const mockResponse = {
        success: true,
        order: {
          _id: '01',
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'],
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2025-02-13T00:00:00.000Z',
          updatedAt: '2025-02-13T00:00:00.000Z',
          number: 40680
        },
        name: 'testname'
      };
      const newState = stellarBurgerSlice(
        state,
        fetchNewOrder.fulfilled(mockResponse, '', [''])
      );
      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toEqual(mockResponse.order);
    });

    test('Должен сбросить orderRequest при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchNewOrder.rejected(mockError, '', [''])
      );
      expect(newState.orderRequest).toBe(false);
    });
  });

  describe('Тестирование fetchLoginUser', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(
        state,
        fetchLoginUser.pending('', {
          email: 'TESTUSER1@mail.ru',
          password: 'qwe123'
        })
      );
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading и установить ошибку при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchLoginUser.rejected(mockError, '', {
          email: 'TESTUSER1@mail.ru',
          password: 'qwe123'
        })
      );
      expect(newState.loading).toBe(false);
      expect(newState.errorText).toBe('error');
    });

    test('Должен обновить состояние пользователя и установить isAuthenticated в true при fulfilled', () => {
      const mockResponse = {
        success: true,
        refreshToken: 'testtoken',
        accessToken: 'testaccess',
        user: { name: 'testuser', email: 'testuser@mail.ru' }
      };
      const newState = stellarBurgerSlice(
        state,
        fetchLoginUser.fulfilled(mockResponse, '', {
          email: 'testuser@mail.ru',
          password: 'testuser'
        })
      );
      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.user).toEqual(mockResponse.user);
    });
  });

  describe('Тестирование fetchRegisterUser', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(
        state,
        fetchRegisterUser.pending('', {
          name: 'TESTUSER1',
          email: 'TESTUSER1@mail.ru',
          password: 'qwe123'
        })
      );
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading и установить ошибку при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchRegisterUser.rejected(mockError, '', {
          name: 'TESTUSER1',
          email: 'TESTUSER1@mail.ru',
          password: 'qwe123'
        })
      );
      expect(newState.loading).toBe(false);
      expect(newState.errorText).toBe('error');
    });

    test('Должен обновить состояние пользователя и установить isAuthenticated в true при fulfilled', () => {
      const mockResponse = {
        success: true,
        refreshToken: 'testtoken',
        accessToken: 'testaccess',
        user: { name: 'TESTUSER1', email: 'TESTUSER1@mail.ru' }
      };
      const newState = stellarBurgerSlice(
        state,
        fetchRegisterUser.fulfilled(mockResponse, '', {
          name: 'TESTUSER1',
          email: 'TESTUSER1@mail.ru',
          password: 'qwe123'
        })
      );
      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.user).toEqual(mockResponse.user);
    });
  });

  describe('Тестирование fetchFeed', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(state, fetchFeed.pending(''));
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchFeed.rejected(mockError, '')
      );
      expect(newState.loading).toBe(false);
    });

    test('Должен обновить orders, totalOrders и ordersToday при fulfilled', () => {
      const mockResponse = {
        success: true,
        total: 100,
        totalToday: 10,
        orders: [
          {
            _id: '001',
            ingredients: [
              '643d69a5c3f7b9001cfa093d',
              '643d69a5c3f7b9001cfa093e'
            ],
            status: 'done',
            name: 'Тестовый заказ',
            createdAt: '2025-02-13T00:00:00.000Z',
            updatedAt: '2025-02-13T00:00:00.000Z',
            number: 10000
          }
        ]
      };
      const newState = stellarBurgerSlice(
        state,
        fetchFeed.fulfilled(mockResponse, '')
      );
      expect(newState.loading).toBe(false);
      expect(newState.orders).toEqual(mockResponse.orders);
      expect(newState.totalOrders).toBe(mockResponse.total);
      expect(newState.ordersToday).toBe(mockResponse.totalToday);
    });
  });

  describe('Тестирование fetchUserOrders', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(state, fetchUserOrders.pending(''));
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchUserOrders.rejected(mockError, '')
      );
      expect(newState.loading).toBe(false);
    });

    test('Должен обновить userOrders при fulfilled', () => {
      const mockResponse = [
        {
          _id: '01',
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'],
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '2025-02-13T00:00:00.000Z',
          updatedAt: '2025-02-13T00:00:00.000Z',
          number: 10000
        }
      ];
      const newState = stellarBurgerSlice(
        state,
        fetchUserOrders.fulfilled(mockResponse, '')
      );
      expect(newState.loading).toBe(false);
      expect(newState.userOrders).toEqual(mockResponse);
    });
  });

  describe('Тестирование fetchLogout', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(state, fetchLogout.pending(''));
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchLogout.rejected(mockError, '')
      );
      expect(newState.loading).toBe(false);
    });

    test('Должен сбросить данные пользователя и установить isAuthenticated в false при fulfilled', () => {
      const mockResponse = { success: true };
      const newState = stellarBurgerSlice(
        state,
        fetchLogout.fulfilled(mockResponse, '')
      );
      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual({ name: '', email: '' });
      expect(newState.isAuthenticated).toBe(false);
    });
  });

  describe('Тестирование fetchUpdateUser', () => {
    test('Должен установить loading в true при pending', () => {
      const newState = stellarBurgerSlice(
        state,
        fetchUpdateUser.pending('', { name: 'test' })
      );
      expect(newState.loading).toBe(true);
    });

    test('Должен сбросить loading при rejected', () => {
      const mockError = { name: 'test', message: 'error' };
      const newState = stellarBurgerSlice(
        state,
        fetchUpdateUser.rejected(mockError, '', { name: 'test' })
      );
      expect(newState.loading).toBe(false);
    });

    test('Должен обновить данные пользователя при fulfilled', () => {
      const mockUser = { name: 'testuser', email: 'changedEmail@mail.ru' };
      const mockResponse = {
        success: true,
        user: mockUser
      };
      const newState = stellarBurgerSlice(
        state,
        fetchUpdateUser.fulfilled(mockResponse, '', mockUser)
      );
      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual(mockUser);
    });
  });
});
