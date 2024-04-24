import { createSlice } from '@reduxjs/toolkit';
type State = {
  web_info: {
    icon: string;
    logo: string;
    shopName: string;
    vatNumber: number;
    postCode: number;
  } | null;
};
const initialState = {
  web_info: null,
};
export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: initialState,
  reducers: {
    setWebInfo: (state, action) => {
      state.web_info = action.payload;
    },
  },
});
export const getWebInfo = (state: { page: State }) => state.page.web_info;
export const { setWebInfo } = pageSlice.actions;
export default pageSlice.reducer;
