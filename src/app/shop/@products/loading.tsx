import LoadingItem from '@/components/(ui)/loadingItem';
export default function Loading() {
  return (
    <LoadingItem
      sectionClass={
        'container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]'
      }
      heightItem='h-[420px]'
      amount={8}
    />
  );
}
