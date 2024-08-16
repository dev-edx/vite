import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  amount: 0,
};

const amountSlice = createSlice({
  name: 'amount',
  initialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});

export const { setAmount } = amountSlice.actions;

export default amountSlice.reducer;
