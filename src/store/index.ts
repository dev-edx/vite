import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AmountSlice from './reducers/AmountSlice';
import SufficientSlice from './reducers/SufficientSlice';

const rootReducer = combineReducers({
	amount: AmountSlice,
	sufficientBalance: SufficientSlice
});

const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default store;
