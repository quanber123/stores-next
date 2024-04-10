'use client';
import { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '@/api/categoryApi';
import { getStatusOrder } from '@/api/statusApi';
import { getTags } from '@/api/tagApi';
import { Category, StatusOrder, Tag } from '@/types/types';
import {
  useGetAllCartsQuery,
  useGetAllFavoritesQuery,
} from '@/lib/redux/query/productQuery';
import {
  setAllCarts,
  setAllFavorites,
  setToken,
  setUser,
  token,
  userInfo,
} from '@/lib/redux/slice/userSlice';
import { useSearchParams } from 'next/navigation';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
export const FetchDataContext = createContext({
  statusOrders: [] as StatusOrder[],
  categories: [] as Category[],
  tags: [] as Tag[],
});
export const FetchDataProvider = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const [statusOrders, setStatusOrders] = useState<StatusOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const searchQuery = useSearchParams();
  const accessToken = useSelector(token);
  const user = useSelector(userInfo);
  const { data: userData, isSuccess: isSuccessGetUser } = useGetUserQuery(
    null,
    { skip: !accessToken }
  );
  const { data: cartData, isSuccess: isSuccessCart } = useGetAllCartsQuery(
    null,
    { skip: !user?.id }
  );
  const { data: favoriteData, isSuccess: isSuccessFavorite } =
    useGetAllFavoritesQuery(null, { skip: !user?.id });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusOrdersData, tagsData, categoriesData] = await Promise.all([
          getStatusOrder(),
          getTags(),
          getCategories(),
        ]);
        setStatusOrders(
          statusOrdersData.sort(
            (a: StatusOrder, b: StatusOrder) => a.number - b.number
          )
        );
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const token = searchQuery.get('token');
    if (token) {
      dispatch(setToken({ accessToken: token }));
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (isSuccessGetUser) {
      dispatch(setUser(userData));
    }
  }, [isSuccessGetUser, userData, dispatch]);
  useEffect(() => {
    if (isSuccessCart && cartData) {
      dispatch(setAllCarts(cartData));
    }
    if (isSuccessFavorite && favoriteData) {
      dispatch(setAllFavorites(favoriteData));
    }
  }, [isSuccessCart, cartData, isSuccessFavorite, favoriteData, dispatch]);
  return (
    <FetchDataContext.Provider value={{ statusOrders, categories, tags }}>
      {children}
    </FetchDataContext.Provider>
  );
};
