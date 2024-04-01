import { getAuthToken } from '@/lib/utils/getAuthToken';
import providesList from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}api`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['products', 'productDetails'],
  endpoints: (builder) => {
    return {
      getProducts: builder.query({
        query: (query) => {
          return `products?${query}`;
        },
        providesTags: (result) => providesList(result, 'products'),
      }),
      getProductsById: builder.query({
        query: (id) => {
          return `products/${id}`;
        },
        providesTags: (result) => providesList(result, 'productDetails'),
      }),
    };
  },
});

export const { useGetProductsQuery, useGetProductsByIdQuery } = productApi;