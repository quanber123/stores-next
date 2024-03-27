'use client';
import React from 'react';

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  return <div>{id}</div>;
}
