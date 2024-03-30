import { Address, Cart, Favorite, User } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type State = {
  token: string | null;
  user: null | User;
  curDelivery: Address;
  cart: {
    cart: Cart[];
    total: number;
  };
  favorite: {
    favorite: Favorite;
    total: number;
  };
};
const initialState: State = {
  token:
    typeof window !== 'undefined'
      ? window.localStorage.getItem('coza-store-token') || null
      : null,
  user: null,
  curDelivery: {} as Address,
  cart: {
    cart: [],
    total: 0,
  },
  favorite: {
    favorite: {} as Favorite,
    total: 0,
  },
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.accessToken;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCurDelivery: (state, action) => {
      state.curDelivery = action.payload;
    },
    setAllCarts: (state, action) => {
      state.cart.cart = action.payload.cart;
      state.cart.total = action.payload.total;
    },
    setAllFavorites: (state, action) => {
      state.favorite.favorite = action.payload.favorite;
      state.favorite.total = action.payload.total;
    },
    removeAuth: (state) => {
      window.localStorage.removeItem('coza-store-token');
      state.curDelivery = {} as Address;
      state.cart = {
        cart: [],
        total: 0,
      };
      state.favorite = {
        favorite: {} as Favorite,
        total: 0,
      };
    },
  },
});
export const token = (state: { user: State }) => state.user.token;
export const userInfo = (state: { user: State }) => state.user.user;
export const getCurAddress = (state: { user: State }) => state.user.curDelivery;
export const getAllCarts = (state: { user: State }) => state.user.cart;
export const getAllFavorites = (state: { user: State }) => state.user.favorite;
export const {
  setUser,
  setCurDelivery,
  setAllCarts,
  setAllFavorites,
  removeAuth,
} = userSlice.actions;
export default userSlice.reducer;
