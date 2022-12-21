import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { walletReducer } from "./wallet/reducer";

export const store = configureStore({
  reducer: combineReducers({
    wallet: walletReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
