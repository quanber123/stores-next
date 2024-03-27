import { nextConfig } from '@/config/config';
import { getAuthToken } from '@/lib/utils/getAuthToken';
import providesList from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
console.log(nextConfig.BACKEND_URL);
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${nextConfig.BACKEND_URL}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['products'],
  endpoints: (builder) => {
    return {
      getProducts: builder.query({
        query: (query) => {
          return `products?${query}`;
        },
        providesTags: (result) => providesList(result, 'products'),
      }),
    };
  },
});

export const { useGetProductsQuery } = productApi;
