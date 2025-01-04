import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '../utils/types';

interface feedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
  orderData: TOrder | null;
}

const initialState: feedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
  orderData: null
};

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const getFeedById = createAsyncThunk(
  'feeds/getOne',
  async (id: number) => getOrderByNumberApi(id)
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.orders,
    feedsIsLoading: (state) => state.isLoading,
    totalOrderSelector: (state) => state.total,
    totalTodayOrderSelector: (state) => state.totalToday,
    orderDataSelector: (state) => state.orderData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedById.pending, (state) => {
        state.error = null;
        state.orderData = null;
      })
      .addCase(getFeedById.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getFeedById.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
  }
});

export const {
  ordersSelector,
  feedsIsLoading,
  totalOrderSelector,
  totalTodayOrderSelector,
  orderDataSelector
} = feedsSlice.selectors;

export const reducer = feedsSlice.reducer;
