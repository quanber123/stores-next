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
  setCurDelivery,
  setToken,
  setUser,
  token,
  userInfo,
} from '@/lib/redux/slice/userSlice';
import { useSearchParams } from 'next/navigation';
import {
  useGetAddressUserQuery,
  useGetNotificationsQuery,
  useGetUserQuery,
} from '@/lib/redux/query/userQuery';
import { getWebInfo } from '@/api/webInfoApi';
import { setWebInfo } from '@/lib/redux/slice/pageSlice';
export const FetchDataContext = createContext({
  statusOrders: [] as StatusOrder[],
  categories: [] as Category[],
  tags: [] as Tag[],
  notifications: {} as any,
});
export const FetchDataProvider = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  const [statusOrders, setStatusOrders] = useState<StatusOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [notifications, setNotifications] = useState();
  const searchQuery = useSearchParams();
  const accessToken = useSelector(token);
  const user = useSelector(userInfo);
  const {
    data: userData,
    isLoading: isLoadingUser,
    isSuccess: isSuccessGetUser,
  } = useGetUserQuery(null, { skip: !accessToken });
  const { data: dataAddress, isSuccess: isSuccessAddress } =
    useGetAddressUserQuery(null, { skip: !user?.id || isLoadingUser });
  const { data: cartData, isSuccess: isSuccessCart } = useGetAllCartsQuery(
    null,
    { skip: !user?.id || isLoadingUser }
  );
  const { data: favoriteData, isSuccess: isSuccessFavorite } =
    useGetAllFavoritesQuery(null, { skip: !user?.id || isLoadingUser });
  const { data: notificationsData, isSuccess: isSuccessNotifications } =
    useGetNotificationsQuery(null, {
      pollingInterval: 60000,
      skip: !user?.id || isLoadingUser,
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusOrdersData, tagsData, categoriesData, webData] =
          await Promise.all([
            getStatusOrder(),
            getTags(),
            getCategories(),
            getWebInfo(),
          ]);
        setStatusOrders(
          statusOrdersData?.status?.sort(
            (a: StatusOrder, b: StatusOrder) => a.number - b.number
          )
        );
        setCategories(categoriesData?.categories);
        setTags(tagsData?.tags);
        dispatch(setWebInfo(webData));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);
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
    if (isSuccessAddress && dataAddress && dataAddress.address?.[0]) {
      dispatch(setCurDelivery(dataAddress.address[0]));
    }
  }, [isSuccessAddress, dataAddress, dispatch]);
  useEffect(() => {
    if (isSuccessCart && cartData) {
      dispatch(setAllCarts(cartData));
    }
    if (isSuccessFavorite && favoriteData) {
      dispatch(setAllFavorites(favoriteData));
    }
    if (isSuccessNotifications && notificationsData) {
      setNotifications(notificationsData);
    }
  }, [
    isSuccessCart,
    cartData,
    isSuccessFavorite,
    favoriteData,
    isSuccessNotifications,
    notificationsData,
    dispatch,
  ]);
  return (
    <FetchDataContext.Provider
      value={{ statusOrders, categories, tags, notifications }}
    >
      {children}
    </FetchDataContext.Provider>
  );
};
