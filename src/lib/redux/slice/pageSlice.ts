import { StatusOrder } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';
type State = {
  statusOrder: StatusOrder[] | [];
};
const initialState: State = {
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
export const getAllStatusOrder = (state: { page: State }) =>
  state.page.statusOrder;
export const { setStatusOrder } = pageSlice.actions;
export default pageSlice.reducer;
