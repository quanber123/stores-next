'use client';
import withAuth from '@/auth/withAuth';

interface RootLayoutProps {
  title: React.ReactNode;
  orders: React.ReactNode;
}
function CartLayout({ title, orders }: RootLayoutProps): JSX.Element {
  return (
    <div className='container m-auto px-4'>
      {title}
      {orders}
    </div>
  );
}
export default withAuth(CartLayout);
