import { getAuthToken } from '@/lib/utils/getAuthToken';
import providesList from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['users'],
  endpoints: (builder) => {
    return {
      getUser: builder.query({
        query: () => {
          return `auth/get-user`;
        },
        providesTags: (result) => providesList(result, 'users'),
      }),
      userLogin: builder.mutation({
        query: (body) => ({
          url: 'auth/login',
          method: 'POST',
          body: body,
        }),
      }),
    };
  },
});

export const { useGetUserQuery, useUserLoginMutation } = userApi;
