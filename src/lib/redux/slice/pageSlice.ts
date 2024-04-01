import { createSlice } from '@reduxjs/toolkit';
type State = {
  logoUrl: string;
};
const initialState: State = {
  logoUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}public/images/logo-01.png.webp`,
};

export const pageSlice = createSlice({
  name: 'pageSlice',
  initialState: initialState,
  reducers: {},
});
export const getLogoUrl = (state: { page: State }) => state.page.logoUrl;
export default pageSlice.reducer;
