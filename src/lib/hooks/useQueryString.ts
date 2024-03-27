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
      value && params.set(name, value);
      router.push(pathname + '?' + params.toString());
    },
    [searchQuery, pathname, router]
  );

  const deleteQueryString = useCallback(() => {
    router.push(pathname + '?' + 'page=1');
  }, []);

  return [createQueryString, deleteQueryString];
};

export default useQueryString;
