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
  tagTypes: ['products', 'productDetails', 'carts', 'favorites'],
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
      getAllCarts: builder.query({
        query: () => ({
          url: `carts`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'carts'),
      }),
      createCart: builder.mutation({
        query: ({ cart }) => ({
          url: 'carts',
          method: 'POST',
          body: {
            cart: cart,
          },
        }),
        invalidatesTags: ['carts'],
      }),
      updateCart: builder.mutation({
        query: ({ id, product }) => ({
          url: `carts/${id}`,
          method: 'PUT',
          body: {
            product: product,
          },
        }),
        invalidatesTags: ['carts'],
      }),
      deleteCartById: builder.mutation({
        query: (id) => ({
          url: `carts/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['carts'],
      }),
      deleteManyCartsById: builder.mutation({
        query: ({ products }) => ({
          url: 'carts',
          method: 'DELETE',
          body: {
            products: products,
          },
        }),
        invalidatesTags: ['carts'],
      }),
      getFavoriteByProduct: builder.query({
        query: (productId) => `/products/favorite/${productId}`,
        providesTags: (result) => providesList(result, 'favorites'),
      }),
      getAllFavorites: builder.query({
        query: () => ({
          url: `users/favorites`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'favorites'),
      }),
      postFavorites: builder.mutation({
        query: (productId) => ({
          url: 'users/favorites',
          method: 'POST',
          body: {
            productId: productId,
          },
        }),
        invalidatesTags: ['favorites'],
      }),
    };
  },
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useGetAllCartsQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartByIdMutation,
  useDeleteManyCartsByIdMutation,
  useGetFavoriteByProductQuery,
  useGetAllFavoritesQuery,
  usePostFavoritesMutation,
} = productApi;
