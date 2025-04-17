// src/store/reducers/loginReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoginState } from "@/types/user.interface";

const initialState: ILoginState = {
  email: "",
  password: ""
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    }
  }
});

// Правильный экспорт:
export default loginSlice.reducer; // Дефолтный экспорт редюсера
export const { setEmail, setPassword } = loginSlice.actions; // Именованный экспорт экшенов