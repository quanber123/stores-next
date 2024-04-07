import { getAuthToken } from '@/lib/utils/getAuthToken';
import providesList from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const blogApi = createApi({
  reducerPath: 'blogApi',
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
  tagTypes: ['blogs', 'blogDetails', 'comments'],
  endpoints: (builder) => {
    return {
      getBlogs: builder.query({
        query: (query) => {
          return `blogs?${query}`;
        },
        providesTags: (result) => providesList(result, 'blogs'),
      }),
      getBlogById: builder.query({
        query: (id) => `blogs/${id}`,
        providesTags: (result) => providesList(result, 'blogDetails'),
      }),
      getCommentBlog: builder.query({
        query: (id) => `blogs/${id}/comments`,
        providesTags: (result) => providesList(result, 'comments'),
      }),
      postCommentBlog: builder.mutation({
        query: ({ id, text }) => ({
          url: `blogs/${id}/comments`,
          method: 'POST',
          body: {
            text: text,
          },
        }),
        invalidatesTags: ['comments'],
      }),
    };
  },
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetCommentBlogQuery,
  usePostCommentBlogMutation,
} = blogApi;
