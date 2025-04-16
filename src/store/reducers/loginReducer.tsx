// src/store/reducers/loginReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface LoginState {
  email: string;
  password: string;
}

const initialState: LoginState = {
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