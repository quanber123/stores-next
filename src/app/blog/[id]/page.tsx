'use client';
import { useGetBlogByIdQuery } from '@/lib/redux/query/blogQuery';
import { useParams } from 'next/navigation';
import React from 'react';

function BlogDetails() {
  const { id } = useParams();
  console.log(id);
  const { data } = useGetBlogByIdQuery(id);
  console.log(data);
  return <div>BlogDetails</div>;
}

export default BlogDetails;
