import LoadingItem from '@/components/(ui)/loadingItem';

export default async function Loading() {
  return (
    <LoadingItem
      sectionClass='w-full lg:w-2/3'
      heightItem='h-[500px]'
      amount={8}
    />
  );
}
