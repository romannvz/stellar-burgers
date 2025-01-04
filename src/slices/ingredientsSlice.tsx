import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '../utils/types';

interface ingredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
  constructorItems: TConstructorIngredient[];
}

const initialState: ingredientsState = {
  ingredients: [],
  isLoading: true,
  error: null,
  constructorItems: []
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    pushIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun')
        if (state.constructorItems.some((item) => item.type === 'bun'))
          state.constructorItems = state.constructorItems.filter(
            (item) => item.type !== 'bun'
          );
      const pushingItem = state.ingredients.find(
        (item) => item._id === action.payload._id
      );
      if (pushingItem)
        state.constructorItems.push(
          Object.assign(pushingItem, {
            id: action.payload._id + Math.random().toString()
          })
        );
    },
    popIngredient(state, action: PayloadAction<TConstructorIngredient['id']>) {
      state.constructorItems = state.constructorItems.filter(
        (item) => item.id !== action.payload
      );
    },
    itemMovingUp(state, action: PayloadAction<TConstructorIngredient['id']>) {
      const index = state.constructorItems.indexOf(
        state.constructorItems.filter((item) => item.id === action.payload)[0]
      );
      const temp = state.constructorItems[index - 1];
      state.constructorItems[index - 1] = state.constructorItems[index];
      state.constructorItems[index] = temp;
    },
    itemMovingDown(state, action: PayloadAction<TConstructorIngredient['id']>) {
      const index = state.constructorItems.indexOf(
        state.constructorItems.filter((item) => item.id === action.payload)[0]
      );
      const temp = state.constructorItems[index + 1];
      state.constructorItems[index + 1] = state.constructorItems[index];
      state.constructorItems[index] = temp;
    },
    clearConstructor(state) {
      state.constructorItems = [];
    }
  },
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    ingredientsIsLoading: (state) => state.isLoading,
    ingredientsErrorSelector: (state) => state.error,
    bunsSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'bun'),
    mainsSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'main'),
    saucesSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'sauce'),
    constructorItemsSelector: (state) => state.constructorItems,
    constructorBunSelector: (state) =>
      state.constructorItems.find((item) => item.type === 'bun'),
    constructorIngredientsSelector: (state) =>
      state.constructorItems.filter((item) => item.type !== 'bun')
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  ingredientsSelector,
  ingredientsIsLoading,
  ingredientsErrorSelector,
  bunsSelector,
  mainsSelector,
  saucesSelector,
  constructorItemsSelector,
  constructorBunSelector,
  constructorIngredientsSelector
} = ingredientsSlice.selectors;

export const {
  pushIngredient,
  popIngredient,
  itemMovingUp,
  itemMovingDown,
  clearConstructor
} = ingredientsSlice.actions;

export const reducer = ingredientsSlice.reducer;
