import { expect, test, describe, jest } from '@jest/globals';
import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  selectConstructorItems,
  selectErrorText,
  selectIngredients,
  selectIsAuthenticated,
  selectIsInit,
  selectIsModalOpened,
  selectLoading,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectTodayOrders,
  selectTotalOrders,
  selectUser,
  selectUserOrders
} from '../slices';
import { mockStore } from '../mock';
import { TIngredient, TOrder, TConstructorItems, TUser } from '@utils-types';

let store: EnhancedStore<
  {
    stellarBurger: {
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
    };
  },
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{
        dispatch: ThunkDispatch<
          {
            stellarBurger: {
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
            };
          },
          undefined,
          UnknownAction
        >;
      }>,
      StoreEnhancer
    ]
  >
>;

beforeEach(() => {
  store = configureStore({
    reducer: {
      stellarBurger: stellarBurgerSlice
    },
    preloadedState: {
      stellarBurger: mockStore
    }
  });
});

describe('Тест селекторов', () => {
  test('Тест selectUser', () => {
    const user = selectUser(store.getState());
    expect(user).toEqual({
      name: 'TESTUSER1',
      email: 'TESTUSER1@mail.ru'
    });
  });

  test('Тест selectIsInit', () => {
    const isInit = selectIsInit(store.getState());
    expect(isInit).toBe(false);
  });

  test('Тест selectIsModalOpened', () => {
    const isModalOpened = selectIsModalOpened(store.getState());
    expect(isModalOpened).toBe(false);
  });

  test('Тест selectErrorText', () => {
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('test error text');
  });

  test('Тест selectIsAuthenticated', () => {
    const isAuthenticated = selectIsAuthenticated(store.getState());
    expect(isAuthenticated).toBe(true);
  });

  test('Тест selectLoading', () => {
    const loading = selectLoading(store.getState());
    expect(loading).toBe(false);
  });

  test('Тест selectOrderRequest', () => {
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toBe(false);
  });

  test('Тест selectTotalOrders', () => {
    const totalOrders = selectTotalOrders(store.getState());
    expect(totalOrders).toBe(100);
  });

  test('Тест selectTodayOrders', () => {
    const todayOrders = selectTodayOrders(store.getState());
    expect(todayOrders).toBe(10);
  });

  test('Тест selectIngredients', () => {
    const ingredients = selectIngredients(store.getState());
    expect(ingredients).toEqual(mockStore.ingredients);
  });

  test('Тест selectConstructorItems', () => {
    const constructorItems = selectConstructorItems(store.getState());
    expect(constructorItems).toEqual(mockStore.constructorItems);
  });

  test('Тест selectOrderModalData', () => {
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(mockStore.orderModalData);
  });

  test('Тест selectOrders', () => {
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(mockStore.orders);
  });

  test('Тест selectUserOrders', () => {
    const userOrders = selectUserOrders(store.getState());
    expect(userOrders).toEqual(mockStore.userOrders);
  });
});
