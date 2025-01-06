import { expect, test, describe, jest } from '@jest/globals';
import {
  reducer,
  pushIngredient,
  popIngredient,
  itemMovingUp,
  itemMovingDown,
  getIngredients,
  clearConstructor
} from '../ingredientsSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../../cypress/fixtures/ingredients.json';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('тесты слайса ингредиентов', () => {
  const initialState = {
    ingredients: mock.data,
    isLoading: false,
    error: null,
    constructorItems: [
      {
        _id: 'ingredient2',
        name: 'Тестовая котлета',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'ingredient2'
      },
      {
        _id: 'ingredient3',
        name: 'Тестовое филе',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        id: 'ingredient3'
      }
    ]
  };

  test('[#0.1] тест загрузки ингредиентов (fulfilled)', async () => {
    const expectedResult = initialState.ingredients;

    const spy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockImplementation(() => Promise.resolve(expectedResult));

    const store = configureStore({
      reducer: { ingredients: reducer }
    });

    expect(store.getState().ingredients.isLoading).toBeTruthy();
    await store.dispatch(getIngredients());
    expect(store.getState().ingredients.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { ingredients } = store.getState().ingredients;

    expect(ingredients).toEqual(expectedResult);
  });

  test('[#0.2] тест загрузки ингредиентов (rejected)', async () => {
    const expectedResult = { error: undefined };

    const spy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockImplementation(() => Promise.reject(expectedResult));

    const store = configureStore({
      reducer: { ingredients: reducer }
    });

    expect(store.getState().ingredients.isLoading).toBeTruthy();
    await store.dispatch(getIngredients());
    expect(store.getState().ingredients.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().ingredients;

    expect(error).toEqual(expectedResult.error);
  });

  test('[#1] добавить ингредиент', () => {
    const newState = reducer(
      initialState,
      pushIngredient({
        _id: 'ingredient4',
        name: 'Тестовый соус',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
      })
    );

    const result: {}[] = [];

    newState.constructorItems.forEach((item) => {
      const temp = Object.entries(item);
      temp.pop();
      result.push(Object.fromEntries(temp));
    });

    const expectedResult = [
      {
        _id: 'ingredient2',
        name: 'Тестовая котлета',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
      },
      {
        _id: 'ingredient3',
        name: 'Тестовое филе',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      },
      {
        _id: 'ingredient4',
        name: 'Тестовый соус',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  test('[#2] удалить ингредиент', () => {
    const newState = reducer(initialState, popIngredient('ingredient2'));

    const result: {}[] = [];

    newState.constructorItems.forEach((item) => {
      const temp = Object.entries(item);
      temp.pop();
      result.push(Object.fromEntries(temp));
    });

    const expectedResult = [
      {
        _id: 'ingredient3',
        name: 'Тестовое филе',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
      }
    ];

    expect(result).toEqual(expectedResult);
  });

  test(`[#3] 'поднять' ингредиент`, () => {
    const newState = reducer(initialState, itemMovingUp('ingredient3'));

    const expectedResult = [
      {
        _id: 'ingredient3',
        name: 'Тестовое филе',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        id: 'ingredient3'
      },
      {
        _id: 'ingredient2',
        name: 'Тестовая котлета',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'ingredient2'
      }
    ];

    expect(newState.constructorItems).toEqual(expectedResult);
  });

  test(`[#4] 'опустить' ингредиент`, () => {
    const newState = reducer(initialState, itemMovingDown('ingredient2'));

    const expectedResult = [
      {
        _id: 'ingredient3',
        name: 'Тестовое филе',
        type: 'main',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/meat-03.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
        id: 'ingredient3'
      },
      {
        _id: 'ingredient2',
        name: 'Тестовая котлета',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'ingredient2'
      }
    ];

    expect(newState.constructorItems).toEqual(expectedResult);
  });

  test(`[#5] очистить конструктор`, () => {
    const newState = reducer(initialState, clearConstructor());

    expect(newState.constructorItems).toEqual([]);
  });
});
