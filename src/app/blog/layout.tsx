import type { Metadata } from 'next';

interface RootLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  filter: React.ReactNode;
  blog: React.ReactNode;
}
export const metadata: Metadata = {
  title: 'BLOG',
};
export default async function BlogLayout({
  children,
  title,
  filter,
  blog,
}: RootLayoutProps): Promise<JSX.Element> {
  return (
    <>
      {children}
      <div className='flex flex-col items-center gap-[24px]'>
        {title}
        <section className='container px-4 m-auto flex items-start flex-col lg:flex-row-reverse gap-20'>
          {filter}
          {blog}
        </section>
      </div>
    </>
  );
}
