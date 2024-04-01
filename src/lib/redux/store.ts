import { blogApi } from './query/blogQuery';
import { productApi } from './query/productQuery';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import pageReducer from './slice/pageSlice';
import { userApi } from './query/userQuery';
export const store = configureStore({
  reducer: {
    user: userReducer,
    page: pageReducer,
    [productApi.reducerPath]: productApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      blogApi.middleware,
      userApi.middleware
    ),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
