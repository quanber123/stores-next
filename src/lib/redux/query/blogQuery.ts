import { nextConfig } from '@/config/config';
import { getAuthToken } from '@/lib/utils/getAuthToken';
import providesList from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const blogApi = createApi({
  reducerPath: 'blogApi',
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
  tagTypes: ['blogs'],
  endpoints: (builder) => {
    return {
      getBlogs: builder.query({
        query: (query) => {
          return `blogs?${query}`;
        },
        providesTags: (result) => providesList(result, 'blogs'),
      }),
    };
  },
});

export const { useGetBlogsQuery } = blogApi;
