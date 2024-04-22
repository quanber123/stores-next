'use client';
import withAuth from '@/auth/withAuth';
import { useRouter } from 'next/navigation';
import SubNav from './_components/subNav';
import { Icons } from '@/enum/enum';
type LayoutProps = {
  children: React.ReactNode;
};
function AccountLayout({ children }: LayoutProps): JSX.Element {
  const router = useRouter();
  return (
    <div className='pb-8 flex flex-col gap-12'>
      <section className='py-12 bg-neutral-100 text-neutral-700 text-lg md:text-2xl font-bold'>
        <div className='px-4 container m-auto flex justify-between items-center'>
          <h1>Dashboard</h1>
          <div className='flex items-center gap-2'>
            <button
              className='text-violet-500'
              onClick={() => router.push('/')}
              aria-label='home-btn'
              dangerouslySetInnerHTML={{ __html: Icons.home_icon }}
            ></button>
            <span dangerouslySetInnerHTML={{ __html: Icons.right_icon }}></span>
            <p className='text-sm'>Dashboard</p>
          </div>
        </div>
      </section>
      <section className='container m-auto px-4 flex gap-8'>
        <SubNav />
        <div className='w-full py-8 bg-neutral-100 rounded-2xl'>{children}</div>
      </section>
    </div>
  );
}
export default withAuth(AccountLayout);
