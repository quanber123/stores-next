'use client';
import { getStatusOrder } from '@/api/statusApi';
import { setStatusOrder } from '@/lib/redux/slice/pageSlice';
import { StatusOrder } from '@/types/types';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const StatusOrderContext = createContext(null);

export const StatusOrderProvider = ({ children }: { children: any }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatusOrder();
        dispatch(
          setStatusOrder(
            data.sort((a: StatusOrder, b: StatusOrder) => a.number - b.number)
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);
  return (
    <StatusOrderContext.Provider value={null}>
      {children}
    </StatusOrderContext.Provider>
  );
};
