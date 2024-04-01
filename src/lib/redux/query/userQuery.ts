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
  tagTypes: ['users', 'settings', 'address'],
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
      getSettings: builder.query({
        query: (id) => ({
          url: `settings/${id}`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'settings'),
      }),
      updatedSettings: builder.mutation({
        query: ({ id, enabled, idNotify }) => ({
          url: 'settings',
          method: 'PUT',
          body: {
            id: id,
            enabled: enabled,
            idNotify: idNotify,
          },
        }),
        invalidatesTags: [{ type: 'settings', id: 'LIST' }],
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
  useGetSettingsQuery,
  useUpdatedSettingsMutation,
  useGetAddressUserQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSendContactMutation,
} = userApi;
