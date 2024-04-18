'use client';
import withAuth from '@/auth/withAuth';
import dynamic from 'next/dynamic';

const DynamicFilter = dynamic(() => import('./_components/filter'));
const DynamicOrders = dynamic(() => import('./_components/orders'));
function Purchase() {
  return (
    <div className='container m-auto px-4'>
      <DynamicFilter />
      <DynamicOrders />
    </div>
  );
}
export default withAuth(Purchase);
