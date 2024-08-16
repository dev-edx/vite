import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inSufficient: false,
};

const sufficientSlice = createSlice({
  name: 'inSufficient',
  initialState,
  reducers: {
    setInSufficient: (state, action) => {
      state.inSufficient = action.payload;
    },
  },
});

export const { setInSufficient } = sufficientSlice.actions;

export default sufficientSlice.reducer;
