import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  refreshToken,
  loginUserApi,
  TLoginData,
  registerUserApi,
  TRegisterData,
  logoutApi,
  orderBurgerApi,
  getFeedsApi,
  updateUserApi
} from '../utils/burger-api';
import { TOrder, TUser } from '../utils/types';

interface userState {
  user: TUser;
  isLoading: boolean;
  isAuth: boolean;
  error: string | null | undefined;
  orders: TOrder[];
  sendingOrder: boolean;
  lastOrder: TOrder | null;
}

const initialState: userState = {
  user: { email: '', name: '' },
  isLoading: false,
  isAuth: localStorage.getItem('refreshToken') ? true : false,
  error: null,
  orders: [],
  sendingOrder: false,
  lastOrder: null
};

export const updateUserData = createAsyncThunk(
  'user/newData',
  async (data: TRegisterData) => await updateUserApi(data)
);

export const postOrder = createAsyncThunk(
  'user/newOrder',
  async (ingr: string[]) => await orderBurgerApi(ingr)
);

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const getUserInfo = createAsyncThunk(
  'user/getInfo',
  async () => await getUserApi()
);

export const refreshTokenThunk = createAsyncThunk(
  'user/getToken',
  async () => await refreshToken()
);

export const registerThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const loginThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const logoutThunk = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
    clearLastOrder(state) {
      state.lastOrder = null;
    }
  },
  selectors: {
    errorSelector: (state) => state.error,
    userDataSelector: (state) => state.user,
    userAuthSelector: (state) => state.isAuth,
    userIsLoading: (state) => state.isLoading,
    userOrders: (state) => state.orders,
    orderIsSending: (state) => state.sendingOrder,
    lastOrder: (state) => state.lastOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.isLoading = false;
      })

      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuth = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.isAuth = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.error = null;
        state.user = action.payload.user;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })

      .addCase(refreshTokenThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })

      .addCase(postOrder.pending, (state) => {
        state.sendingOrder = true;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.sendingOrder = false;
        state.error = action.error.message;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.sendingOrder = false;
        state.lastOrder = action.payload.order;
      })

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
      })

      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })

      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { email: '', name: '' };
        localStorage.setItem('refreshToken', '');
        state.isAuth = false;
        state.error = null;
      });
  }
});

export const {
  userDataSelector,
  userAuthSelector,
  userIsLoading,
  userOrders,
  errorSelector,
  orderIsSending,
  lastOrder
} = userSlice.selectors;

export const { clearErrors, clearLastOrder } = userSlice.actions;

export const reducer = userSlice.reducer;
