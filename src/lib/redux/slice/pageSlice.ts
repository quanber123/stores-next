import { StatusOrder } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type State = {
  logoUrl: string;
  statusOrder: StatusOrder[] | [];
};
const initialState: State = {
  logoUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}public/images/logo-01.png.webp`,
  statusOrder: [],
};
export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: initialState,
  reducers: {
    setStatusOrder: (state, action) => {
      state.statusOrder = action.payload;
    },
  },
});
export const getLogoUrl = (state: { page: State }) => state.page.logoUrl;
export const getAllStatusOrder = (state: { page: State }) =>
  state.page.statusOrder;
export const { setStatusOrder } = pageSlice.actions;
export default pageSlice.reducer;
