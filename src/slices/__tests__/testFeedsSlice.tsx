import { expect, test, describe, jest } from '@jest/globals';
import { reducer, getFeeds, getFeedById } from '../feedsSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../../cypress/fixtures/orders.json';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('тесты слайса заказов', () => {
  const initialState = mock;

  test('[#1.1] тест загрузки заказов (fulfilled)', async () => {
    const expectedResult = initialState;

    const spy = jest
      .spyOn(api, 'getFeedsApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { feeds: reducer }
    });

    expect(store.getState().feeds.isLoading).toBeTruthy();
    await store.dispatch(getFeeds());
    expect(store.getState().feeds.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { orders } = store.getState().feeds;

    expect(orders).toEqual(expectedResult.orders);
  });

  test('[#1.2] тест загрузки заказов (rejected)', async () => {
    const expectedResult = { error: undefined };

    const spy = jest
      .spyOn(api, 'getFeedsApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { feeds: reducer }
    });

    expect(store.getState().feeds.isLoading).toBeTruthy();
    await store.dispatch(getFeeds());
    expect(store.getState().feeds.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().feeds;

    expect(error).toEqual(expectedResult.error);
  });

  test('[#2.1] тест загрузки конкретного заказа (fulfilled)', async () => {
    const expectedResult = initialState;

    const spy = jest
      .spyOn(api, 'getOrderByNumberApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { feeds: reducer }
    });

    await store.dispatch(getFeedById(64656));
    expect(spy).toHaveBeenCalledTimes(1);

    const { orderData } = store.getState().feeds;

    expect(orderData).toEqual(
      expectedResult.orders.find((item) => item.number === 64656)
    );
  });

  test('[#2.2] тест загрузки конкретного заказа (rejected)', async () => {
    const expectedResult = { ...initialState, error: undefined };

    const spy = jest
      .spyOn(api, 'getOrderByNumberApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { feeds: reducer }
    });

    await store.dispatch(getFeedById(64656));
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().feeds;

    expect(error).toEqual(expectedResult.error);
  });
});
