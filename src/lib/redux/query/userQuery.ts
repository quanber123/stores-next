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
  tagTypes: ['users', 'notifications', 'address'],
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
      userRegister: builder.mutation({
        query: (form) => ({
          url: 'auth/register',
          method: 'POST',
          body: form,
        }),
      }),
      verifiedEmail: builder.mutation({
        query: ({ code, email }) => ({
          url: 'auth/verify-email',
          method: 'POST',
          body: {
            code: code,
            email: email,
          },
        }),
      }),
      resendEmail: builder.mutation({
        query: (email) => ({
          url: 'auth/send-code-email',
          method: 'POST',
          body: {
            email: email,
          },
        }),
      }),
      updateProfile: builder.mutation({
        query: ({ id, name, value }) => ({
          url: `users/profile`,
          method: 'PUT',
          body: {
            id: id,
            name: name,
            value: value,
          },
        }),
        invalidatesTags: [{ type: 'users', id: 'LIST' }],
      }),
      updateAvatar: builder.mutation({
        query: ({ id, file }) => ({
          url: `users/${id}/avatar`,
          method: 'PUT',
          body: file,
        }),
        invalidatesTags: [{ type: 'users', id: 'LIST' }],
      }),
      getNotifications: builder.query({
        query: (search) => ({
          url: search ? `notifications?${search}` : 'notifications',
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'notifications'),
      }),
      updateNotifications: builder.mutation({
        query: ({ id, read }) => ({
          url: `notifications/${id}`,
          method: 'PUT',
          body: {
            read: read,
          },
        }),
        invalidatesTags: ['notifications'],
      }),
      deleteNotifications: builder.mutation({
        query: (id) => ({
          url: `notifications/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['notifications'],
      }),
      getAddressUser: builder.query({
        query: () => ({
          url: 'users/address',
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'address'),
      }),
      createAddress: builder.mutation({
        query: (body) => ({
          url: 'users/address',
          method: 'POST',
          body: body,
        }),
        invalidatesTags: ['address'],
      }),
      updateAddress: builder.mutation({
        query: ({ id, body }) => ({
          url: `users/address/${id}`,
          method: 'PUT',
          body: body,
        }),
        invalidatesTags: ['address'],
      }),
      deleteAddress: builder.mutation({
        query: (id) => ({
          url: `users/address/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['address'],
      }),
      sendContact: builder.mutation({
        query: (body) => ({
          url: `contact`,
          method: 'POST',
          body: body,
        }),
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useUserLoginMutation,
  useUserRegisterMutation,
  useVerifiedEmailMutation,
  useResendEmailMutation,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
  useDeleteNotificationsMutation,
  useGetAddressUserQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSendContactMutation,
} = userApi;
