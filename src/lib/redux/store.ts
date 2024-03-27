import { productApi } from './query/productQuery';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
