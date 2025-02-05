import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TIngredient,
  TOrder,
  TUser,
  TConstructorItems,
  TConstructorIngredient
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialState = {
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

export const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  isModalOpened: false,
  errorText: '',
  isInit: false,
  orders: [],
  userOrders: null,
  orderModalData: null,
  orderRequest: false,
  totalOrders: 0,
  ordersToday: 0,
  isAuthenticated: false,
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  user: {
    name: '',
    email: ''
  }
};

const stellarBurgerslice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuidv4()
          }
        };
      }
    },
    deleteIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    },
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    removeOrders(state) {
      state.orders.length = 0;
    },
    removeUserOrders(state) {
      state.userOrders = null;
    },

    init(state) {
      state.isInit = true;
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrders: (state) => state.orders,
    selectUserOrders: (state) => state.userOrders,
    selectIsInit: (state) => state.isInit,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectErrorText: (state) => state.errorText,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectConstructorItems: (state) => state.constructorItems,
    selectUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      });
  }
});

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error) {
      throw new Error('Не удалось загрузить ингредиенты');
    }
  }
);

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  async (data: string[]) => {
    try {
      const order = await orderBurgerApi(data);
      return order;
    } catch (error) {
      throw new Error('Не удалось создать заказ');
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        throw new Error('Ошибка авторизации');
      }
      return response;
    } catch (error) {
      throw new Error('Ошибка авторизации');
    }
  }
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue(response || 'Ошибка регистрации');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getUserThunk = createAsyncThunk('user/get', async () => {
  try {
    const user = await getUserApi();
    return user;
  } catch (error) {
    throw new Error('Не удалось получить данные пользователя');
  }
});

export const fetchFeed = createAsyncThunk('user/feed', async () => {
  try {
    const feed = await getFeedsApi();
    return feed;
  } catch (error) {
    throw new Error('Не удалось загрузить ленту заказов');
  }
});

export const fetchUserOrders = createAsyncThunk('user/orders', async () => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error) {
    throw new Error('Не удалось загрузить заказы пользователя');
  }
});

export const fetchLogout = createAsyncThunk('user/logout', async () => {
  try {
    const response = await logoutApi();
    return response;
  } catch (error) {
    throw new Error('Не удалось выйти из системы');
  }
});

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    try {
      const response = await updateUserApi(user);
      return response;
    } catch (error) {
      throw new Error('Не удалось обновить данные пользователя');
    }
  }
);

export const {
  selectLoading,
  selectIngredients,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectUserOrders,
  selectIsInit,
  selectIsModalOpened,
  selectErrorText,
  selectTotalOrders,
  selectTodayOrders,
  selectIsAuthenticated,
  selectConstructorItems,
  selectUser
} = stellarBurgerslice.selectors;

export const {
  addIngredient,
  removeOrders,
  removeUserOrders,
  init,
  openModal,
  closeModal,
  deleteIngredient,
  setErrorText,
  removeErrorText,
  moveIngredientUp,
  moveIngredientDown,
  closeOrderRequest
} = stellarBurgerslice.actions;

export default stellarBurgerslice.reducer;
