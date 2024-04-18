'use client';
import Breadcrumbs from '@/components/(ui)/breadcrumbs';
import { usePathname } from 'next/navigation';
import React from 'react';
export default function Title() {
  const pathname = usePathname();
  return <Breadcrumbs pathname={pathname} name='cart' />;
}
