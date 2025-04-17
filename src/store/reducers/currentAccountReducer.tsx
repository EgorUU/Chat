// src/store/reducers/loginReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICurrentAccount } from "@/types/user.interface";

const initialState: ICurrentAccount = {
  id: null,
  name: "",
  email: "",
  password: ""
};

const currentAccountSlice = createSlice({
  name: 'currentAccount',
  initialState,
  reducers: {
    setAccount: (state, action) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.email = action.payload.email
        state.password = action.payload.password
        console.log("Данные добавлены");
        
    }
  }
});

// Правильный экспорт:
export default currentAccountSlice.reducer; // Дефолтный экспорт редюсера
export const { setAccount } = currentAccountSlice.actions; // Именованный экспорт экшенов