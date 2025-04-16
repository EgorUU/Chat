// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginSlice from './reducers/loginReducer'; // Импорт по умолчанию
import registerSlice from './reducers/registerReducer'
import currentAccountSlice from './reducers/currentAccountReducer'
const store = configureStore({
  reducer: {
    login: loginSlice, // Правильное подключение редюсера
    register: registerSlice,
    currentAccount: currentAccountSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;