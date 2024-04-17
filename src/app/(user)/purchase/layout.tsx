'use client';
import withAuth from '@/auth/withAuth';

interface RootLayoutProps {
  orders: React.ReactNode;
  filter: React.ReactNode;
}
function PurchaseLayout({ filter, orders }: RootLayoutProps): JSX.Element {
  return (
    <div className='container m-auto px-4'>
      {filter}
      {orders}
    </div>
  );
}
export default withAuth(PurchaseLayout);
