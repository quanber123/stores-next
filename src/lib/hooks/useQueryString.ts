import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useQueryString = (): [
  (name: string, value?: string) => void,
  () => void
] => {
  const searchQuery = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchQuery.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchQuery, pathname]
  );

  const deleteQueryString = useCallback(() => {
    router.push(pathname + '?' + 'page=1', { scroll: true });
  }, [router, pathname]);

  return [createQueryString, deleteQueryString];
};

export default useQueryString;
