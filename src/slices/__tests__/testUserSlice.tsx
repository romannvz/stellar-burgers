import { expect, test, describe, jest } from '@jest/globals';
import {
  reducer,
  clearErrors,
  clearLastOrder,
  updateUserData,
  postOrder,
  getFeeds,
  getUserInfo,
  refreshTokenThunk,
  registerThunk,
  loginThunk,
  logoutThunk
} from '../userSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../../cypress/fixtures/userData.json';
import * as mockOrders from '../../../cypress/fixtures/orders.json';
import { access } from 'fs';

afterAll(() => {
  jest.restoreAllMocks();
});

// const localStorageMock = {
//   getItem: jest.fn(),
//   setItem: jest.fn(),
//   clear: jest.fn(),
//   length: 0,
//   key:jest.fn(),
//   removeItem:jest.fn()
// };
// global.localStorage = localStorageMock;

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (...args: string[]) => mockGetItem(...args),
    setItem: (...args: string[]) => mockSetItem(...args),
    removeItem: (...args: string[]) => mockRemoveItem(...args)
  }
});

const initialState = {
  accessToken: mock.accessToken,
  refreshToken: mock.refreshToken,
  user: mock.user,
  isLoading: false,
  isAuth: false,
  error: null,
  orders: [],
  sendingOrder: false,
  lastOrder: null
};

const userData = {
  email: mock.user.email,
  name: mock.user.name,
  password: 'password'
};

describe('тесты слайса юзера', () => {
  test('[#1.1] тест обновления юзердаты (fulfilled)', async () => {
    const expectedResult = {
      email: mock.user.email,
      name: mock.user.name
    };

    const spy = jest
      .spyOn(api, 'updateUserApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, user: { ...expectedResult } })
      );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(updateUserData(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  test('[#1.2] тест обновления юзердаты (rejected)', async () => {
    const expectedResult = {
      error: undefined,
      email: '',
      name: ''
    };

    const spy = jest
      .spyOn(api, 'updateUserApi')
      .mockImplementation(() =>
        Promise.reject({ success: true, user: { ...expectedResult } })
      );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(updateUserData(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  test('[#2.1] тест отправки заказа (fulfilled)', async () => {
    const expectedResult = {
      _id: 'myPersonalId',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      number: 32271
    };

    const spy = jest.spyOn(api, 'orderBurgerApi').mockImplementation(() =>
      Promise.resolve({
        success: true,
        name: 'New',
        order: { ...expectedResult }
      })
    );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(
      postOrder(['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'])
    );
    expect(store.getState().user.sendingOrder).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { lastOrder } = store.getState().user;

    expect(lastOrder).toEqual(expectedResult);
  });

  test('[#2.2] тест отправки заказа (rejected)', async () => {
    const order = {
      _id: 'myPersonalId',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      number: 32271
    };

    const spy = jest
      .spyOn(api, 'orderBurgerApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, name: 'New', order: { ...order } })
      );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(
      postOrder(['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'])
    );
    expect(store.getState().user.sendingOrder).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().user;

    expect(error).toEqual(null);
  });

  test('[#3.1] тест получения заказов (fulfilled)', async () => {
    const spy = jest
      .spyOn(api, 'getFeedsApi')
      .mockImplementation(() => Promise.resolve(mockOrders));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(getFeeds());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { orders } = store.getState().user;

    expect(orders).toEqual(mockOrders.orders);
  });

  test('[#3.2] тест получения заказов (rejected)', async () => {
    const spy = jest
      .spyOn(api, 'getFeedsApi')
      .mockImplementation(() => Promise.reject(mockOrders));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(getFeeds());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().user;

    expect(error).toEqual(undefined);
  });

  test('[#4.1] тест получения юзердаты (fulfilled)', async () => {
    const expectedResult = {
      email: mock.user.email,
      name: mock.user.name
    };

    const spy = jest
      .spyOn(api, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, user: { ...expectedResult } })
      );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(getUserInfo());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  test('[#4.2] тест получения юзердаты (rejected)', async () => {
    const expectedResult = {
      error: undefined,
      email: '',
      name: ''
    };

    const spy = jest
      .spyOn(api, 'getUserApi')
      .mockImplementation(() =>
        Promise.reject({ success: false, user: { ...expectedResult } })
      );

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(getUserInfo());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  test('[#5.1] тест обновления токена (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken
    };

    const spy = jest
      .spyOn(api, 'refreshToken')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(refreshTokenThunk());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      'refreshToken',
      expectedResult.refreshToken
    );
  });

  test('[#5.2] тест обновления токена (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: ''
    };

    const spy = jest
      .spyOn(api, 'refreshToken')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(refreshTokenThunk());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith(
      'refreshToken',
      expectedResult.refreshToken
    );
  });

  test('[#6.1] тест регистрации (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken,
      user: { email: mock.user.email, name: mock.user.name }
    };

    const spy = jest
      .spyOn(api, 'registerUserApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(registerThunk(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#6.2] тест регистрации (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest
      .spyOn(api, 'registerUserApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(registerThunk(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#7.1] тест логина (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken,
      user: { email: mock.user.email, name: mock.user.name }
    };

    const spy = jest
      .spyOn(api, 'loginUserApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(loginThunk(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#7.2] тест логина (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest
      .spyOn(api, 'loginUserApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(loginThunk(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#8.1] тест логаута (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest
      .spyOn(api, 'logoutApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(logoutThunk());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#8.2] тест логаута (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest
      .spyOn(api, 'logoutApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { user: reducer }
    });

    await store.dispatch(logoutThunk());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  test('[#9] тест очистки ошибок', () => {
    const newState = reducer(initialState, clearErrors());
    expect(newState.error).toEqual(null);
  });

  test('[#10] тест очистки информации о последнем заказе', () => {
    const newState = reducer(initialState, clearLastOrder());
    expect(newState.lastOrder).toEqual(null);
  });
});
