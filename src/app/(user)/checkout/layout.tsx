'use client';
import withAuth from '@/auth/withAuth';

interface RootLayoutProps {
  title: React.ReactNode;
  orders: React.ReactNode;
}
function CheckoutLayout({ title, orders }: RootLayoutProps): JSX.Element {
  return (
    <div className='container m-auto flex flex-col py-8 px-4'>
      {title}
      {orders}
    </div>
  );
}

export default withAuth(CheckoutLayout);
