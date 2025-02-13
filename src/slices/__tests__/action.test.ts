import { expect, test, describe } from '@jest/globals';
import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  addIngredient,
  closeModal,
  closeOrderRequest,
  deleteIngredient,
  init,
  moveIngredientDown,
  moveIngredientUp,
  openModal,
  removeErrorText,
  removeOrders,
  removeUserOrders,
  selectConstructorItems,
  selectErrorText,
  selectIsInit,
  selectIsModalOpened,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectUserOrders,
  setErrorText
} from '../slices';
import { mockStore, mockIngredient, mockBun } from '../mock';
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

describe('Тестирование actions', () => {
  test('Тест addIngredient', () => {
    store.dispatch(addIngredient(mockIngredient));
    store.dispatch(addIngredient(mockBun));

    const constructor = selectConstructorItems(store.getState());
    expect(constructor.ingredients.length).toEqual(4);
    expect(constructor.bun.name).toBe('Краторная булка N-200i');
  });

  test('Тест deleteIngredient', () => {
    const before = selectConstructorItems(store.getState()).ingredients.length;
    store.dispatch(deleteIngredient(mockIngredient));
    const after = selectConstructorItems(store.getState()).ingredients.length;
    expect(before).toBe(3);
    expect(after).toBe(2);
  });

  test('Тест init', () => {
    const beforeInit = selectIsInit(store.getState());
    store.dispatch(init());
    const afterInit = selectIsInit(store.getState());
    expect(beforeInit).toBe(false);
    expect(afterInit).toBe(true);
  });

  test('Тест openModal', () => {
    const beforeOpen = selectIsModalOpened(store.getState());
    store.dispatch(openModal());
    const afterOpen = selectIsModalOpened(store.getState());
    expect(beforeOpen).toBe(false);
    expect(afterOpen).toBe(true);
  });

  test('Тест closeModal', () => {
    store.dispatch(closeModal());
    const isOpen = selectIsModalOpened(store.getState());
    expect(isOpen).toBe(false);
  });

  test('Тест setErrorText', () => {
    store.dispatch(setErrorText('my test error'));
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('my test error');
  });

  test('Тест removeErrorText', () => {
    store.dispatch(setErrorText('Error here!'));
    store.dispatch(removeErrorText());
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('');
  });

  test('Тест closeOrderRequest', () => {
    const initialConstructorItems = selectConstructorItems(store.getState());
    store.dispatch(closeOrderRequest());

    const orderRequest = selectOrderRequest(store.getState());
    const orderModalData = selectOrderModalData(store.getState());
    const constructorItems = selectConstructorItems(store.getState());

    expect(orderRequest).toBe(false);
    expect(orderModalData).toBe(null);
    expect(constructorItems).toEqual(initialConstructorItems);
  });

  test('Тест removeOrders', () => {
    const initialOrders = selectOrders(store.getState()).length;
    store.dispatch(removeOrders());
    const orders = selectOrders(store.getState()).length;
    expect(initialOrders).toBe(2);
    expect(orders).toBe(0);
  });

  test('Тест removeUserOrders', () => {
    const initialOrders = selectUserOrders(store.getState())!.length;
    store.dispatch(removeUserOrders());
    const orders = selectUserOrders(store.getState());
    expect(initialOrders).toBe(2);
    expect(orders).toBe(null);
  });

  test('Тест moveIngredientUp', () => {
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const lastIngredient = ingredients[ingredients.length - 1];
    const secondLastIngredient = ingredients[ingredients.length - 2];

    store.dispatch(moveIngredientUp(lastIngredient));
    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[ingredients.length - 2]).toEqual(lastIngredient);
    expect(ingredients[ingredients.length - 1]).toEqual(secondLastIngredient);
  });

  test('Тест moveIngredientDown', () => {
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const firstIngredient = ingredients[0];
    const secondIngredient = ingredients[1];

    store.dispatch(moveIngredientDown(firstIngredient));
    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[1]).toEqual(firstIngredient);
    expect(ingredients[0]).toEqual(secondIngredient);
  });
});
